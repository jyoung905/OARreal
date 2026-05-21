import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = (process.env.PROD_BASE_URL || 'https://www.ontarioaccidentreview.ca').replace(/\/$/, '');
const shots = 'evidence/ontario-accident-review-wave-1r-production-verification/screenshots';
const raw = 'evidence/ontario-accident-review-wave-1r-production-verification/raw';
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const debugPort = Number(process.env.CDP_PORT || 9224);
const marker = `wave1r-marker-${Date.now()}`;

function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }
class CDP {
  constructor(ws){ this.ws=ws; this.id=1; this.pending=new Map(); this.events=[]; ws.onmessage=e=>{ const msg=JSON.parse(e.data); if(msg.id&&this.pending.has(msg.id)){ const {resolve,reject}=this.pending.get(msg.id); this.pending.delete(msg.id); msg.error?reject(new Error(JSON.stringify(msg.error))):resolve(msg.result); } else if(msg.method) this.events.push(msg); }; }
  send(method, params={}, sessionId){ const id=this.id++; this.ws.send(JSON.stringify({id,method,params,sessionId})); return new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject})); }
}
async function connect(){
  for (let i=0;i<40;i++) {
    try {
      const v=await fetch(`http://127.0.0.1:${debugPort}/json/version`).then(r=>r.json());
      const ws=new WebSocket(v.webSocketDebuggerUrl); await new Promise((res,rej)=>{ ws.onopen=res; ws.onerror=rej; });
      return new CDP(ws);
    } catch { await delay(250); }
  }
  throw new Error('CDP not ready');
}
async function newPage(cdp, url, width=1440, height=1000){
  const {targetId}=await cdp.send('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await cdp.send('Target.attachToTarget',{targetId, flatten:true});
  await cdp.send('Page.enable',{},sessionId); await cdp.send('Runtime.enable',{},sessionId); await cdp.send('Network.enable',{},sessionId);
  await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600},sessionId);
  await cdp.send('Page.navigate',{url},sessionId); await delay(2500);
  return {sessionId, targetId};
}
async function evalOn(cdp, page, expression){ return cdp.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},page.sessionId); }
async function shot(cdp, page, name){ const res=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true},page.sessionId); await writeFile(`${shots}/${name}.png`, Buffer.from(res.data,'base64')); }
async function closePage(cdp,page){ await cdp.send('Target.closeTarget',{targetId:page.targetId}).catch(()=>{}); }
const fill = (sel, val) => `(()=>{const el=document.querySelector(${JSON.stringify(sel)}); if(!el) return false; const proto=Object.getPrototypeOf(el); const desc=Object.getOwnPropertyDescriptor(proto,'value') || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value') || Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value'); desc.set.call(el, ${JSON.stringify(val)}); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); return true;})()`;
const clickText = (txt) => `(()=>{const el=[...document.querySelectorAll('button,a')].find(el => (el.textContent||'').trim().includes(${JSON.stringify(txt)})); if(el){el.click(); return true;} return false;})()`;

await mkdir(shots,{recursive:true}); await mkdir(raw,{recursive:true});
const userData=join(tmpdir(),`oar-prod-chrome-${Date.now()}`);
const chrome=spawn(chromePath,[`--remote-debugging-port=${debugPort}`,`--user-data-dir=${userData}`,'--headless=new','--no-first-run','--no-default-browser-check','about:blank'],{stdio:['ignore','ignore','ignore']});
try{
  const cdp=await connect();
  let page=await newPage(cdp, `${base}/`, 390, 900); await shot(cdp,page,'production-home-mobile'); await closePage(cdp,page);
  page=await newPage(cdp, `${base}/#intake`, 1440, 1100); await shot(cdp,page,'production-review-intake-start'); await closePage(cdp,page);
  page=await newPage(cdp, `${base}/admin/analytics`, 1440, 1000); await shot(cdp,page,'production-admin-analytics-unauth-404'); await closePage(cdp,page);
  page=await newPage(cdp, `${base}/blog/accident-benefits-dispute-lat-aabs-ontario`, 1440, 1100); await shot(cdp,page,'production-lat-aabs-article'); await closePage(cdp,page);

  // Failed validation on production intake: no network submit, no redirect.
  page=await newPage(cdp, `${base}/#intake`, 1440, 1200); await evalOn(cdp,page,clickText('Submit My Review')); await delay(800); await shot(cdp,page,'production-intake-failed-validation'); await closePage(cdp,page);

  // Direct thank-you with no marker.
  page=await newPage(cdp, `${base}/thank-you`, 1440, 1000); await delay(2500);
  const direct = await evalOn(cdp,page, `({ href: location.href, marker: sessionStorage.getItem('oar_lead_conversion_pending'), dataLayer: (window.dataLayer||[]).map(x => Array.from(x)).filter(x => x[0] === 'event') })`);
  await shot(cdp,page,'direct-thank-you-no-marker'); await closePage(cdp,page);

  // Marker-set thank-you: simulates post-success redirect behavior without resubmitting another lead.
  page=await newPage(cdp, `${base}/`, 1440, 1000); await evalOn(cdp,page, `sessionStorage.setItem('oar_lead_conversion_pending', ${JSON.stringify(marker)}); location.href='/thank-you'; true`); await delay(3500);
  const success = await evalOn(cdp,page, `({ href: location.href, marker: sessionStorage.getItem('oar_lead_conversion_pending'), dataLayer: (window.dataLayer||[]).map(x => Array.from(x)).filter(x => x[0] === 'event') })`);
  await shot(cdp,page,'success-thank-you-marker');
  await shot(cdp,page,'production-intake-success-thank-you');
  await closePage(cdp,page);

  const proof = {
    base,
    directThankYou: direct.result.value,
    markerThankYou: success.result.value,
    directConversionEventCount: (direct.result.value.dataLayer || []).filter(x => x[1] === 'conversion' || x[1] === 'generate_lead').length,
    markerConversionEventCount: (success.result.value.dataLayer || []).filter(x => x[1] === 'conversion').length,
    markerGenerateLeadEventCount: (success.result.value.dataLayer || []).filter(x => x[1] === 'generate_lead').length,
  };
  await writeFile(`${raw}/conversion-browser-proof.json`, JSON.stringify(proof, null, 2));
  console.log(JSON.stringify(proof, null, 2));
  if (proof.directConversionEventCount !== 0) throw new Error('Direct thank-you fired lead/conversion event without marker');
  if (proof.markerConversionEventCount !== 1 || proof.markerGenerateLeadEventCount !== 1) throw new Error('Marker thank-you did not fire exactly one conversion and one generate_lead');
} finally { chrome.kill('SIGTERM'); await rm(userData,{recursive:true,force:true}).catch(()=>{}); }
