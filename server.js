const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const crypto = require('crypto');
const net = require('net');
const tls = require('tls');

loadEnvFile(path.join(__dirname, '.env'));

const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.jsonl');
const DASHBOARD_STATE_FILE = path.join(DATA_DIR, 'lead-dashboard-state.json');
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const APP_NAME = process.env.LEAD_SENDER_NAME || 'Ontario Accident Review';
const EMAIL_TO = process.env.LEAD_ALERT_EMAIL_TO || 'youngmlse@yahoo.com';
const DASHBOARD_ALLOW_REMOTE = String(process.env.DASHBOARD_ALLOW_REMOTE || 'false').toLowerCase() === 'true';
const DASHBOARD_PASSWORD = String(process.env.DASHBOARD_PASSWORD || '').trim();
const DASHBOARD_SESSION_TTL_HOURS = Number(process.env.DASHBOARD_SESSION_TTL_HOURS || 12);
const DASHBOARD_USING_PLACEHOLDER_PASSWORD = ['change-this-before-use', 'changeme', 'password'].includes(DASHBOARD_PASSWORD.toLowerCase());
const DASHBOARD_SESSIONS = new Map();

const LEAD_STATUSES = ['new', 'reviewing', 'need docs / follow-up', 'good fit', 'ready to hand off', 'sent to firm', 'not a fit', 'duplicate', 'spam', 'closed'];
const FOLLOW_UP_PRIORITIES = ['today', 'this week', 'watch', 'none'];
const REQUESTED_DOC_OPTIONS = ['Accident report', 'Photos', 'Medical records', 'Accident benefits denial letter', 'Employer / income note', 'Witness details', 'Other timeline details'];
const BUCKETS = ['High priority review', 'Qualified review', 'Manual review', 'Low priority review', 'Already represented / low priority', 'Outside Ontario / low priority'];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

fs.mkdirSync(DATA_DIR, { recursive: true });
ensureDashboardStateFile();

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) continue;
    let value = trimmed.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function ensureDashboardStateFile() {
  if (!fs.existsSync(DASHBOARD_STATE_FILE)) {
    fs.writeFileSync(DASHBOARD_STATE_FILE, JSON.stringify({ leads: {} }, null, 2));
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function isLocalRequest(req) {
  const remote = req.socket.remoteAddress || '';
  return remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1';
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return header.split(';').reduce((acc, part) => {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) return acc;
    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (key) acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.httpOnly !== false) parts.push('HttpOnly');
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);
  parts.push(`Path=${options.path || '/'}`);
  if (options.secure) parts.push('Secure');
  const nextValue = parts.join('; ');
  const existing = res.getHeader('Set-Cookie');
  if (!existing) {
    res.setHeader('Set-Cookie', nextValue);
    return;
  }
  res.setHeader('Set-Cookie', Array.isArray(existing) ? existing.concat(nextValue) : [existing, nextValue]);
}

function clearCookie(res, name) {
  setCookie(res, name, '', { maxAge: 0 });
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of DASHBOARD_SESSIONS.entries()) {
    if (session.expiresAt < now) DASHBOARD_SESSIONS.delete(sessionId);
  }
}

function isAuthenticatedDashboardRequest(req) {
  if (!DASHBOARD_PASSWORD) return true;
  const cookies = parseCookies(req);
  const sessionId = cookies.dashboard_session;
  if (!sessionId) return false;
  const session = DASHBOARD_SESSIONS.get(sessionId);
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    DASHBOARD_SESSIONS.delete(sessionId);
    return false;
  }
  session.expiresAt = Date.now() + DASHBOARD_SESSION_TTL_HOURS * 60 * 60 * 1000;
  return true;
}

function requireDashboardAccess(req, res) {
  if (!(DASHBOARD_ALLOW_REMOTE || isLocalRequest(req))) {
    sendJson(res, 403, { error: 'Dashboard access is limited to localhost by default. Set DASHBOARD_ALLOW_REMOTE=true only if you understand the exposure and still use a strong password.' });
    return false;
  }
  if (!isAuthenticatedDashboardRequest(req)) {
    sendJson(res, 401, { error: 'Dashboard login required.' });
    return false;
  }
  return true;
}

