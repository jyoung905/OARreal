import { spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = process.env.QA_PORT || '3014';
const base = `http://127.0.0.1:${port}`;
const shots = 'evidence/ontario-accident-review-wave-1-critical-repair/screenshots';
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const debugPort = 9223;

function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }
async function waitReady(){ for(let i=0;i<60;i++){ try{ const r=await fetch(base); if(r.status<500) return; }catch{} await delay(500);} throw new Error('server not ready'); }

class CDP {
  constructor(ws){ this.ws=ws; this.id=1; this.pending=new Map(); ws.onmessage=e=>{ const msg=JSON.parse(e.data); if(msg.id&&this.pending.has(msg.id)){ const {resolve,reject}=this.pending.get(msg.id); this.pending.delete(msg.id); msg.error?reject(new Error(JSON.stringify(msg.error))):resolve(msg.result); } }; }
  send(method, params={}, sessionId){ const id=this.id++; this.ws.send(JSON.stringify({id,method,params,sessionId})); return new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject})); }
}
async function connect(){
  const v=await fetch(`http://127.0.0.1:${debugPort}/json/version`).then(r=>r.json());
  const ws=new WebSocket(v.webSocketDebuggerUrl); await new Promise((res,rej)=>{ ws.onopen=res; ws.onerror=rej; });
  return new CDP(ws);
}
async function newPage(cdp, url, width=1440, height=1100){
  const {targetId}=await cdp.send('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await cdp.send('Target.attachToTarget',{targetId, flatten:true});
  await cdp.send('Page.enable',{},sessionId); await cdp.send('Runtime.enable',{},sessionId);
  await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600},sessionId);
  await cdp.send('Page.navigate',{url},sessionId); await delay(1200);
  return {sessionId, targetId};
}
async function evalOn(cdp, page, expression){ return cdp.send('Runtime.evaluate',{expression,awaitPromise:true},page.sessionId); }
async function shot(cdp, page, name){
  const res=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true},page.sessionId);
  await writeFile(`${shots}/${name}.png`, Buffer.from(res.data,'base64'));
}
async function closePage(cdp, page){ await cdp.send('Target.closeTarget',{targetId:page.targetId}).catch(()=>{}); }
const clickText = (txt) => `([...document.querySelectorAll('button,a')].find(el => (el.textContent||'').trim().includes(${JSON.stringify(txt)})) || {}).click()`;
const fill = (sel, val) => `(()=>{const el=document.querySelector(${JSON.stringify(sel)}); const setter=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value').set; setter.call(el, ${JSON.stringify(val)}); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));})()`;

await mkdir(shots,{recursive:true});
const server=spawn(process.platform==='win32'?'npx.cmd':'npx',['next','start','-p',port],{stdio:['ignore','pipe','pipe'],env:{...process.env,OAR_ADMIN_TOKEN:'qa-secret'}});
const userData=join(tmpdir(),`oar-chrome-${Date.now()}`);
const chrome=spawn(chromePath,[`--remote-debugging-port=${debugPort}`,`--user-data-dir=${userData}`,'--headless=new','--no-first-run','--no-default-browser-check','about:blank'],{stdio:['ignore','ignore','ignore']});
try{
  await waitReady(); await delay(800); const cdp=await connect();
  let p=await newPage(cdp,`${base}/`,1440,1100); await shot(cdp,p,'desktop-home-top-fold'); await closePage(cdp,p);
  p=await newPage(cdp,`${base}/`,390,900); await shot(cdp,p,'mobile-home-top-fold'); await closePage(cdp,p);
  p=await newPage(cdp,`${base}/#intake`,1440,1100); await evalOn(cdp,p,fill('#im-date','2026-05-01')); await evalOn(cdp,p,fill('#im-city','Toronto')); await evalOn(cdp,p,clickText('Continue')); await delay(600); await shot(cdp,p,'intake-claim-status-step'); await closePage(cdp,p);
  p=await newPage(cdp,`${base}/#intake`,1440,1300); await evalOn(cdp,p,fill('#im-date','2026-05-01')); await evalOn(cdp,p,fill('#im-city','Toronto')); await evalOn(cdp,p,clickText('Continue')); await delay(300); await evalOn(cdp,p,clickText('A benefit was denied or reduced')); await evalOn(cdp,p,clickText('Continue')); await delay(300); await evalOn(cdp,p,clickText('Yes')); await evalOn(cdp,p,clickText('Treatment denied')); await evalOn(cdp,p,clickText('Continue')); await delay(500); await shot(cdp,p,'intake-consent-referral-step'); await evalOn(cdp,p,clickText('Submit My Review')); await delay(500); await shot(cdp,p,'failed-submission-error-state'); await closePage(cdp,p);
  p=await newPage(cdp,`${base}/`,1440,1000); await evalOn(cdp,p,"sessionStorage.setItem('oar_lead_conversion_pending','test-screenshot-id'); location.href='/thank-you'"); await delay(1200); await shot(cdp,p,'successful-fake-test-thank-you-state'); await closePage(cdp,p);
  for (const [url,name] of [['/privacy','privacy-corrected-sharing'],['/disclaimer','disclaimer-not-law-firm'],['/blog/accident-benefits-dispute-lat-aabs-ontario','lat-aabs-dispute-article'],['/admin/analytics','admin-analytics-unauth-404']]) { p=await newPage(cdp,`${base}${url}`,1440,1100); await shot(cdp,p,name); await closePage(cdp,p); }
  console.log(`screenshots written to ${shots}`);
} finally { server.kill('SIGTERM'); chrome.kill('SIGTERM'); await rm(userData,{recursive:true,force:true}).catch(()=>{}); }
