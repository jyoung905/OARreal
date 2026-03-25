import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  name: process.env.SMTP_EHLO_NAME,
});

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName, phone, email, bestTime, preferredContact,
      accidentDate, accidentType, location, atFault, description,
      injuries, treatment, missedWork, vehicleDamage,
      hasLawyer, reportedToInsurance, currentStatus,
    } = body;

    const subject = `New lead: ${fullName || 'Unknown'} — ${phone || email || '—'}`;

    const html = `
      <h2 style="color:#001b44">New Lead – Ontario Accident Review</h2>
      <h3>Contact</h3>
      <p><b>Name:</b> ${fullName || '—'}<br>
      <b>Phone:</b> ${phone || '—'}<br>
      <b>Email:</b> ${email || '—'}<br>
      <b>Best time:</b> ${bestTime || '—'}<br>
      <b>Preferred contact:</b> ${preferredContact || '—'}</p>
      <h3>Accident</h3>
      <p><b>Date:</b> ${accidentDate || '—'}<br>
      <b>Type:</b> ${accidentType || '—'}<br>
      <b>Location:</b> ${location || '—'}<br>
      <b>At fault:</b> ${atFault || '—'}<br>
      <b>Description:</b> ${description || '—'}</p>
      <h3>Impact</h3>
      <p><b>Injuries:</b> ${injuries || '—'}<br>
      <b>Treatment:</b> ${treatment || '—'}<br>
      <b>Missed work:</b> ${missedWork || '—'}<br>
      <b>Vehicle damage:</b> ${vehicleDamage || '—'}</p>
      <h3>Current Status</h3>
      <p><b>Has lawyer:</b> ${hasLawyer || '—'}<br>
      <b>Reported to insurance:</b> ${reportedToInsurance || '—'}<br>
      <b>Current status:</b> ${currentStatus || '—'}</p>
    `;

    const tgText = `🚨 <b>New Lead</b>\n<b>Name:</b> ${fullName || '—'}\n<b>Phone:</b> ${phone || '—'}\n<b>Email:</b> ${email || '—'}\n<b>Accident:</b> ${accidentType || '—'} on ${accidentDate || '—'}\n<b>Contact pref:</b> ${preferredContact || '—'}, ${bestTime || '—'}`;

    await Promise.all([
      transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Ontario Accident Review'}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: process.env.LEAD_ALERT_EMAIL_TO || 'ontarioaccidentreview@gmail.com',
        subject,
        html,
      }),
      sendTelegram(tgText),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Intake route error:', err);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