function readRequestBody(req, maxBytes = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;

    req.on('data', (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        reject(new Error('Request too large.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function readSubmissionRecords() {
  if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
  const lines = fs.readFileSync(SUBMISSIONS_FILE, 'utf8').split(/\r?\n/).filter(Boolean);
  const records = [];
  for (const line of lines) {
    try {
      records.push(JSON.parse(line));
    } catch (error) {
      console.error('[dashboard-jsonl-parse]', error.message);
    }
  }
  return records.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

function readDashboardState() {
  ensureDashboardStateFile();
  const state = readJsonFile(DASHBOARD_STATE_FILE, { leads: {} });
  if (!state.leads || typeof state.leads !== 'object') state.leads = {};
  return state;
}

function sanitizeText(value, limit) {
  return String(value || '').trim().slice(0, limit);
}

function normalizeArray(value, limit = 12, itemLimit = 120) {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeText(item, itemLimit)).filter(Boolean).slice(0, limit);
  }
  if (typeof value === 'string' && value.trim()) return [sanitizeText(value, itemLimit)];
  return [];
}

function normalizeChecklist(value) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    conflictCheck: Boolean(source.conflictCheck),
    docsRequested: Boolean(source.docsRequested),
    clientFollowUpSent: Boolean(source.clientFollowUpSent),
    summaryReady: Boolean(source.summaryReady),
    referralReady: Boolean(source.referralReady)
  };
}

function normalizeDashboardPatch(payload = {}, current = {}) {
  const nextStatus = sanitizeText(payload.status, 40).toLowerCase();
  if (nextStatus && !LEAD_STATUSES.includes(nextStatus)) {
    throw new Error('Invalid status.');
  }

  const nextPriority = sanitizeText(payload.followUpPriority, 24).toLowerCase();
  if (nextPriority && !FOLLOW_UP_PRIORITIES.includes(nextPriority)) {
    throw new Error('Invalid follow-up priority.');
  }

  const now = new Date().toISOString();
  const existingChecklist = normalizeChecklist(current.checklist);

  return {
    status: nextStatus || current.status || 'new',
    notes: sanitizeText(payload.notes ?? current.notes, 8000),
    followUpPriority: nextPriority || current.followUpPriority || 'none',
    followUpOn: sanitizeText(payload.followUpOn ?? current.followUpOn, 32),
    followUpNote: sanitizeText(payload.followUpNote ?? current.followUpNote, 2000),
    requestedDocs: normalizeArray(payload.requestedDocs ?? current.requestedDocs),
    customRequestedDocs: normalizeArray(payload.customRequestedDocs ?? current.customRequestedDocs),
    lastContactedAt: sanitizeText(payload.lastContactedAt ?? current.lastContactedAt, 40),
    sentToFirmAt: sanitizeText(payload.sentToFirmAt ?? current.sentToFirmAt, 40),
    checklist: { ...existingChecklist, ...normalizeChecklist(payload.checklist) },
    updatedAt: now
  };
}

function saveDashboardLeadState(leadId, patch) {
  const state = readDashboardState();
  const current = state.leads[leadId] || {};
  state.leads[leadId] = {
    ...current,
    ...patch,
    updatedAt: patch.updatedAt || new Date().toISOString()
  };
  writeJsonFile(DASHBOARD_STATE_FILE, state);
  return state.leads[leadId];
}

function defaultStatusForRecord(record) {
  if (record?.data?.currentlyRepresented === 'Yes' || record?.data?.representedStatus === 'Yes') return 'not a fit';
  return 'new';
}

function mergeLeadRecord(record, state) {
  const dashboardMeta = state.leads[record.id] || {};
  const requestedDocs = normalizeArray(dashboardMeta.requestedDocs);
  const customRequestedDocs = normalizeArray(dashboardMeta.customRequestedDocs);
  const checklist = normalizeChecklist(dashboardMeta.checklist);

  return {
    ...record,
    dashboard: {
      status: LEAD_STATUSES.includes(dashboardMeta.status) ? dashboardMeta.status : defaultStatusForRecord(record),
      notes: typeof dashboardMeta.notes === 'string' ? dashboardMeta.notes : '',
      updatedAt: dashboardMeta.updatedAt || null,
      followUpPriority: FOLLOW_UP_PRIORITIES.includes(dashboardMeta.followUpPriority) ? dashboardMeta.followUpPriority : 'none',
      followUpOn: dashboardMeta.followUpOn || '',
      followUpNote: dashboardMeta.followUpNote || '',
      requestedDocs,
      customRequestedDocs,
      requestedDocsCount: requestedDocs.length + customRequestedDocs.length,
      lastContactedAt: dashboardMeta.lastContactedAt || null,
      sentToFirmAt: dashboardMeta.sentToFirmAt || null,
      checklist,
      checklistReadyCount: Object.values(checklist).filter(Boolean).length
    }
  };
}

function listLeadSummaries(records, state, search = '', status = '', bucket = '') {
  const needle = search.trim().toLowerCase();
  return records
    .map((record) => mergeLeadRecord(record, state))
    .filter((record) => {
      if (status && record.dashboard.status !== status) return false;
      if (bucket && record.review.bucket !== bucket) return false;
      if (!needle) return true;
      const haystack = [
        record.id,
        record.data.fullName,
        record.data.email,
        record.data.phone,
        record.data.cityArea,
        record.data.accidentType,
        record.data.accidentSummary,
        record.review.bucket,
        record.dashboard.notes,
        record.dashboard.followUpNote,
        ...(record.dashboard.requestedDocs || []),
        ...(record.dashboard.customRequestedDocs || [])
      ].join(' ').toLowerCase();
      return haystack.includes(needle);
    })
    .map((record) => ({
      id: record.id,
      submittedAt: record.submittedAt,
      fullName: record.data.fullName,
      email: record.data.email,
      phone: record.data.phone,
      cityArea: record.data.cityArea,
      accidentType: record.data.accidentType,
      score: record.review.score,
      bucket: record.review.bucket,
      status: record.dashboard.status,
      notesPreview: record.dashboard.notes.slice(0, 140),
      dashboardUpdatedAt: record.dashboard.updatedAt,
      followUpPriority: record.dashboard.followUpPriority,
      followUpOn: record.dashboard.followUpOn,
      requestedDocsCount: record.dashboard.requestedDocsCount,
      checklistReadyCount: record.dashboard.checklistReadyCount,
      sentToFirmAt: record.dashboard.sentToFirmAt
    }));
}

function calculateLeadScore(data) {
  let score = 0;
  if (data.inOntario === 'Yes') score += 3;
  if (data.injured === 'Yes') score += 3;
  if (data.medicalAttention === 'Yes') score += 2;
  if (data.workImpact === 'Yes') score += 3;
  if (data.ongoingSymptoms === 'Yes') score += 2;
  if (data.thirdPartyInvolved === 'Yes') score += 3;
  if (data.spokenWithLawyer === 'No') score += 1;
  if (data.currentlyRepresented === 'No') score += 2;
  if ((data.accidentSummary || '').trim().split(/\s+/).filter(Boolean).length >= 12) score += 2;
  if (['Car accident', 'Truck accident', 'Motorcycle accident', 'Pedestrian accident', 'Bicycle accident', 'Slip and fall', 'Other'].includes(data.accidentType)) score += 2;
  if (data.inOntario === 'No') score -= 10;
  if (data.currentlyRepresented === 'Yes') score -= 6;
  return score;
}

function determineBucket(data, score) {
  if (data.inOntario === 'No') return 'Outside Ontario / low priority';
  if (data.currentlyRepresented === 'Yes') return 'Already represented / low priority';
  if (score >= 11) return 'High priority review';
  if (score >= 7) return 'Qualified review';
  if (score >= 4) return 'Manual review';
  return 'Low priority review';
}

function sanitizeLead(payload) {
  const data = {
    fullName: sanitizeText(payload.fullName, 120),
    phone: sanitizeText(payload.phone, 40),
    email: sanitizeText(payload.email, 200),
    contactMethod: sanitizeText(payload.contactMethod, 40),
    bestTime: sanitizeText(payload.bestTime, 40),
    accidentType: sanitizeText(payload.accidentType, 80),
    accidentDate: sanitizeText(payload.accidentDate, 40),
    cityArea: sanitizeText(payload.cityArea, 120),
    inOntario: sanitizeText(payload.inOntario, 20),
    accidentSummary: sanitizeText(payload.accidentSummary, 3000),
    injured: sanitizeText(payload.injured, 20),
    medicalAttention: sanitizeText(payload.medicalAttention, 20),
    workImpact: sanitizeText(payload.workImpact, 20),
    ongoingSymptoms: sanitizeText(payload.ongoingSymptoms, 20),
    injuryDetails: sanitizeText(payload.injuryDetails, 1500),
    spokenWithLawyer: sanitizeText(payload.spokenWithLawyer, 20),
    currentlyRepresented: sanitizeText(payload.currentlyRepresented, 20),
    thirdPartyInvolved: sanitizeText(payload.thirdPartyInvolved, 20),
    additionalNotes: sanitizeText(payload.additionalNotes, 1500),
    consentTruth: payload.consentTruth === 'on' || payload.consentTruth === 'true' || payload.consentTruth === true,
    consentNotLawFirm: payload.consentNotLawFirm === 'on' || payload.consentNotLawFirm === 'true' || payload.consentNotLawFirm === true,
    consentToContact: payload.consentToContact === 'on' || payload.consentToContact === 'true' || payload.consentToContact === true,
    sourcePage: sanitizeText(payload.sourcePage, 200)
  };

  const requiredFields = ['fullName', 'phone', 'email', 'contactMethod', 'bestTime', 'accidentType', 'accidentDate', 'cityArea', 'inOntario', 'accidentSummary', 'injured', 'medicalAttention', 'workImpact', 'ongoingSymptoms', 'spokenWithLawyer', 'currentlyRepresented', 'thirdPartyInvolved'];
  for (const field of requiredFields) {
    if (!data[field]) return { error: `Missing required field: ${field}` };
  }

  if (!data.consentTruth || !data.consentNotLawFirm || !data.consentToContact) {
    return { error: 'All consent checkboxes are required.' };
  }

  const score = calculateLeadScore(data);
  const bucket = determineBucket(data, score);

  return {
    record: {
      submittedAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      data,
      review: { score, bucket }
    }
  };
}

function parseMultipart(req, rawBuffer) {
  const contentType = req.headers['content-type'] || '';
  const boundaryMatch = contentType.match(/boundary=(?:(?:"([^"]+)")|([^;]+))/i);
  const boundary = boundaryMatch?.[1] || boundaryMatch?.[2];
  if (!boundary) throw new Error('Missing multipart boundary.');

  const boundaryText = `--${boundary}`;
  const parts = rawBuffer.toString('binary').split(boundaryText).slice(1, -1);
  const fields = {};

  for (const rawPart of parts) {
    let part = rawPart;
    if (part.startsWith('\r\n')) part = part.slice(2);
    if (part.endsWith('\r\n')) part = part.slice(0, -2);

    const separatorIndex = part.indexOf('\r\n\r\n');
    if (separatorIndex === -1) continue;

    const headerBlock = part.slice(0, separatorIndex);
    const bodyBinary = part.slice(separatorIndex + 4);
    const headers = headerBlock.split('\r\n');
    const disposition = headers.find((line) => /^content-disposition:/i.test(line));
    if (!disposition) continue;

    const nameMatch = disposition.match(/name="([^"]+)"/i);
    if (!nameMatch) continue;
    const fieldName = nameMatch[1];
    const filenameMatch = disposition.match(/filename="([^"]*)"/i);
    if (filenameMatch && filenameMatch[1]) {
      throw new Error('File uploads are not accepted in this first-stage review.');
    }

    const value = Buffer.from(bodyBinary, 'binary').toString('utf8').trim();
    if (fields[fieldName] === undefined) fields[fieldName] = value;
    else if (Array.isArray(fields[fieldName])) fields[fieldName].push(value);
    else fields[fieldName] = [fields[fieldName], value];
  }

  return { fields };
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

function buildLeadSummary(record) {
  const { data, review, submittedAt, id, dashboard = {} } = record;
  const checklist = dashboard.checklist || {};
  const requestedDocs = [...(dashboard.requestedDocs || []), ...(dashboard.customRequestedDocs || [])];

  return [
    `${APP_NAME} review request`,
    '',
    `Lead ID: ${id}`,
    `Submitted: ${submittedAt}`,
    `Review bucket: ${review.bucket}`,
    `Score: ${review.score}`,
    `Dashboard status: ${dashboard.status || 'new'}`,
    `Follow-up priority: ${dashboard.followUpPriority || 'none'}`,
    `Follow-up on: ${dashboard.followUpOn || '—'}`,
    `Sent to firm: ${dashboard.sentToFirmAt || 'No'}`,
    '',
    'Contact',
    `Name: ${data.fullName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Preferred contact method: ${data.contactMethod}`,
    `Best time to reach: ${data.bestTime}`,
    '',
    'Accident details',
    `Accident type: ${data.accidentType}`,
    `Accident date: ${data.accidentDate}`,
    `Ontario: ${data.inOntario}`,
    `City / area: ${data.cityArea}`,
    `Injured: ${data.injured}`,
    `Medical attention: ${data.medicalAttention}`,
    `Work or daily-life impact: ${data.workImpact}`,
    `Ongoing symptoms: ${data.ongoingSymptoms}`,
    `Spoken with lawyer: ${data.spokenWithLawyer}`,
    `Currently represented: ${data.currentlyRepresented}`,
    `Other person / business involved: ${data.thirdPartyInvolved}`,
    '',
    'Accident summary',
    data.accidentSummary,
    '',
    'Injury details',
    data.injuryDetails || 'None provided',
    '',
    'Additional notes',
    data.additionalNotes || 'None provided',
    '',
    'Internal workflow',
    `Requested docs: ${requestedDocs.join(', ') || 'None tracked'}`,
    `Last client contact: ${dashboard.lastContactedAt || 'Not logged'}`,
    `Follow-up note: ${dashboard.followUpNote || 'None'}`,
    `Notes: ${dashboard.notes || 'None'}`,
    `Checklist: conflict check=${checklist.conflictCheck ? 'yes' : 'no'}, docs tracked=${checklist.docsRequested ? 'yes' : 'no'}, client follow-up sent=${checklist.clientFollowUpSent ? 'yes' : 'no'}, summary ready=${checklist.summaryReady ? 'yes' : 'no'}, referral ready=${checklist.referralReady ? 'yes' : 'no'}`,
    '',
    `Source page: ${data.sourcePage || '/'}`
  ].join('\n');
}

function buildExportHtml(record) {
  const summary = escapeHtml(buildLeadSummary(record));
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(APP_NAME)} · Lead Handoff</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; margin: 40px; color: #142132; background: #f6f8fb; }
    .sheet { max-width: 880px; margin: 0 auto; background: #fff; border-radius: 18px; padding: 32px; box-shadow: 0 10px 30px rgba(16,24,40,.08); }
    h1 { margin-top: 0; }
    pre { white-space: pre-wrap; word-break: break-word; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 14px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="sheet">
    <h1>${escapeHtml(APP_NAME)} handoff summary</h1>
    <pre>${summary}</pre>
  </div>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function buildTelegramMessage(record) {
  const { data, review } = record;
  return [
    `🚨 ${APP_NAME} review request`,
    `${review.bucket} · score ${review.score}`,
    `${data.fullName} · ${data.phone}`,
    `${data.email}`,
    `${data.accidentType} · ${data.cityArea} · Ontario: ${data.inOntario}`,
    `Injured: ${data.injured} · Ongoing symptoms: ${data.ongoingSymptoms}`,
    `Work impact: ${data.workImpact} · Medical attention: ${data.medicalAttention}`,
    `Represented: ${data.currentlyRepresented}`,
    `Summary: ${data.accidentSummary}`
  ].join('\n');
}

function appendSubmission(record) {
  return fs.promises.appendFile(SUBMISSIONS_FILE, `${JSON.stringify(record)}\n`);
}

function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const transport = target.protocol === 'https:' ? https : http;
    const req = transport.request(target, options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const ok = res.statusCode >= 200 && res.statusCode < 300;
        if (!ok) {
          reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 500)}`));
          return;
        }
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({ raw: body });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function createLineReader(socket) {
  let buffer = '';
  const queue = [];
  const waiters = [];

  socket.on('data', (chunk) => {
    buffer += chunk.toString('utf8');
    let index;
    while ((index = buffer.indexOf('\r\n')) !== -1) {
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      if (waiters.length) waiters.shift()(line);
      else queue.push(line);
    }
  });

  return function nextLine() {
    return new Promise((resolve) => {
      if (queue.length) resolve(queue.shift());
      else waiters.push(resolve);
    });
  };
}

async function readSmtpResponse(nextLine) {
  const lines = [];
  while (true) {
    const line = await nextLine();
    lines.push(line);
    if (/^\d{3} /.test(line)) {
      return { code: Number(line.slice(0, 3)), lines };
    }
  }
}

function writeSmtp(socket, command, sensitive = false) {
  socket.write(`${command}\r\n`);
  if (!sensitive) console.log(`[smtp] ${command}`);
}

async function expectSmtp(nextLine, allowedCodes) {
  const response = await readSmtpResponse(nextLine);
  if (!allowedCodes.includes(response.code)) {
    throw new Error(`SMTP ${response.code}: ${response.lines.join(' | ')}`);
  }
  return response;
}

function encodeHeader(text) {
  return `=?UTF-8?B?${Buffer.from(String(text), 'utf8').toString('base64')}?=`;
}

function dotStuff(text) {
  return text.replace(/(^|\n)\./g, '$1..');
}

function buildEmailMessage(record) {
  const subject = `${APP_NAME} review request: ${record.data.fullName} (${record.review.bucket})`;
  const fromName = process.env.SMTP_FROM_NAME || APP_NAME;
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
  const body = buildLeadSummary(record);
  return [
    `From: ${encodeHeader(fromName)} <${fromEmail}>`,
    `To: <${EMAIL_TO}>`,
    `Reply-To: ${record.data.fullName} <${record.data.email}>`,
    `Subject: ${encodeHeader(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    body
  ].join('\r\n');
}

async function sendEmailAlert(record) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || (port === 465 ? 'true' : 'false')).toLowerCase() === 'true';
  const fromEmail = process.env.SMTP_FROM_EMAIL || user;

  if (!host || !user || !pass || !fromEmail) {
    return { ok: false, skipped: true, channel: 'email', reason: 'SMTP credentials are not configured.' };
  }

  const connectOptions = secure ? { host, port, servername: host } : { host, port };
  let socket = secure ? tls.connect(connectOptions) : net.connect(connectOptions);
  await new Promise((resolve, reject) => {
    const onError = (error) => reject(error);
    socket.once('error', onError);
    socket.once('connect', () => { socket.off('error', onError); resolve(); });
    if (secure) {
      socket.once('secureConnect', () => { socket.off('error', onError); resolve(); });
    }
  });

  const nextLine = createLineReader(socket);

  try {
    await expectSmtp(nextLine, [220]);
    writeSmtp(socket, `EHLO ${process.env.SMTP_EHLO_NAME || 'localhost'}`);
    let response = await expectSmtp(nextLine, [250]);

    if (!secure) {
      const advertisedStartTls = response.lines.some((line) => /STARTTLS/i.test(line));
      if (advertisedStartTls) {
        writeSmtp(socket, 'STARTTLS');
        await expectSmtp(nextLine, [220]);
        socket = tls.connect({ socket, servername: host });
        await new Promise((resolve, reject) => {
          socket.once('secureConnect', resolve);
          socket.once('error', reject);
        });
        const upgradedNextLine = createLineReader(socket);
        writeSmtp(socket, `EHLO ${process.env.SMTP_EHLO_NAME || 'localhost'}`);
        await expectSmtp(upgradedNextLine, [250]);
        writeSmtp(socket, 'AUTH LOGIN');
        await expectSmtp(upgradedNextLine, [334]);
        writeSmtp(socket, Buffer.from(user, 'utf8').toString('base64'), true);
        await expectSmtp(upgradedNextLine, [334]);
        writeSmtp(socket, Buffer.from(pass, 'utf8').toString('base64'), true);
        await expectSmtp(upgradedNextLine, [235]);
        writeSmtp(socket, `MAIL FROM:<${fromEmail}>`);
        await expectSmtp(upgradedNextLine, [250]);
        writeSmtp(socket, `RCPT TO:<${EMAIL_TO}>`);
        await expectSmtp(upgradedNextLine, [250, 251]);
        writeSmtp(socket, 'DATA');
        await expectSmtp(upgradedNextLine, [354]);
        socket.write(`${dotStuff(buildEmailMessage(record))}\r\n.\r\n`);
        await expectSmtp(upgradedNextLine, [250]);
        writeSmtp(socket, 'QUIT');
        await expectSmtp(upgradedNextLine, [221]);
        socket.end();
        return { ok: true, channel: 'email', to: EMAIL_TO };
      }
    }

    writeSmtp(socket, 'AUTH LOGIN');
    await expectSmtp(nextLine, [334]);
    writeSmtp(socket, Buffer.from(user, 'utf8').toString('base64'), true);
    await expectSmtp(nextLine, [334]);
    writeSmtp(socket, Buffer.from(pass, 'utf8').toString('base64'), true);
    await expectSmtp(nextLine, [235]);
    writeSmtp(socket, `MAIL FROM:<${fromEmail}>`);
    await expectSmtp(nextLine, [250]);
    writeSmtp(socket, `RCPT TO:<${EMAIL_TO}>`);
    await expectSmtp(nextLine, [250, 251]);
    writeSmtp(socket, 'DATA');
    await expectSmtp(nextLine, [354]);
    socket.write(`${dotStuff(buildEmailMessage(record))}\r\n.\r\n`);
    await expectSmtp(nextLine, [250]);
    writeSmtp(socket, 'QUIT');
    await expectSmtp(nextLine, [221]);
    socket.end();
    return { ok: true, channel: 'email', to: EMAIL_TO };
  } catch (error) {
    socket.destroy();
    return { ok: false, channel: 'email', error: error.message };
  }
}

async function sendTelegramAlert(record) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const apiBase = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';

  if (!botToken || !chatId) {
    return { ok: false, skipped: true, channel: 'telegram', reason: 'Telegram bot token or chat id is not configured.' };
  }

  const body = JSON.stringify({ chat_id: chatId, text: buildTelegramMessage(record), disable_web_page_preview: true });

  try {
    await fetchJson(`${apiBase}/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      body
    });
    return { ok: true, channel: 'telegram', chatId };
  } catch (error) {
    return { ok: false, channel: 'telegram', error: error.message };
  }
}

async function deliverLead(record) {
  const [email, telegram] = await Promise.allSettled([sendEmailAlert(record), sendTelegramAlert(record)]);
  const results = [email, telegram].map((item) => item.status === 'fulfilled' ? item.value : { ok: false, error: item.reason?.message || String(item.reason) });
  return { email: results[0], telegram: results[1] };
}

function getLeadRecordById(leadId) {
  const records = readSubmissionRecords();
  const state = readDashboardState();
  const record = records.find((item) => item.id === leadId);
  if (!record) return null;
  return mergeLeadRecord(record, state);
}

function sendText(res, statusCode, text, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  res.end(text);
}

const server = http.createServer(async (req, res) => {
  cleanupExpiredSessions();
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && requestUrl.pathname === '/dashboard') {
    serveFile(path.join(ROOT, 'dashboard.html'), res);
    return;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/dashboard/login') {
    if (!(DASHBOARD_ALLOW_REMOTE || isLocalRequest(req))) {
      sendJson(res, 403, { error: 'Dashboard access is limited to localhost by default.' });
      return;
    }
    if (!DASHBOARD_PASSWORD) {
      sendJson(res, 400, { error: 'DASHBOARD_PASSWORD is not configured.' });
      return;
    }
    try {
      const raw = await readRequestBody(req, 32 * 1024);
      const payload = JSON.parse(raw.toString('utf8') || '{}');
      if (String(payload.password || '') !== DASHBOARD_PASSWORD) {
        sendJson(res, 401, { error: 'Incorrect password.' });
        return;
      }
      const sessionId = crypto.randomUUID();
      DASHBOARD_SESSIONS.set(sessionId, { expiresAt: Date.now() + DASHBOARD_SESSION_TTL_HOURS * 60 * 60 * 1000 });
      setCookie(res, 'dashboard_session', sessionId, { maxAge: DASHBOARD_SESSION_TTL_HOURS * 60 * 60 });
      sendJson(res, 200, { ok: true });
    } catch (error) {
      sendJson(res, 400, { error: error.message || 'Invalid JSON body.' });
    }
    return;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/dashboard/logout') {
    const cookies = parseCookies(req);
    if (cookies.dashboard_session) DASHBOARD_SESSIONS.delete(cookies.dashboard_session);
    clearCookie(res, 'dashboard_session');
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/dashboard/meta') {
    if (!(DASHBOARD_ALLOW_REMOTE || isLocalRequest(req))) {
      sendJson(res, 403, { error: 'Dashboard access is limited to localhost by default.' });
      return;
    }
    sendJson(res, 200, {
      appName: APP_NAME,
      localhostOnly: !DASHBOARD_ALLOW_REMOTE,
      authEnabled: Boolean(DASHBOARD_PASSWORD),
      placeholderPassword: Boolean(DASHBOARD_PASSWORD) && DASHBOARD_USING_PLACEHOLDER_PASSWORD,
      sessionTtlHours: DASHBOARD_SESSION_TTL_HOURS,
      statuses: LEAD_STATUSES,
      followUpPriorities: FOLLOW_UP_PRIORITIES,
      requestedDocOptions: REQUESTED_DOC_OPTIONS,
      buckets: BUCKETS,
      submissionsFile: path.relative(ROOT, SUBMISSIONS_FILE),
      dashboardStateFile: path.relative(ROOT, DASHBOARD_STATE_FILE),
      setup: {
        envExample: 'cp .env.example .env',
        setPassword: 'Set DASHBOARD_PASSWORD to a real value, then restart node server.js.',
        verifyLoginCurl: `curl -i -X POST http://localhost:${PORT}/api/dashboard/login -H 'Content-Type: application/json' -d '{"password":"your-password"}'`,
        loginRoute: '/api/dashboard/login'
      }
    });
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/dashboard/leads') {
    if (!requireDashboardAccess(req, res)) return;
    const records = readSubmissionRecords();
    const state = readDashboardState();
    const search = requestUrl.searchParams.get('search') || '';
    const status = requestUrl.searchParams.get('status') || '';
    const bucket = requestUrl.searchParams.get('bucket') || '';
    const leads = listLeadSummaries(records, state, search, status, bucket);
    const counts = LEAD_STATUSES.reduce((acc, key) => {
      acc[key] = leads.filter((lead) => lead.status === key).length;
      return acc;
    }, { all: leads.length });
    const stats = {
      unreviewed: leads.filter((lead) => ['new', 'reviewing'].includes(lead.status)).length,
      needDocs: leads.filter((lead) => lead.status === 'need docs / follow-up').length,
      goodFit: leads.filter((lead) => ['good fit', 'ready to hand off'].includes(lead.status)).length,
      sentToFirm: leads.filter((lead) => lead.status === 'sent to firm').length,
      dueToday: leads.filter((lead) => lead.followUpPriority === 'today').length
    };
    sendJson(res, 200, { leads, counts, stats });
    return;
  }

  const exportMatch = requestUrl.pathname.match(/^\/api\/dashboard\/leads\/([^/]+)\/export\.(txt|json|html)$/);
  if (req.method === 'GET' && exportMatch) {
    if (!requireDashboardAccess(req, res)) return;
    const leadId = decodeURIComponent(exportMatch[1]);
    const kind = exportMatch[2];
    const lead = getLeadRecordById(leadId);
    if (!lead) {
      sendJson(res, 404, { error: 'Lead not found.' });
      return;
    }
    if (kind === 'txt') {
      const text = buildLeadSummary(lead);
      if (requestUrl.searchParams.get('inline') === '1') {
        sendJson(res, 200, { text });
      } else {
        sendText(res, 200, text);
      }
      return;
    }
    if (kind === 'json') {
      sendJson(res, 200, { lead });
      return;
    }
    if (kind === 'html') {
      sendText(res, 200, buildExportHtml(lead), 'text/html; charset=utf-8');
      return;
    }
  }

  const markSentMatch = requestUrl.pathname.match(/^\/api\/dashboard\/leads\/([^/]+)\/mark-sent$/);
  if (req.method === 'POST' && markSentMatch) {
    if (!requireDashboardAccess(req, res)) return;
    const leadId = decodeURIComponent(markSentMatch[1]);
    const records = readSubmissionRecords();
    if (!records.find((item) => item.id === leadId)) {
      sendJson(res, 404, { error: 'Lead not found.' });
      return;
    }
    try {
      const raw = await readRequestBody(req, 256 * 1024);
      const payload = JSON.parse(raw.toString('utf8') || '{}');
      payload.status = 'sent to firm';
      payload.sentToFirmAt = new Date().toISOString();
      payload.checklist = {
        ...payload.checklist,
        summaryReady: true,
        referralReady: true
      };
      const currentState = readDashboardState().leads[leadId] || {};
      const saved = saveDashboardLeadState(leadId, normalizeDashboardPatch(payload, currentState));
      sendJson(res, 200, { ok: true, dashboard: saved });
    } catch (error) {
      sendJson(res, 400, { error: error.message || 'Invalid JSON body.' });
    }
    return;
  }

  const leadMatch = requestUrl.pathname.match(/^\/api\/dashboard\/leads\/([^/]+)$/);
  if (req.method === 'GET' && leadMatch) {
    if (!requireDashboardAccess(req, res)) return;
    const leadId = decodeURIComponent(leadMatch[1]);
    const lead = getLeadRecordById(leadId);
    if (!lead) {
      sendJson(res, 404, { error: 'Lead not found.' });
      return;
    }
    sendJson(res, 200, { lead });
    return;
  }

  if (req.method === 'POST' && leadMatch) {
    if (!requireDashboardAccess(req, res)) return;
    const leadId = decodeURIComponent(leadMatch[1]);
    const records = readSubmissionRecords();
    if (!records.find((item) => item.id === leadId)) {
      sendJson(res, 404, { error: 'Lead not found.' });
      return;
    }
    try {
      const raw = await readRequestBody(req, 256 * 1024);
      const payload = JSON.parse(raw.toString('utf8') || '{}');
      const currentState = readDashboardState().leads[leadId] || {};
      const saved = saveDashboardLeadState(leadId, normalizeDashboardPatch(payload, currentState));
      sendJson(res, 200, { ok: true, dashboard: saved });
    } catch (error) {
      sendJson(res, 400, { error: error.message || 'Invalid JSON body.' });
    }
    return;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/intake') {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.toLowerCase().includes('multipart/form-data')) {
      sendJson(res, 400, { error: 'Expected multipart form submission.' });
      return;
    }

    try {
      const rawBuffer = await readRequestBody(req);
      const { fields } = parseMultipart(req, rawBuffer);
      const { record, error } = sanitizeLead(fields);
      if (error) {
        sendJson(res, 400, { error });
        return;
      }
      record.delivery = await deliverLead(record);
      await appendSubmission(record);
      sendJson(res, 200, { ok: true, message: 'Review request received.', delivery: record.delivery });
    } catch (error) {
      console.error('[intake-error]', error);
      sendJson(res, 400, { error: error.message || 'Invalid multipart payload.' });
    }
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const safePath = path.normalize(path.join(ROOT, pathname));
  if (!safePath.startsWith(ROOT)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.stat(safePath, (error, stats) => {
    if (!error && stats.isFile()) {
      if (safePath.startsWith(DATA_DIR) && !requireDashboardAccess(req, res)) return;
      serveFile(safePath, res);
      return;
    }
    sendJson(res, 404, { error: 'Not found' });
  });
});

server.listen(PORT, () => {
  console.log(`${APP_NAME} running at http://localhost:${PORT}`);
});
