const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('intake UI posts required claimStatus and supports phone OR email', () => {
  const src = fs.readFileSync('components/IntakeModal.jsx','utf8');
  assert.match(src, /CLAIM_STATUS_OPTIONS/);
  assert.match(src, /claimStatus,/);
  assert.match(src, /!phone\.trim\(\) && !email\.trim\(\)/);
  assert.match(src, /consentReferralShare/);
});

test('test mode suppresses notifications and does not weaken production by default', () => {
  const src = fs.readFileSync('app/api/intake/route.js','utf8');
  assert.match(src, /x-oar-test-mode/);
  assert.match(src, /NODE_ENV !== 'production' \|\| process\.env\.OAR_ENABLE_TEST_INTAKE === 'true'/);
  assert.match(src, /suppressed_test_mode/);
});

test('admin analytics is protected before fetching data', () => {
  const src = fs.readFileSync('app/admin/analytics/page.tsx','utf8');
  assert.match(src, /OAR_ADMIN_TOKEN/);
  assert.match(src, /notFound\(\)/);
});

test('conversion is gated to confirmed intake success and thank-you marker', () => {
  const trackLead = fs.readFileSync('components/TrackLead.tsx','utf8');
  const intakeModal = fs.readFileSync('components/IntakeModal.jsx','utf8');
  assert.match(trackLead, /sessionStorage\.getItem\('oar_lead_conversion_pending'\)/);
  assert.match(trackLead, /if \(!marker\) return/);
  assert.match(trackLead, /sessionStorage\.removeItem\('oar_lead_conversion_pending'\)/);
  assert.match(intakeModal, /if \(response\.ok && data\.success === true\) \{/);
  assert.match(intakeModal, /sessionStorage\.setItem\('oar_lead_conversion_pending', data\.id/);
  assert.match(intakeModal, /throw new Error\(data\.error \|\| 'Submission failed'\)/);
});

test('conversion marker present queues exactly one lead and Ads conversion before cleanup', () => {
  const trackLead = fs.readFileSync('components/TrackLead.tsx','utf8');
  const ensureIdx = trackLead.indexOf('const gtag = ensureGtag();');
  const leadIdx = trackLead.indexOf("gtag('event', 'generate_lead'");
  const conversionIdx = trackLead.indexOf("gtag('event', 'conversion'");
  const cleanupIdx = trackLead.indexOf("sessionStorage.removeItem('oar_lead_conversion_pending')");
  assert.ok(ensureIdx > -1, 'gtag/dataLayer stub is created');
  assert.ok(leadIdx > ensureIdx, 'generate_lead is queued through ensured gtag');
  assert.ok(conversionIdx > leadIdx, 'Ads conversion is queued once after generate_lead');
  assert.equal(trackLead.match(/gtag\('event', 'generate_lead'/g).length, 1);
  assert.equal(trackLead.match(/gtag\('event', 'conversion'/g).length, 1);
  assert.ok(cleanupIdx > conversionIdx, 'pending marker is cleared only after conversion is queued');
});

test('absolute privacy and dated SSL claims are removed from app components', () => {
  const files = ['components/HomeContent.jsx','components/SiteFooter.jsx','components/IntakeModal.jsx','app/privacy/page.js'];
  for (const file of files) {
    const src = fs.readFileSync(file,'utf8');
    assert.doesNotMatch(src, /never shared(?! with your insurer)/i, file);
    assert.doesNotMatch(src, /256-bit SSL/i, file);
  }
});

test('LAT-AABS article is canonical and old FSRA mediation slug redirects', () => {
  const posts = fs.readFileSync('lib/blog-posts.ts','utf8');
  const config = fs.readFileSync('next.config.mjs','utf8');
  assert.match(posts, /slug: 'accident-benefits-dispute-lat-aabs-ontario'/);
  assert.doesNotMatch(posts, /slug: 'insurance-dispute-fsra-mediation-ontario'/);
  assert.match(config, /source: '\/blog\/insurance-dispute-fsra-mediation-ontario'/);
  assert.match(config, /destination: '\/blog\/accident-benefits-dispute-lat-aabs-ontario'/);
});

test('thank-you has page metadata and response header noindex protection', () => {
  const page = fs.readFileSync('app/thank-you/page.tsx','utf8');
  const config = fs.readFileSync('next.config.mjs','utf8');
  assert.match(page, /robots: \{ index: false, follow: false \}/);
  assert.match(config, /source: '\/thank-you'/);
  assert.match(config, /X-Robots-Tag/);
});
