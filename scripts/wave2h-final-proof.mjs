import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const MODE = process.argv.includes('--preflight') ? 'preflight' : 'final';
const ROOT = 'evidence/ontario-accident-review-wave-2h-deployment-integrity';
const RAW = `${ROOT}/raw`;
const SHOTS = `${ROOT}/screenshots`;
const BASE = 'https://www.ontarioaccidentreview.ca';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = Number(process.env.WAVE2H_FINAL_DEBUG_PORT || 9243);
const CAMPAIGN = 'wave2h_deployment_integrity_conversion';
const UTM = `utm_source=wave2h&utm_medium=cpc&utm_campaign=${CAMPAIGN}&utm_content=final_conversion_proof&utm_term=qa_conversion_count`;
const MARKER_PREFIX = 'OAR Wave 2H QA DELETE';
const UNIQUE = `${MARKER_PREFIX} ${Date.now()}`;
const FAKE_EMAIL = 'oar-wave-2h-delete@ontarioaccidentreview.ca';

for (const line of fs.existsSync('.env.production.local') ? fs.readFileSync('.env.production.local', 'utf8').split(/\r?\n/) : []) {
  if (!line || line.trim().startsWith('#') || !line.includes('=')) continue;
  const i = line.indexOf('=');
  const k = line.slice(0, i).trim();
  let v = line.slice(i + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  process.env[k] ??= v;
}

const SUPA = process.env.SUPABASE_URL?.replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LEAD_TABLE = process.env.SUPABASE_INTAKE_TABLE || 'intake_submissions';
const ANALYTICS_TABLE = process.env.SUPABASE_ANALYTICS_TABLE || 'analytics_events';

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function jfetch(url, opts = {}) {
  const r = await fetch(url, opts);
  const text = await r.text();
  let body = text;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }
  return { status: r.status, ok: r.ok, body, headers: Object.fromEntries(r.headers.entries()) };
}

function redactLead(row) {
  if (!row) return row;
  return {
    ...row,
    full_name: row.full_name ? '[redacted fake QA name]' : row.full_name,
    email: row.email ? '[redacted fake QA email]' : row.email,
    phone: row.phone ? '[redacted fake QA phone]' : row.phone,
    first_name: row.first_name ? '[redacted fake QA first name]' : row.first_name,
    phone_or_email: row.phone_or_email ? '[redacted fake QA contact]' : row.phone_or_email,
    user_agent: row.user_agent ? '[present redacted]' : row.user_agent,
    short_message: (row.short_message || '').replace(/OAR Wave 2G QA DELETE \d+/g, 'OAR Wave 2G QA DELETE [timestamp]'),
    raw_submission: row.raw_submission ? {
      id: row.raw_submission.id,
      submittedAt: row.raw_submission.submittedAt,
      data: {
        ...row.raw_submission.data,
        fullName: '[redacted fake QA name]',
        firstName: '[redacted fake QA first name]',
        email: '[redacted fake QA email]',
        phone: '[redacted fake QA phone]',
        userAgent: row.raw_submission.data?.userAgent ? '[present redacted]' : row.raw_submission.data?.userAgent,
        accidentSummary: (row.raw_submission.data?.accidentSummary || '').replace(/OAR Wave 2G QA DELETE \d+/g, 'OAR Wave 2G QA DELETE [timestamp]'),
      },
      review: row.raw_submission.review,
    } : row.raw_submission,
  };
}

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 1; this.pending = new Map(); this.events = [];
    ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    };
  }
  send(method, params = {}, sessionId) {
    const id = this.id++;
    this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
}

