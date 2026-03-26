'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { formSteps } from '@/lib/site';

const initialData = {
  fullName:'',phone:'',email:'',bestTime:'',contactMethod:'',
  accidentType:'',accidentDate:'',cityArea:'',inOntario:'',accidentSummary:'',
  injured:'',medicalAttention:'',workImpact:'',ongoingSymptoms:'',injuryDetails:'',
  spokenWithLawyer:'',currentlyRepresented:'',thirdPartyInvolved:'',additionalNotes:'',
  consentTruth:false,consentNotLawFirm:false,consentToContact:false
};
const req=[
  ['fullName','phone','email','bestTime','contactMethod'],
  ['accidentType','accidentDate','cityArea','inOntario','accidentSummary'],
  ['injured','medicalAttention','workImpact','ongoingSymptoms'],
  ['spokenWithLawyer','currentlyRepresented','thirdPartyInvolved'],
  ['consentTruth','consentNotLawFirm','consentToContact']
];
function chk(i,d){
  for(const k of req[i]){const v=d[k];if(typeof v==='boolean'){if(!v)return'Please complete the required fields.';}else if(!String(v||'').trim())return'Please complete the required fields.';}
  if(i===0&&d.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))return'Please enter a valid email address.';
  return'';
}
function upd(set,n,v){set(c=>({...c,[n]:v}));}

