import { mkdir, writeFile } from 'node:fs/promises';

const base = (process.env.PROD_BASE_URL || 'https://www.ontarioaccidentreview.ca').replace(/\/$/, '');
const evidenceDir = 'evidence/ontario-accident-review-wave-1r-production-verification/raw';
const routes = [
  '/',
  '/review',
  '/resources',
  '/privacy',
  '/disclaimer',
  '/thank-you',
  '/blog/accident-benefits-dispute-lat-aabs-ontario',
  '/blog/insurance-dispute-fsra-mediation-ontario',
  '/admin/analytics',
  '/api/intake',
];

await mkdir(evidenceDir, { recursive: true });
const results = [];
for (const route of routes) {
  const url = `${base}${route}`;
  const res = await fetch(url, { redirect: 'manual' }).catch(error => ({ status: 0, headers: new Headers(), text: async () => String(error), url }));
  const body = await res.text().catch(() => '');
  results.push({
    route,
    url,
    status: res.status,
    location: res.headers?.get?.('location') || null,
    xRobotsTag: res.headers?.get?.('x-robots-tag') || null,
    xVercelId: res.headers?.get?.('x-vercel-id') || null,
    xVercelCache: res.headers?.get?.('x-vercel-cache') || null,
    bytes: body.length,
  });
}

await writeFile(`${evidenceDir}/production-route-smoke.json`, JSON.stringify(results, null, 2));
await writeFile('evidence/ontario-accident-review-wave-1r-production-verification/raw/production-route-smoke.out', JSON.stringify(results, null, 2));

const expected200 = ['/', '/review', '/resources', '/privacy', '/disclaimer', '/thank-you', '/blog/accident-benefits-dispute-lat-aabs-ontario'];
const bad200 = results.filter(r => expected200.includes(r.route) && r.status !== 200);
const oldSlug = results.find(r => r.route === '/blog/insurance-dispute-fsra-mediation-ontario');
const admin = results.find(r => r.route === '/admin/analytics');
const intakeGet = results.find(r => r.route === '/api/intake');
const thankYou = results.find(r => r.route === '/thank-you');
const failures = [];
if (bad200.length) failures.push(`Expected 200 failures: ${JSON.stringify(bad200)}`);
if (!oldSlug || ![301, 308].includes(oldSlug.status) || !String(oldSlug.location || '').includes('/blog/accident-benefits-dispute-lat-aabs-ontario')) failures.push(`Old slug redirect failed: ${JSON.stringify(oldSlug)}`);
if (!admin || admin.status !== 404) failures.push(`Admin unauth expected 404: ${JSON.stringify(admin)}`);
if (!intakeGet || ![405, 404].includes(intakeGet.status)) failures.push(`API intake GET expected 405 or expected non-GET response: ${JSON.stringify(intakeGet)}`);
if (!thankYou || !String(thankYou.xRobotsTag || '').includes('noindex')) failures.push(`Thank-you missing noindex header: ${JSON.stringify(thankYou)}`);

console.log(JSON.stringify(results, null, 2));
if (failures.length) throw new Error(failures.join('\n'));
