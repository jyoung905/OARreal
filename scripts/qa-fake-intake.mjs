import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const port = process.env.QA_PORT || '3012';
const base = `http://127.0.0.1:${port}`;
const evidenceDir = 'evidence/ontario-accident-review-wave-1-critical-repair/raw';
const server = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'start', '-p', port], { stdio: ['ignore','pipe','pipe'], env: { ...process.env, NODE_ENV: 'development', OAR_ENABLE_TEST_INTAKE: 'true', TELEGRAM_BOT_TOKEN: '', TELEGRAM_CHAT_ID: '', SMTP_HOST: '', SMTP_FROM_EMAIL: '' } });
let log=''; server.stdout.on('data', d => log += d); server.stderr.on('data', d => log += d);
async function waitReady(){ for(let i=0;i<60;i++){ try{ const r=await fetch(base); if(r.status<500) return; }catch{} await new Promise(r=>setTimeout(r,500)); } throw new Error('server not ready\n'+log); }
const valid = { testMode:true, fullName:'Test Do Not Contact', email:'test@example.com', phone:'', bestTime:'Anytime', contactMethod:'Email', accidentType:'Car accident', accidentDate:'2026-05-01', cityArea:'Toronto', inOntario:'Yes', claimStatus:'A benefit was denied or reduced', injured:'Yes', medicalAttention:'No', workImpact:'No', ongoingSymptoms:'No', spokenWithLawyer:'No', currentlyRepresented:'No', thirdPartyInvolved:'Not sure', accidentSummary:'test lead for local QA only do not contact', consentTruth:true, consentNotLawFirm:true, consentToContact:true, consentReferralShare:false, sourcePage:'/qa' };
try{
 await waitReady(); await mkdir(evidenceDir,{recursive:true});
 const failed = await fetch(base+'/api/intake', {method:'POST', headers:{'Content-Type':'application/json','x-oar-test-mode':'true'}, body: JSON.stringify({...valid, claimStatus:''})});
 const failedBody = await failed.text();
 const ok = await fetch(base+'/api/intake', {method:'POST', headers:{'Content-Type':'application/json','x-oar-test-mode':'true'}, body: JSON.stringify(valid)});
 const okBody = await ok.text();
 const output = { failedStatus: failed.status, failedBody: JSON.parse(failedBody), successStatus: ok.status, successBody: JSON.parse(okBody) };
 await writeFile(evidenceDir+'/qa-fake-intake.json', JSON.stringify(output,null,2));
 await writeFile(evidenceDir+'/qa-fake-intake-server.log', log);
 if (failed.status < 400) throw new Error('invalid intake unexpectedly succeeded');
 if (ok.status !== 200 || output.successBody.success !== true || output.successBody.testMode !== true) throw new Error('fake test intake did not succeed safely');
 if (JSON.stringify(output.successBody.notifications).includes('sent')) throw new Error('test intake sent notification');
 console.log(JSON.stringify(output,null,2));
} finally { server.kill('SIGTERM'); }