export function HeroInlineForm(){
  const router=useRouter();
  const [step,setStep]=useState(0);
  const [data,setData]=useState(initialData);
  const [ss,setSs]=useState({status:'idle',error:''});
  const pct=useMemo(()=>((step+1)/formSteps.length)*100,[step]);
  const next=()=>{const e=chk(step,data);if(e){setSs({status:'idle',error:e});return;}setSs({status:'idle',error:''});setStep(s=>Math.min(s+1,formSteps.length-1));};
  const prev=()=>{setSs({status:'idle',error:''});setStep(s=>Math.max(s-1,0));};
  const submit=async(e)=>{
    e.preventDefault();const err=chk(step,data);if(err){setSs({status:'idle',error:err});return;}
    setSs({status:'submitting',error:''});
    try{
      const r=await fetch('/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,sourcePage:'/'})});
      const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Submission failed.');
      router.push('/thank-you');
    }catch(ex){setSs({status:'idle',error:ex instanceof Error?ex.message:'There was a problem submitting.'});}
  };
  return(
    <div className="hero-inline-form-shell">
      <div className="hif-header"><p className="hif-kicker">Start Your Free Review</p><p className="hif-sub">About 2 minutes &#xB7; No documents required</p></div>
      <div className="hif-progress-wrap"><div className="hif-progress-track"><div className="hif-progress-fill" style={{width:`${pct}%`}}/></div><span className="hif-progress-label">Step {step+1} of {formSteps.length} — {formSteps[step]?.label}</span></div>
      <div className="hif-step-pills" aria-hidden="true">{formSteps.map((item,i)=>{const st=i===step?'is-active':i<step?'is-complete':'';return(<div key={item.id} className={`hif-step-pill ${st}`.trim()}><span className="hif-pill-num">{String(i+1).padStart(2,'0')}</span><strong className="hif-pill-label">{item.label}</strong></div>);})}</div>
      <form className="hif-form" onSubmit={submit}>
        <section className={`hif-step ${step===0?'is-active':''}`}>
          <div className="hif-step-head"><span className="hif-step-kicker">Step 1</span><h3>Where should we reach you?</h3><p>If your situation fits our criteria, a representative may contact you using these details.</p></div>
          <div className="hif-field-grid">
            <HifField label="Full name"><input required value={data.fullName} onChange={e=>upd(setData,'fullName',e.target.value)}/></HifField>
            <HifField label="Phone number"><input required type="tel" value={data.phone} onChange={e=>upd(setData,'phone',e.target.value)}/></HifField>
            <HifField label="Email address"><input required type="email" value={data.email} onChange={e=>upd(setData,'email',e.target.value)}/></HifField>
            <HifField label="Best time to reach you"><select required value={data.bestTime} onChange={e=>upd(setData,'bestTime',e.target.value)}><option value="">Select one</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Anytime</option></select></HifField>
          </div>
          <HifRadio label="Preferred contact method" name="hif-cm" value={data.contactMethod} onChange={v=>upd(setData,'contactMethod',v)} options={['Phone','Email','Either']}/>
        </section>
        <section className={`hif-step ${step===1?'is-active':''}`}>
          <div className="hif-step-head"><span className="hif-step-kicker">Step 2</span><h3>Tell us the basics</h3><p>A short summary is enough — just the essentials for an initial review.</p></div>
          <div className="hif-field-grid">
            <HifField label="What type of accident was it?"><select required value={data.accidentType} onChange={e=>upd(setData,'accidentType',e.target.value)}><option value="">Select one</option><option>Car accident</option><option>Truck accident</option><option>Motorcycle accident</option><option>Pedestrian accident</option><option>Bicycle accident</option><option>Slip and fall</option><option>Other</option></select></HifField>
            <HifField label="Date of accident"><input required type="date" value={data.accidentDate} onChange={e=>upd(setData,'accidentDate',e.target.value)}/></HifField>
            <HifField label="City or town in Ontario"><input required value={data.cityArea} placeholder="Toronto, Brampton, Hamilton..." onChange={e=>upd(setData,'cityArea',e.target.value)}/></HifField>
            <HifRadio compact label="Did it happen in Ontario?" name="hif-on" value={data.inOntario} onChange={v=>upd(setData,'inOntario',v)} options={['Yes','No']}/>
          </div>
          <HifField label="Briefly describe what happened"><textarea required rows={4} placeholder="A short summary is enough." value={data.accidentSummary} onChange={e=>upd(setData,'accidentSummary',e.target.value)}/></HifField>
        </section>
        <section className={`hif-step ${step===2?'is-active':''}`}>
          <div className="hif-step-head"><span className="hif-step-kicker">Step 3</span><h3>How has this affected you?</h3><p>No sensitive documents or insurance details needed at this stage.</p></div>
          <div className="hif-field-grid">
            <HifRadio compact label="Were you injured?" name="hif-inj" value={data.injured} onChange={v=>upd(setData,'injured',v)} options={['Yes','No','Not sure']}/>
            <HifRadio compact label="Did you receive medical attention?" name="hif-med" value={data.medicalAttention} onChange={v=>upd(setData,'medicalAttention',v)} options={['Yes','No','Not yet']}/>
            <HifRadio compact label="Has it affected your work or daily life?" name="hif-wk" value={data.workImpact} onChange={v=>upd(setData,'workImpact',v)} options={['Yes','No','Not sure']}/>
            <HifRadio compact label="Are you still experiencing symptoms?" name="hif-sym" value={data.ongoingSymptoms} onChange={v=>upd(setData,'ongoingSymptoms',v)} options={['Yes','No','Not sure']}/>
          </div>
          <HifField label="What injuries or symptoms did you experience?"><textarea rows={3} placeholder="A brief description is fine." value={data.injuryDetails} onChange={e=>upd(setData,'injuryDetails',e.target.value)}/></HifField>
        </section>
        <section className={`hif-step ${step===3?'is-active':''}`}>
          <div className="hif-step-head"><span className="hif-step-kicker">Step 4</span><h3>A few final questions</h3><p>We use these to understand whether the matter is still at the review stage.</p></div>
          <div className="hif-field-grid">
            <HifRadio compact label="Have you spoken with a lawyer about this?" name="hif-lw" value={data.spokenWithLawyer} onChange={v=>upd(setData,'spokenWithLawyer',v)} options={['Yes','No']}/>
            <HifRadio compact label="Do you currently have a lawyer for this?" name="hif-rep" value={data.currentlyRepresented} onChange={v=>upd(setData,'currentlyRepresented',v)} options={['Yes','No']}/>
            <HifRadio compact label="Was another party potentially involved?" name="hif-tp" value={data.thirdPartyInvolved} onChange={v=>upd(setData,'thirdPartyInvolved',v)} options={['Yes','No','Not sure']}/>
          </div>
          <HifField label="Anything else you want us to know? (optional)"><textarea rows={3} value={data.additionalNotes} onChange={e=>upd(setData,'additionalNotes',e.target.value)}/></HifField>
        </section>
        <section className={`hif-step ${step===4?'is-active':''}`}>
          <div className="hif-step-head"><span className="hif-step-kicker">Step 5</span><h3>Review and submit</h3><p>Submitting this form is only a request for an initial review — no obligation is created.</p></div>
          <HifConsent checked={data.consentTruth} onChange={v=>upd(setData,'consentTruth',v)} label="I confirm the information I provided is true to the best of my knowledge."/>
          <HifConsent checked={data.consentNotLawFirm} onChange={v=>upd(setData,'consentNotLawFirm',v)} label="I understand Ontario Accident Review is not a law firm and does not provide legal advice or legal representation."/>
          <label className="hif-consent-row"><input type="checkbox" checked={data.consentToContact} onChange={e=>upd(setData,'consentToContact',e.target.checked)}/><span>I consent to being contacted by Ontario Accident Review about my review request and I acknowledge the <Link href="/privacy" className="hif-link">Privacy Policy</Link>.</span></label>
          <p className="hif-disclaimer">Submitting through this site does not create a lawyer-client relationship.</p>
        </section>
        {ss.error&&<p className="hif-error" role="alert">{ss.error}</p>}
        <div className="hif-actions">
          {step>0&&<button type="button" className="hif-btn-back" onClick={prev}>Back</button>}
          {step<formSteps.length-1?<button type="button" className="hif-btn-next" onClick={next}>Continue</button>:<button type="submit" className="hif-btn-next" disabled={ss.status==='submitting'}>{ss.status==='submitting'?'Submitting...':'Submit My Review'}</button>}
        </div>
      </form>
      <p className="hif-footer-note">Ontario Accident Review is not a law firm and does not provide legal advice.</p>
    </div>
  );
}
function HifField({label,children}){return<div className="hif-field-group"><label className="hif-label">{label}</label>{children}</div>;}
function HifRadio({label,options,value,onChange,compact=false,name}){return(<div className="hif-field-group"><label className="hif-label">{label}</label><div className={`hif-radio-list ${compact?'hif-radio-compact':''}`}>{options.map(o=>(<label key={`${name}-${o}`} className="hif-radio-option"><input type="radio" name={name} checked={value===o} onChange={()=>onChange(o)}/><span>{o}</span></label>))}</div></div>);}
function HifConsent({checked,onChange,label}){return(<label className="hif-consent-row"><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)}/><span>{label}</span></label>);}
