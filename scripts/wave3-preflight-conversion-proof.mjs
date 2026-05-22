import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = 'evidence/ontario-accident-review-wave-3-controlled-paid-traffic-launch';
const RAW = `${ROOT}/raw`;
const SHOTS = `${ROOT}/screenshots`;
const BASE = process.env.WAVE2H_BASE || 'https://www.ontarioaccidentreview.ca';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = Number(process.env.WAVE3_PREFLIGHT_DEBUG_PORT || 9259);

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 1;
    this.pending = new Map();
    this.events = [];
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
  await delay(3500);
  return { sessionId, targetId };
}
async function evalOn(cdp, p, expression) { return cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, p.sessionId); }
async function shot(cdp, p, name) { const res = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }, p.sessionId); await writeFile(`${SHOTS}/${name}.png`, Buffer.from(res.data, 'base64')); }
async function close(cdp, p) { await cdp.send('Target.closeTarget', { targetId: p.targetId }).catch(() => {}); }

function dataLayerExpression() {
  return `(()=>{
    const normalize = (x) => {
      if (Array.isArray(x)) return x;
      if (x && typeof x === 'object' && ('0' in x)) return [x[0], x[1], x[2]];
      if (x && typeof x === 'object' && x.event) return [x.event, x];
      return [null, x];
    };
    const raw=(window.dataLayer||[]).map(normalize);
    const events=raw.filter(x=>x[0]==='event'||x[0]==='generate_lead'||x[0]==='conversion'||(x[0]&&x[0].event));
    const leadEvents=events.filter(e=>e[1]==='generate_lead'||e[0]==='generate_lead'||(e[0]&&e[0].event==='generate_lead'));
    const conversionEvents=events.filter(e=>e[1]==='conversion'||e[0]==='conversion'||(e[0]&&e[0].event==='conversion'));
    return {
      href: location.href,
      marker: sessionStorage.getItem('oar_lead_conversion_pending'),
      dataLayerType: Object.prototype.toString.call(window.dataLayer),
      hasGtag: typeof window.gtag === 'function',
      raw, events, leadEvents, conversionEvents,
      counts:{generate_lead:leadEvents.length, conversion:conversionEvents.length},
      text:document.body.innerText.slice(0,1000)
    };
  })()`;
}

async function run() {
  await mkdir(RAW, { recursive: true });
  await mkdir(SHOTS, { recursive: true });
  const userDataDir = join(tmpdir(), `wave2h-chrome-${Date.now()}`);
  const chrome = spawn(CHROME, [`--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${userDataDir}`, '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  chrome.stderr.on('data', () => {});
  try {
    const cdp = await connect();

    let p = await page(cdp, `${BASE}/thank-you?wave3_direct=${Date.now()}`, 1440, 900);
    const direct = (await evalOn(cdp, p, dataLayerExpression())).result.value;
    await writeFile(`${RAW}/preflight-direct-thank-you-events.json`, JSON.stringify({ checkedAt: new Date().toISOString(), base: BASE, page: direct }, null, 2));
    await shot(cdp, p, 'preflight-direct-thank-you');
    await close(cdp, p);

    p = await page(cdp, `${BASE}/?wave3_seed=${Date.now()}`, 1440, 900);
    const marker = `wave3-preflight-${Date.now()}`;
    await evalOn(cdp, p, `sessionStorage.setItem('oar_lead_conversion_pending', ${JSON.stringify(marker)}); location.href='/thank-you?wave3_marker=1'; true`);
    await delay(4500);
    const gated = (await evalOn(cdp, p, dataLayerExpression())).result.value;
    await writeFile(`${RAW}/preflight-marker-gated-thank-you-events.json`, JSON.stringify({ checkedAt: new Date().toISOString(), base: BASE, seededMarker: marker, page: gated }, null, 2));
    await shot(cdp, p, 'preflight-marker-gated-thank-you');

    await evalOn(cdp, p, `location.reload(); true`);
    await delay(3500);
    const refresh = (await evalOn(cdp, p, dataLayerExpression())).result.value;
    await writeFile(`${RAW}/preflight-refresh-events.json`, JSON.stringify({ checkedAt: new Date().toISOString(), base: BASE, originalSeededMarker: marker, page: refresh }, null, 2));
    await shot(cdp, p, 'preflight-refresh');
    await close(cdp, p);

    const summary = {
      checkedAt: new Date().toISOString(),
      base: BASE,
      directCounts: direct.counts,
      markerCounts: gated.counts,
      refreshCounts: refresh.counts,
      pass: direct.counts.generate_lead === 0 && direct.counts.conversion === 0 && gated.counts.generate_lead === 1 && gated.counts.conversion === 1 && refresh.counts.generate_lead === 0 && refresh.counts.conversion === 0,
    };
    await writeFile(`${RAW}/preflight-summary.json`, JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary, null, 2));
    if (!summary.pass) process.exitCode = 2;
  } finally {
    chrome.kill('SIGTERM');
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  }
}

run().catch(err => { console.error(err); process.exit(1); });
