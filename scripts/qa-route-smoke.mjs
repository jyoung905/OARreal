import { spawn } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
const port = process.env.QA_PORT || '3011';
const base = `http://127.0.0.1:${port}`;
const routes = ['/', '/about', '/contact', '/resources', '/review', '/settlement-checker', '/income-replacement-denied', '/privacy', '/terms-of-service', '/disclaimer', '/thank-you', '/admin/analytics', '/api/intake', '/api/track', '/blog/accident-benefits-dispute-lat-aabs-ontario', '/blog/insurance-dispute-fsra-mediation-ontario'];
const server = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'start', '-p', port], { stdio: ['ignore','pipe','pipe'], env: { ...process.env, OAR_ADMIN_TOKEN: process.env.OAR_ADMIN_TOKEN || 'qa-secret' } });
let log=''; server.stdout.on('data', d => log += d); server.stderr.on('data', d => log += d);
async function waitReady(){ for(let i=0;i<60;i++){ try{ const r=await fetch(base); if(r.status<500) return; }catch{} await new Promise(r=>setTimeout(r,500)); } throw new Error('server not ready\n'+log); }
try{
 await waitReady();
 const results=[];
 for(const route of routes){
  const res=await fetch(base+route, { redirect: 'manual' }).catch(e=>({status:0, headers:new Headers(), text: async()=>String(e)}));
  const body= await res.text();
  results.push({route, status: res.status, location: res.headers?.get?.('location') || null, bytes: body.length});
 }
 await mkdir('evidence/ontario-accident-review-wave-1-critical-repair/raw',{recursive:true});
 await writeFile('evidence/ontario-accident-review-wave-1-critical-repair/ROUTE_SMOKE_AFTER.json', JSON.stringify(results,null,2));
 await writeFile('evidence/ontario-accident-review-wave-1-critical-repair/raw/qa-route-smoke-server.log', log);
 const admin = results.find(r=>r.route==='/admin/analytics');
 if(!admin || ![404,401,403,302,307,308].includes(admin.status)) throw new Error(`/admin/analytics publicly usable: ${admin?.status}`);
 const oldSlug = results.find(r => r.route === '/blog/insurance-dispute-fsra-mediation-ontario');
 if (!oldSlug || ![301,308].includes(oldSlug.status) || !String(oldSlug.location || '').includes('/blog/accident-benefits-dispute-lat-aabs-ontario')) throw new Error('Old FSRA slug did not redirect to LAT-AABS slug: '+JSON.stringify(oldSlug));
 const bad = results.filter(r => !['/api/intake','/api/track','/admin/analytics','/blog/insurance-dispute-fsra-mediation-ontario'].includes(r.route) && r.status !== 200);
 if (bad.length) throw new Error('Unexpected route failures: '+JSON.stringify(bad));
 console.log(JSON.stringify(results,null,2));
} finally { server.kill('SIGTERM'); }