async function connect() {
  for (let i = 0; i < 80; i++) {
    try {
      const v = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`).then(r => r.json());
      const ws = new WebSocket(v.webSocketDebuggerUrl);
      await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
      return new CDP(ws);
    } catch { await delay(250); }
  }
  throw new Error('CDP not ready');
}

async function page(cdp, url, width = 1440, height = 950) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);
  await cdp.send('Network.enable', {}, sessionId);
  await cdp.send('Log.enable', {}, sessionId);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 }, sessionId);
  await cdp.send('Page.navigate', { url }, sessionId);
  await delay(2500);
  return { sessionId, targetId };
}

async function evalOn(cdp, p, expression) {
  return cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, p.sessionId);
}

async function shot(cdp, p, name) {
  const res = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }, p.sessionId);
  await writeFile(`${SHOTS}/${name}.png`, Buffer.from(res.data, 'base64'));
}

async function close(cdp, p) { await cdp.send('Target.closeTarget', { targetId: p.targetId }).catch(() => {}); }

const fill = (sel, val) => `(()=>{const el=document.querySelector(${JSON.stringify(sel)}); if(!el)return false; const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value')||Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')||Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')||Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value'); d.set.call(el,${JSON.stringify(val)}); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); return true})()`;
const clickText = (txt) => `(()=>{const el=[...document.querySelectorAll('button,a,label,span')].find(el=>{const r=el.getBoundingClientRect(); return r.width>0&&r.height>0&&(el.textContent||'').includes(${JSON.stringify(txt)})}); if(el){el.click(); return {clicked:true,text:el.textContent}} return {clicked:false}})()`;
const clickAction = (txt) => `(()=>{const buttons=[...document.querySelectorAll('.im-actions button, main button')]; const el=buttons.find(el=>{const r=el.getBoundingClientRect(); return r.width>0&&r.height>0&&(el.textContent||'').includes(${JSON.stringify(txt)})}); if(el){el.click(); return {clicked:true,text:el.textContent}} return {clicked:false, buttons:buttons.map(b=>b.textContent)}})()`;

function dataLayerExpression() {
  return `(()=>{
    const normalize = (x) => {
      if (Array.isArray(x)) return x;
      if (x && typeof x === 'object' && ('0' in x)) return [x[0], x[1], x[2]];
      if (x && typeof x === 'object' && x.event) return [x.event, x];
      return [null, x];
    };
    const raw=(window.dataLayer||[]).map(normalize);
    const events=raw.filter(x=>x[0]==='event'||x[0]==='generate_lead'||x[0]==='conversion'||x[0]?.event);
    const leadEvents=events.filter(e=>e[1]==='generate_lead'||e[0]==='generate_lead'||e[0]?.event==='generate_lead');
    const conversionEvents=events.filter(e=>e[1]==='conversion'||e[0]==='conversion'||e[0]?.event==='conversion');
    return {href:location.href, marker:sessionStorage.getItem('oar_lead_conversion_pending'), raw, events, leadEvents, conversionEvents, counts:{generate_lead:leadEvents.length, conversion:conversionEvents.length}, text:document.body.innerText.slice(0,1000)};
  })()`;
}

async function analyticsPreflight() {
  const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' };
  const required = ['id','event','device','traffic_source','utm_medium','utm_campaign','landing_page','accident_type','claim_status','ontario_yn','injured','step','step_label','cta_text','cta_location','trigger','question','props','occurred_at','created_at'];
  const marker = `wave2h-preflight-track-${Date.now()}`;
  const domain = await jfetch(BASE);
  const schemaProbe = await jfetch(`${SUPA}/rest/v1/${ANALYTICS_TABLE}?select=${required.join(',')}&limit=1`, { headers });
  const payload = { event: 'wave2h_preflight_track', device: 'server', traffic_source: 'wave2g', utm_medium: 'qa', utm_campaign: CAMPAIGN, landing_page: '/wave2g-preflight', trigger: marker, props: { marker } };
  const trackStartedAt = new Date().toISOString();
  const trackRes = await jfetch(`${BASE}/api/track`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  await delay(2500);
  const stored = await jfetch(`${SUPA}/rest/v1/${ANALYTICS_TABLE}?event=eq.wave2h_preflight_track&trigger=eq.${encodeURIComponent(marker)}&select=id,event,trigger,utm_campaign`, { headers });
  const ids = Array.isArray(stored.body) ? stored.body.map(r => r.id) : [];
  let cleanup = null;
  if (ids.length) cleanup = await jfetch(`${SUPA}/rest/v1/${ANALYTICS_TABLE}?id=in.(${ids.join(',')})`, { method: 'DELETE', headers: { ...headers, Prefer: 'return=representation' } });
  const verify = await jfetch(`${SUPA}/rest/v1/${ANALYTICS_TABLE}?event=eq.wave2h_preflight_track&trigger=eq.${encodeURIComponent(marker)}&select=id`, { headers });
  const out = { checkedAt: new Date().toISOString(), productionDomain: BASE, domainStatus: domain.status, supabaseProjectRef: (process.env.SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/) || [])[1] || null, leadTable: `public.${LEAD_TABLE}`, analyticsTable: `public.${ANALYTICS_TABLE}`, schemaProbe: { status: schemaProbe.status, ok: schemaProbe.ok, body: Array.isArray(schemaProbe.body) ? `array(${schemaProbe.body.length})` : schemaProbe.body }, trackStartedAt, trackRes: { status: trackRes.status, ok: trackRes.ok, body: trackRes.body }, storedCount: Array.isArray(stored.body) ? stored.body.length : null, cleanup: cleanup ? { status: cleanup.status, ok: cleanup.ok, deletedCount: Array.isArray(cleanup.body) ? cleanup.body.length : null } : null, remainingCount: Array.isArray(verify.body) ? verify.body.length : null, marker };
  await writeFile(`${RAW}/preflight-analytics-track-proof.json`, JSON.stringify(out, null, 2));
  if (domain.status !== 200 || !schemaProbe.ok || trackRes.status !== 200 || trackRes.body?.ok !== true || out.storedCount !== 1 || out.remainingCount !== 0) throw new Error('analytics/domain preflight failed');
  return out;
}

async function harnessPreflight(cdp) {
  const p = await page(cdp, `${BASE}/thank-you?preflight=wave2h`, 1280, 820);
  const proof = await evalOn(cdp, p, dataLayerExpression());
  await shot(cdp, p, 'preflight-harness-json-page');
  await close(cdp, p);
  const out = { checkedAt: new Date().toISOString(), canSaveJson: true, page: proof.result.value, expectedDirectCounts: { generate_lead: 0, conversion: 0 } };
  await writeFile(`${RAW}/preflight-harness-json-save-proof.json`, JSON.stringify(out, null, 2));
  const check = JSON.parse(fs.readFileSync(`${RAW}/preflight-harness-json-save-proof.json`, 'utf8'));
  if (!check.canSaveJson || check.page.counts.generate_lead !== 0 || check.page.counts.conversion !== 0) throw new Error('harness JSON preflight failed');
  return out;
}

async function cleanup(submissionId, reason = 'normal') {
  const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' };
  const report = { at: new Date().toISOString(), reason, leadDelete: null, leadRemaining: null, analyticsDelete: null, analyticsRemaining: null };
  if (submissionId) {
    const del = await jfetch(`${SUPA}/rest/v1/${LEAD_TABLE}?id=eq.${encodeURIComponent(submissionId)}`, { method: 'DELETE', headers: { ...headers, Prefer: 'return=representation' } });
    report.leadDelete = { status: del.status, ok: del.ok, deletedCount: Array.isArray(del.body) ? del.body.length : null };
  }
  const leadVerify = await jfetch(`${SUPA}/rest/v1/${LEAD_TABLE}?or=(email.eq.${encodeURIComponent(FAKE_EMAIL)},full_name.ilike.*${encodeURIComponent(MARKER_PREFIX)}*,short_message.ilike.*${encodeURIComponent(MARKER_PREFIX)}*)&select=id`, { headers });
  report.leadRemaining = { status: leadVerify.status, count: Array.isArray(leadVerify.body) ? leadVerify.body.length : null, rows: leadVerify.body };
  const analyticsRows = await jfetch(`${SUPA}/rest/v1/${ANALYTICS_TABLE}?utm_campaign=eq.${encodeURIComponent(CAMPAIGN)}&select=id,event,utm_campaign`, { headers });
  if (Array.isArray(analyticsRows.body) && analyticsRows.body.length) {
    const ids = analyticsRows.body.map(r => r.id).join(',');
    const delA = await jfetch(`${SUPA}/rest/v1/${ANALYTICS_TABLE}?id=in.(${ids})`, { method: 'DELETE', headers: { ...headers, Prefer: 'return=representation' } });
    report.analyticsDelete = { status: delA.status, ok: delA.ok, deletedCount: Array.isArray(delA.body) ? delA.body.length : null };
  } else {
    report.analyticsDelete = { status: analyticsRows.status, ok: analyticsRows.ok, deletedCount: 0 };
  }
  const analyticsVerify = await jfetch(`${SUPA}/rest/v1/${ANALYTICS_TABLE}?utm_campaign=eq.${encodeURIComponent(CAMPAIGN)}&select=id,event,utm_campaign`, { headers });
  report.analyticsRemaining = { status: analyticsVerify.status, count: Array.isArray(analyticsVerify.body) ? analyticsVerify.body.length : null, rows: analyticsVerify.body };
  await writeFile(`${RAW}/final-cleanup-proof.json`, JSON.stringify(report, null, 2));
  return report;
}

async function finalProof(cdp) {
  let submissionId = null;
  let submitStartedAt = null;
  try {
    let p = await page(cdp, `${BASE}/thank-you?${UTM}`, 1440, 900);
    const direct = (await evalOn(cdp, p, dataLayerExpression())).result.value;
    await writeFile(`${RAW}/final-direct-thank-you-events.json`, JSON.stringify(direct, null, 2));
    await shot(cdp, p, 'final-direct-thank-you');
    await close(cdp, p);

    p = await page(cdp, `${BASE}/?${UTM}#intake`, 1440, 1000);
    await evalOn(cdp, p, fill('#im-date', '2026-05-01'));
    await evalOn(cdp, p, fill('#im-city', 'Toronto'));
    await evalOn(cdp, p, clickAction('Continue'));
    await delay(800);
    await evalOn(cdp, p, clickText('A benefit was denied or reduced'));
    await evalOn(cdp, p, clickAction('Continue'));
    await delay(700);
    await evalOn(cdp, p, clickText('Yes'));
    await evalOn(cdp, p, clickText('Insurance denied or delayed something'));
    await evalOn(cdp, p, fill('#im-msg', `${UNIQUE}. QA verification submission only. No real accident. Delete after Wave 2H verification.`));
    await evalOn(cdp, p, clickAction('Continue'));
    await delay(700);
    await evalOn(cdp, p, fill('#im-name', UNIQUE));
    await evalOn(cdp, p, fill('#im-email', FAKE_EMAIL));
    await evalOn(cdp, p, fill('#im-phone', '4165550128'));
    await evalOn(cdp, p, fill('#im-time', 'Morning'));
    await evalOn(cdp, p, clickText('I consent to being contacted'));
    await delay(400);
    submitStartedAt = new Date().toISOString();
    await evalOn(cdp, p, clickAction('Submit private review'));
    await delay(7000);

    const gated = (await evalOn(cdp, p, dataLayerExpression())).result.value;
    submissionId = gated.conversionEvents?.[0]?.[2]?.transaction_id || gated.leadEvents?.[0]?.[2]?.submission_id || null;
    await writeFile(`${RAW}/final-marker-gated-thank-you-events.json`, JSON.stringify(gated, null, 2));
    await shot(cdp, p, 'final-marker-gated-thank-you');

    await evalOn(cdp, p, 'location.reload()');
    await delay(3500);
    const refresh = (await evalOn(cdp, p, dataLayerExpression())).result.value;
    await writeFile(`${RAW}/final-refresh-events.json`, JSON.stringify(refresh, null, 2));
    await shot(cdp, p, 'final-refresh');
    await close(cdp, p);

    if (!submissionId) throw new Error('No submission id from browser conversion events');

    const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };
    const select = 'id,submitted_at,full_name,email,phone,first_name,phone_or_email,city_region,happened_in_ontario,main_issue,needs_treatment_coverage,missing_work,short_message,best_time_to_reach,landing_page_url,referrer,user_agent,utm_source,utm_medium,utm_campaign,utm_term,utm_content,status,raw_submission';
    const lead = await jfetch(`${SUPA}/rest/v1/${LEAD_TABLE}?id=eq.${encodeURIComponent(submissionId)}&select=${select}`, { headers });
    const rows = lead.body;
    const redactedRows = Array.isArray(rows) ? rows.map(redactLead) : rows;
    await writeFile(`${RAW}/final-lead-capture.json`, JSON.stringify({ status: lead.status, rowCount: Array.isArray(rows) ? rows.length : null, rows: redactedRows }, null, 2));

    const summary = {
      checkedAt: new Date().toISOString(),
      fakeLeadCountSubmittedThisWave: 1,
      submitStartedAt,
      submissionId,
      directCounts: direct.counts,
      markerGatedCounts: gated.counts,
      refreshCounts: refresh.counts,
      pass: {
        directZero: direct.counts.generate_lead === 0 && direct.counts.conversion === 0,
        gatedExactlyOne: gated.counts.generate_lead === 1 && gated.counts.conversion === 1,
        refreshNoDuplicate: refresh.counts.generate_lead === 0 && refresh.counts.conversion === 0,
        leadRowFound: Array.isArray(rows) && rows.length === 1,
        captureModeFull: rows?.[0]?.raw_submission?.captureMode === undefined ? true : rows?.[0]?.raw_submission?.captureMode === 'full',
        noLegacyFallback: JSON.stringify(rows?.[0] || {}).includes('legacy_fallback') === false,
        utmPersisted: rows?.[0]?.utm_source === 'wave2h' && rows?.[0]?.utm_medium === 'cpc' && rows?.[0]?.utm_campaign === CAMPAIGN && rows?.[0]?.utm_content === 'final_conversion_proof' && rows?.[0]?.utm_term === 'qa_conversion_count',
      },
    };
    summary.allPass = Object.values(summary.pass).every(Boolean);
    await writeFile(`${RAW}/final-conversion-count-summary.json`, JSON.stringify(summary, null, 2));
    if (!summary.allPass) throw new Error(`conversion/lead summary failed: ${JSON.stringify(summary.pass)}`);

    const clean = await cleanup(submissionId, 'normal');
    if (clean.leadRemaining.count !== 0 || clean.analyticsRemaining.count !== 0) throw new Error('cleanup verification failed');
    return summary;
  } catch (err) {
    if (submissionId) await cleanup(submissionId, `error:${err.message}`).catch(() => {});
    throw err;
  }
}

await mkdir(RAW, { recursive: true });
await mkdir(SHOTS, { recursive: true });
if (!SUPA || !KEY) throw new Error('Missing Supabase environment');

const userData = join(tmpdir(), `oar-wave2h-chrome-${Date.now()}`);
const chrome = spawn(CHROME, [`--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${userData}`, '--headless=new', '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: ['ignore','ignore','ignore'] });
try {
  const cdp = await connect();
  const analytics = await analyticsPreflight();
  const harness = await harnessPreflight(cdp);
  await writeFile(`${RAW}/preflight-summary.json`, JSON.stringify({ mode: MODE, analytics, harness }, null, 2));
  console.log(JSON.stringify({ mode: MODE, preflight: 'pass', analyticsStored: analytics.storedCount, harnessCanSaveJson: harness.canSaveJson }, null, 2));
  if (MODE === 'final') {
    const summary = await finalProof(cdp);
    console.log(JSON.stringify({ mode: MODE, final: 'pass', summary }, null, 2));
  }
} finally {
  chrome.kill('SIGTERM');
  await rm(userData, { recursive: true, force: true }).catch(() => {});
}
