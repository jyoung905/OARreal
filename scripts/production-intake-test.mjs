import { mkdir, readFile, writeFile } from 'node:fs/promises';

const base = (process.env.PROD_BASE_URL || 'https://www.ontarioaccidentreview.ca').replace(/\/$/, '');
const evidenceDir = 'evidence/ontario-accident-review-wave-1r-production-verification/raw';
const outPath = `${evidenceDir}/production-intake-test-redacted.json`;

await mkdir(evidenceDir, { recursive: true });
if (process.env.FORCE_PROD_INTAKE_TEST !== 'true') {
  try {
    const existing = JSON.parse(await readFile(outPath, 'utf8'));
    if (existing?.alreadySubmitted === true || existing?.response?.success === true) {
      console.log(JSON.stringify({ skipped: true, reason: 'production intake test already recorded; set FORCE_PROD_INTAKE_TEST=true to intentionally resubmit', existingId: existing?.redactedSubmissionId || null }, null, 2));
      process.exit(0);
    }
  } catch {}
}

const unique = `OAR Wave 1R Test Lead DELETE ${new Date().toISOString().replace(/[:.]/g, '-')}`;
const payload = {
  fullName: unique,
  firstName: unique,
  email: 'oar-wave-1r-delete@example.com',
  phone: '555-0100',
  bestTime: 'Anytime',
  contactMethod: 'Email',
  accidentType: 'Car accident',
  accidentDate: '2026-05-01',
  cityArea: 'Toronto TEST DELETE',
  inOntario: 'Yes',
  claimStatus: 'I am not sure',
  injured: 'Not sure',
  medicalAttention: 'No',
  workImpact: 'No',
  ongoingSymptoms: 'No',
  spokenWithLawyer: 'No',
  currentlyRepresented: 'No',
  thirdPartyInvolved: 'Not sure',
  accidentSummary: 'OAR Wave 1R fake production verification lead. DELETE. No real accident. Do not contact.',
  injuryDetails: 'No real injury. Production verification only. DELETE.',
  additionalNotes: 'OAR Wave 1R fake production verification lead. DELETE after verification.',
  consentTruth: true,
  consentNotLawFirm: true,
  consentToContact: true,
  consentReferralShare: false,
  sourcePage: '/wave-1r-production-verification',
};

const startedAt = new Date().toISOString();
const res = await fetch(`${base}/api/intake`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'user-agent': 'OAR-Wave-1R-production-verification' },
  body: JSON.stringify(payload),
});
const text = await res.text();
let body;
try { body = JSON.parse(text); } catch { body = { raw: text }; }
const redacted = {
  alreadySubmitted: true,
  startedAt,
  completedAt: new Date().toISOString(),
  url: `${base}/api/intake`,
  status: res.status,
  ok: res.ok,
  fakeLeadName: 'OAR Wave 1R Test Lead DELETE [timestamp redacted]',
  fakeEmailDomain: 'example.com',
  redactedSubmissionId: body?.id ? `${String(body.id).slice(0, 8)}…${String(body.id).slice(-4)}` : null,
  fullSubmissionIdForCleanup: body?.id || null,
  response: {
    success: body?.success,
    status: body?.status,
    testLead: body?.testLead,
    testMode: body?.testMode,
    notifications: body?.notifications,
    captureMode: body?.captureMode,
  },
};
await writeFile(outPath, JSON.stringify(redacted, null, 2));
console.log(JSON.stringify({ ...redacted, fullSubmissionIdForCleanup: redacted.fullSubmissionIdForCleanup ? '[stored in raw file for cleanup; redact before sharing]' : null }, null, 2));
if (!res.ok || body?.success !== true) throw new Error(`Production intake failed: ${res.status} ${text.slice(0, 300)}`);
