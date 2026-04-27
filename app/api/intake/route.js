import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { appendSubmission, sanitizeLead } from '@/lib/intake';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitBuckets = globalThis.__oarIntakeRateLimitBuckets || new Map();
globalThis.__oarIntakeRateLimitBuckets = rateLimitBuckets;

function sanitizeError(err) {
  return err instanceof Error ? err.message.slice(0, 240) : 'Unknown error';
}

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  bucket.count += 1;
  rateLimitBuckets.set(ip, bucket);
  return bucket.count <= RATE_LIMIT_MAX;
}

function hashIp(ip) {
  if (!ip || ip === 'unknown') return '';
  const salt = process.env.IP_HASH_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || 'oar-default-ip-salt';
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

function logIntake(event) {
  console.info('[OAR intake]', JSON.stringify({
    timestamp: new Date().toISOString(),
    submissionId: event.submissionId || null,
    captureSuccess: Boolean(event.captureSuccess),
    notificationSuccess: Boolean(event.notificationSuccess),
    notificationResults: event.notificationResults || {},
    captureMode: event.captureMode || null,
    error: event.error ? sanitizeError(event.error) : null,
  }));
}

function hasEmailConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM_EMAIL);
}

function createTransporter() {
  if (!hasEmailConfig()) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
    name: process.env.SMTP_EHLO_NAME,
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { skipped: true };
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  if (!response.ok) throw new Error(`Telegram failed with ${response.status}`);
  return { skipped: false };
}

async function sendEmail({ subject, html }) {
  const transporter = createTransporter();
  if (!transporter) return { skipped: true };
  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'Ontario Accident Review'}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: process.env.LEAD_ALERT_EMAIL_TO || 'ontarioaccidentreview@gmail.com',
    subject,
    html,
  });
  return { skipped: false };
}

function buildNotifications(data, submissionId) {
  const safe = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, escapeHtml(value)]));
  const subject = `New OAR lead ${submissionId}: ${data.fullName || 'Unknown'} ${data.phone || data.email || ''}`;

  const html = `
    <h2 style="color:#001b44">New Lead - Ontario Accident Review</h2>
    <p><b>Submission ID:</b> ${escapeHtml(submissionId)}</p>
    <h3>Contact</h3>
    <p><b>Name:</b> ${safe.fullName || '—'}<br>
    <b>Phone:</b> ${safe.phone || '—'}<br>
    <b>Email:</b> ${safe.email || '—'}<br>
    <b>Best time:</b> ${safe.bestTime || '—'}<br>
    <b>Preferred contact:</b> ${safe.contactMethod || '—'}</p>
    <h3>Accident</h3>
    <p><b>Date:</b> ${safe.accidentDate || '—'}<br>
    <b>Type:</b> ${safe.accidentType || '—'}<br>
    <b>Location:</b> ${safe.cityArea || '—'}<br>
    <b>In Ontario:</b> ${safe.inOntario || '—'}<br>
    <b>Main issue:</b> ${safe.claimStatus || '—'}<br>
    <b>Description:</b> ${safe.accidentSummary || '—'}</p>
    <h3>Impact</h3>
    <p><b>Injured:</b> ${safe.injured || '—'}<br>
    <b>Treatment coverage:</b> ${safe.medicalAttention || '—'}<br>
    <b>Work impact:</b> ${safe.workImpact || '—'}<br>
    <b>Ongoing symptoms:</b> ${safe.ongoingSymptoms || '—'}<br>
    <b>Details:</b> ${safe.injuryDetails || '—'}</p>
    ${safe.additionalNotes ? `<h3>Additional Notes</h3><p>${safe.additionalNotes}</p>` : ''}
  `;

  const tgText = `🚨 <b>New OAR Lead</b>

🆔 <b>${escapeHtml(submissionId)}</b>
👤 <b>${safe.fullName || '—'}</b>
📞 ${safe.phone || '—'} | 📧 ${safe.email || '—'}
📍 ${safe.cityArea || '—'}
📅 ${safe.accidentDate || '—'}
🚗 ${safe.accidentType || '—'}
🩹 Injured: ${safe.injured || '—'}
📋 Main issue: ${safe.claimStatus || '—'}

${safe.accidentSummary || safe.additionalNotes || 'No message provided.'}`;

  return { subject, html, tgText };
}

export async function POST(request) {
  let submissionId = null;
  const ip = getClientIp(request);

  try {
    if (!checkRateLimit(ip)) {
      logIntake({ captureSuccess: false, notificationSuccess: false, error: 'Rate limit exceeded' });
      return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();

    // Honeypot fields. Real users never see/fill these.
    if (body.website || body.company || body.confirmEmail) {
      logIntake({ captureSuccess: false, notificationSuccess: false, error: 'Spam honeypot triggered' });
      return NextResponse.json({ error: 'Submission rejected.' }, { status: 400 });
    }

    const record = sanitizeLead({
      ...body,
      userAgent: body.userAgent || request.headers.get('user-agent') || '',
      ipHash: body.ipHash || hashIp(ip),
    });
    submissionId = record.id;

    // Durable capture must happen before any notification and before success response.
    const capture = await appendSubmission(record);

    const { data } = record;
    const notificationPayload = buildNotifications(data, submissionId);
    const notificationResults = { email: 'pending', telegram: 'pending' };

    await Promise.allSettled([
      sendTelegram(notificationPayload.tgText),
      sendEmail({ subject: notificationPayload.subject, html: notificationPayload.html }),
    ]).then(results => {
      const [telegram, email] = results;
      notificationResults.telegram = telegram.status === 'fulfilled' ? (telegram.value?.skipped ? 'skipped' : 'sent') : `failed: ${sanitizeError(telegram.reason)}`;
      notificationResults.email = email.status === 'fulfilled' ? (email.value?.skipped ? 'skipped' : 'sent') : `failed: ${sanitizeError(email.reason)}`;
    });

    const notificationSuccess = ['sent', 'skipped'].includes(notificationResults.email) && ['sent', 'skipped'].includes(notificationResults.telegram);
    logIntake({ submissionId, captureSuccess: true, notificationSuccess, notificationResults, captureMode: capture?.mode });

    return NextResponse.json({ success: true, id: submissionId, status: record.review.status, testLead: record.review.status === 'test', captureMode: capture?.mode });
  } catch (err) {
    logIntake({ submissionId, captureSuccess: false, notificationSuccess: false, error: err });
    const message = err instanceof Error && err.message.startsWith('Missing required field:')
      ? err.message
      : 'Failed to capture submission. Please try again.';
    const status = message.startsWith('Missing required field:') || message.includes('required') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
