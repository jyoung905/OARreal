'use client';

import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@/lib/analytics';

const META = [
  null,
  { label: 'Step 1 of 3', title: 'Accident basics', pct: '33%', w: '33%' },
  { label: 'Step 2 of 3', title: 'Injury and claim issue', pct: '66%', w: '66%' },
  { label: 'Step 3 of 3', title: 'Contact details', pct: '100%', w: '100%' },
];

const ACCIDENT_TYPES = [
  { val: 'Car accident', icon: 'directions_car', label: 'Car accident' },
  { val: 'Truck accident', icon: 'local_shipping', label: 'Truck' },
  { val: 'Motorcycle accident', icon: 'two_wheeler', label: 'Motorcycle' },
  { val: 'Pedestrian accident', icon: 'directions_walk', label: 'Pedestrian' },
  { val: 'Bicycle accident', icon: 'pedal_bike', label: 'Bicycle' },
  { val: 'Other motor vehicle accident', icon: 'more_horiz', label: 'Other' },
];

const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

function readAttribution() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const existing = (() => {
    try { return JSON.parse(sessionStorage.getItem('oar_attribution') || '{}'); } catch { return {}; }
  })();
  const next = { ...existing };
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) next[key] = value;
  }
  if (!next.landingPageUrl) next.landingPageUrl = window.location.href;
  if (!next.referrer) next.referrer = document.referrer || '';
  try { sessionStorage.setItem('oar_attribution', JSON.stringify(next)); } catch {}
  return next;
}

function getAttribution() {
  if (typeof window === 'undefined') return {};
  const stored = (() => {
    try { return JSON.parse(sessionStorage.getItem('oar_attribution') || '{}'); } catch { return {}; }
  })();
  return {
    landingPageUrl: stored.landingPageUrl || window.location.href,
    referrer: stored.referrer || document.referrer || '',
    userAgent: navigator.userAgent || '',
    utmSource: stored.utm_source || '',
    utmMedium: stored.utm_medium || '',
    utmCampaign: stored.utm_campaign || '',
    utmTerm: stored.utm_term || '',
    utmContent: stored.utm_content || '',
    gclid: stored.gclid || '',
    fbclid: stored.fbclid || '',
  };
}

function isLikelyTestLead({ firstName, email, message }) {
  const name = String(firstName || '').trim().toLowerCase();
  const mail = String(email || '').trim().toLowerCase();
  const msg = String(message || '').trim().toLowerCase();
  return name === 'test' || name.startsWith('test ') || mail.includes('test@example.com') || msg.includes('test lead') || msg.includes('test submission');
}

const MAIN_ISSUES = [
  'I am not sure what benefits apply',
  'Insurance denied or delayed something',
  'I need treatment coverage',
  'I missed work',
  'My claim is confusing',
  'Other',
];

export function IntakeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [fadeKey, setFadeKey] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const intakeOpenTime = useRef(null);

  const [accidentType, setAccidentType] = useState('Car accident');
  const [accidentDate, setAccidentDate] = useState('');
  const [cityArea, setCityArea] = useState('');
  const [inOntario, setInOntario] = useState('Yes');
  const [injured, setInjured] = useState('');
  const [mainIssue, setMainIssue] = useState('');
  const [workImpact, setWorkImpact] = useState('');
  const [treatment, setTreatment] = useState('');
  const [message, setMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bestTime, setBestTime] = useState('');

  useEffect(() => {
    const onHash = () => {
      readAttribution();
      const open = window.location.hash === '#intake';
      setIsOpen(open);
      if (open) {
        intakeOpenTime.current = Date.now();
        Analytics.intakeStart();
        Analytics.intakeStepView({ step: 1, step_label: 'Accident basics' });
      }
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const goTo = (n) => { setStep(n); setFadeKey(k => k + 1); setSubmitError(''); setFieldErrors({}); };
  const handleClose = () => { setIsOpen(false); window.history.pushState(null, '', window.location.pathname); };

  const validateStep1 = () => {
    const errs = {};
    if (!accidentDate) errs.accidentDate = true;
    if (!cityArea.trim()) errs.cityArea = true;
    if (!inOntario) errs.inOntario = true;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!injured) errs.injured = true;
    if (!mainIssue) errs.mainIssue = true;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    if (!firstName.trim()) errs.firstName = true;
    if (!cleanPhone && !cleanEmail) errs.contact = true;
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) errs.email = true;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goStep1to2 = () => {
    if (!validateStep1()) return;
    Analytics.intakeStepComplete({ step: 1, step_label: 'Accident basics', accident_type: accidentType, ontario_yn: inOntario });
    goTo(2);
    Analytics.intakeStepView({ step: 2, step_label: 'Issue' });
  };

  const goStep2to3 = () => {
    if (!validateStep2()) return;
    Analytics.intakeStepComplete({ step: 2, step_label: 'Issue', injured, missed_work: workImpact, treatment, claim_status: mainIssue, has_description: message.trim().length > 0 });
    goTo(3);
    Analytics.intakeStepView({ step: 3, step_label: 'Contact' });
  };

  const submitForm = async () => {
    if (!validateStep3()) return;
    setSubmitting(true);
    setSubmitError('');

    const elapsed = intakeOpenTime.current ? Date.now() - intakeOpenTime.current : undefined;
    Analytics.intakeSubmit({ accident_type: accidentType, claim_status: mainIssue, ontario_yn: inOntario, injured, time_to_submit_ms: elapsed });

    const payload = {
      fullName: firstName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bestTime: bestTime || 'Not specified',
      contactMethod: phone.trim() && email.trim() ? 'Either' : phone.trim() ? 'Phone' : 'Email',
      accidentType,
      accidentDate: accidentDate || 'Approximate date not provided',
      cityArea: cityArea.trim(),
      inOntario,
      claimStatus: mainIssue || 'Not specified',
      injured: injured || 'Not specified',
      medicalAttention: treatment || 'Not specified',
      workImpact: workImpact || 'Not specified',
      ongoingSymptoms: 'Not specified',
      spokenWithLawyer: 'Not specified',
      currentlyRepresented: 'No',
      thirdPartyInvolved: 'Not specified',
      accidentSummary: message || mainIssue || '',
      injuryDetails: message || '',
      additionalNotes: mainIssue ? `Main issue: ${mainIssue}${message ? `\nMessage: ${message}` : ''}` : message,
      consentTruth: true,
      consentNotLawFirm: true,
      consentToContact: true,
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
      ...getAttribution(),
    };

    try {
      const response = await fetch('/api/intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success !== false) {
        Analytics.submissionSuccess({ accident_type: accidentType, claim_status: mainIssue, time_to_complete_ms: intakeOpenTime.current ? Date.now() - intakeOpenTime.current : undefined });
        const testLead = data.testLead || isLikelyTestLead({ firstName, email, message });
        if (!testLead) {
          try { sessionStorage.setItem('oar_lead_conversion_pending', data.id || String(Date.now())); } catch {}
        }
        window.location.href = '/thank-you';
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch {
      setSubmitting(false);
      setSubmitError('Something went wrong. Please try again, or contact us directly.');
    }
  };

  if (!isOpen) return null;
  const m = META[step];

  const Pill = ({ value, current, onSelect, children }) => (
    <button type="button" className={`im-pill${current === value ? ' selected' : ''}`} onClick={() => onSelect(value)}>{children || value}</button>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .im-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#f8f9fb;overflow-y:auto;font-family:'Open Sans',system-ui,sans-serif;color:#191c1e}
        .im-headline{font-family:Raleway,system-ui,sans-serif}.im-label{font-family:'Open Sans',sans-serif;font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#44474f;margin-bottom:0.35rem;display:block}.im-label-hint{font-weight:400;text-transform:none;letter-spacing:normal;color:#75777f}
        .im-glass{background:rgba(248,249,251,0.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(197,198,208,0.15)}.im-card{background:#fff;border-radius:0.75rem;padding:2rem;box-shadow:0 2px 24px rgba(0,2,10,0.06);border:1px solid #e8eaec}.im-prog-track{height:6px;width:100%;background:#edeef0;border-radius:3px;overflow:hidden}.im-prog-bar{height:100%;border-radius:3px;transition:width 0.5s ease;background:linear-gradient(90deg,#735c00,#cba72f)}.im-step-fade{animation:imFadeSlide 0.22s ease both}@keyframes imFadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .im-acc-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.4rem;padding:0.875rem 0.5rem;border-radius:0.5rem;border:2px solid #d8d9e0;background:#f3f4f6;font-family:'Open Sans',sans-serif;font-size:0.8rem;font-weight:600;color:#44474f;cursor:pointer;transition:all 0.15s;text-align:center;line-height:1.3;min-height:76px}.im-acc-btn:hover{background:#fff;border-color:#001b44;color:#001b44}.im-acc-btn.selected{background:#fff;border-color:#735c00;color:#001b44;box-shadow:0 0 0 3px rgba(115,92,0,0.12)}.im-acc-icon{font-size:1.4rem;color:#75777f;transition:color 0.15s;font-variation-settings:'FILL' 1}.im-acc-btn.selected .im-acc-icon{color:#735c00}
        .im-pill{padding:0.5rem 1.05rem;border-radius:999px;font-size:0.82rem;font-weight:600;font-family:'Open Sans',sans-serif;border:1.5px solid #c5c6d0;background:#fff;color:#44474f;cursor:pointer;transition:all 0.15s;white-space:nowrap}.im-pill:hover{border-color:#001b44;color:#001b44}.im-pill.selected{background:#001b44;border-color:#001b44;color:#fff}.im-issue-btn{display:flex;align-items:center;gap:0.75rem;padding:0.9rem 1rem;border-radius:0.5rem;border:2px solid #d8d9e0;background:#f3f4f6;cursor:pointer;transition:all 0.15s;text-align:left;width:100%;font-family:'Open Sans',sans-serif;font-size:0.875rem;font-weight:600;color:#44474f}.im-issue-btn:hover{background:#fff;border-color:#001b44;color:#001b44}.im-issue-btn.selected{background:#fff;border-color:#735c00;color:#001b44;box-shadow:0 0 0 3px rgba(115,92,0,0.1)}.im-issue-dot{width:10px;height:10px;border-radius:50%;background:#c5c6d0;flex-shrink:0}.im-issue-btn.selected .im-issue-dot{background:#735c00}
        .im-input{width:100%;background:transparent;border:0;border-bottom:2px solid #c5c6d0;padding:0.25rem 0 0.6rem;font-weight:500;color:#191c1e;font-size:0.95rem;outline:none;font-family:'Open Sans',sans-serif;box-sizing:border-box}.im-input:focus{border-bottom-color:#735c00}.im-input.error{border-bottom-color:#ba1a1a}.im-input::placeholder{color:#75777f}.im-textarea{width:100%;background:#f3f4f6;border:0;border-bottom:2px solid #c5c6d0;padding:0.75rem 1rem;font-weight:400;color:#191c1e;font-size:0.875rem;outline:none;font-family:'Open Sans',sans-serif;border-radius:0.5rem 0.5rem 0 0;resize:none;box-sizing:border-box}.im-textarea:focus{border-bottom-color:#735c00}.im-select{width:100%;background:#f3f4f6;border:0;border-bottom:2px solid #c5c6d0;padding:0.75rem 0;font-weight:500;color:#191c1e;font-size:0.875rem;outline:none;font-family:'Open Sans',sans-serif}.im-select:focus{border-bottom-color:#735c00}
        .im-btn-primary{background:linear-gradient(135deg,#001b44,#003180);color:#fff;padding:1rem 2rem;border-radius:0.375rem;font-weight:700;letter-spacing:0.04em;box-shadow:0 8px 20px rgba(0,27,68,0.2);display:inline-flex;align-items:center;gap:0.75rem;font-family:'Open Sans',sans-serif;font-size:0.875rem;cursor:pointer;border:none;transition:all 0.15s;white-space:nowrap}.im-btn-primary:hover{box-shadow:0 12px 28px rgba(0,27,68,0.3);transform:translateY(-1px)}.im-btn-primary:disabled{opacity:0.65;cursor:not-allowed;transform:none}.im-btn-back{display:flex;align-items:center;gap:0.4rem;color:#44474f;font-weight:600;font-family:'Open Sans',sans-serif;font-size:0.875rem;cursor:pointer;background:none;border:none;padding:0.5rem 0;transition:color 0.15s}.im-trust{display:inline-flex;align-items:center;gap:0.3rem;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#44474f;font-family:'Open Sans',sans-serif}.im-trust-dot{width:5px;height:5px;border-radius:50%;background:#cba72f;flex-shrink:0}.im-err{color:#ba1a1a;font-size:0.75rem;font-weight:600;margin-top:0.25rem;display:block}.im-alert-box{background:#ffdad6;color:#ba1a1a;padding:0.75rem 1rem;border-radius:0.5rem;font-size:0.875rem;display:flex;align-items:flex-start;gap:0.5rem}.im-info-box{background:#e8f0ff;border:1px solid #3a82c8;border-radius:0.5rem;padding:0.875rem 1rem;font-size:0.82rem;color:#001b44;line-height:1.6}.im-divider{border:0;border-top:1px solid rgba(197,198,208,0.25);margin:0}.material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24}
        @media(max-width:520px){.im-card{padding:1.5rem 1rem}.im-acc-grid{grid-template-columns:repeat(2,1fr)!important}.im-contact-grid{grid-template-columns:1fr!important}.im-actions{flex-direction:column-reverse;align-items:stretch!important}.im-btn-primary,.im-btn-back{justify-content:center}.im-overlay main{padding-bottom:5rem!important}}
      `}</style>

      <div className="im-overlay">
        <header className="im-glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1.5rem', maxWidth: '52rem', margin: '0 auto' }}>
            <a href="/" onClick={handleClose} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', lineHeight: 1 }}>
              <span style={{ fontFamily: 'Raleway,system-ui,sans-serif', fontWeight: 800, color: '#001b44' }}>Ontario</span>
              <span style={{ fontFamily: 'Raleway,system-ui,sans-serif', fontWeight: 800, color: '#735c00' }}>Accident Review</span>
            </a>
            <button onClick={handleClose} style={{ border: 0, background: 'transparent', color: '#44474f', fontWeight: 700, cursor: 'pointer' }}>Close</button>
          </div>
        </header>

        <main style={{ padding: '2rem 1rem 4rem', maxWidth: '52rem', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
                <div><span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#735c00', marginBottom: '0.2rem' }}>{m.label}</span><h1 className="im-headline" style={{ fontSize: '1.625rem', fontWeight: 800, color: '#001b44', lineHeight: 1.2, margin: 0 }}>{m.title}</h1></div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#001b44', whiteSpace: 'nowrap' }}>{m.pct}</span>
              </div>
              <div className="im-prog-track"><div className="im-prog-bar" style={{ width: m.w }} /></div>
            </div>

            {step === 1 && (
              <div key={fadeKey} className="im-card im-step-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#44474f', lineHeight: 1.6, margin: 0 }}>No policy number, claim number, or uploads required. Approximate answers are fine.</p>
                <div><span className="im-label">What type of accident was it?</span><div className="im-acc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem' }}>{ACCIDENT_TYPES.map(t => <button key={t.val} type="button" className={`im-acc-btn${accidentType === t.val ? ' selected' : ''}`} onClick={() => setAccidentType(t.val)}><span className="material-symbols-outlined im-acc-icon">{t.icon}</span>{t.label}</button>)}</div></div>
                <div className="im-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <Field label="Approximate accident date" error={fieldErrors.accidentDate} errText="Please enter an approximate date."><input type="date" className={`im-input${fieldErrors.accidentDate ? ' error' : ''}`} value={accidentDate} onChange={e => setAccidentDate(e.target.value)} /></Field>
                  <Field label="City or region in Ontario" error={fieldErrors.cityArea} errText="Please enter the city or region."><input className={`im-input${fieldErrors.cityArea ? ' error' : ''}`} placeholder="Toronto, Brampton, Hamilton..." value={cityArea} onChange={e => setCityArea(e.target.value)} /></Field>
                </div>
                <div><span className="im-label">Did it happen in Ontario?</span><div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>{['Yes', 'No', 'Not sure'].map(v => <Pill key={v} value={v} current={inOntario} onSelect={setInOntario} />)}</div>{fieldErrors.inOntario && <span className="im-err">Please choose one.</span>}</div>
                <Trust />
                <hr className="im-divider" />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button type="button" className="im-btn-primary" onClick={goStep1to2}>Continue <span className="material-symbols-outlined">arrow_forward</span></button></div>
              </div>
            )}

            {step === 2 && (
              <div key={fadeKey} className="im-card im-step-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                <div><span className="im-label">Were you injured?</span><div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>{['Yes', 'No', 'Not sure'].map(v => <Pill key={v} value={v} current={injured} onSelect={setInjured} />)}</div>{fieldErrors.injured && <span className="im-err">Please choose one.</span>}</div>
                <div><span className="im-label">What is the main issue?</span><div style={{ display: 'grid', gap: '0.5rem' }}>{MAIN_ISSUES.map(issue => <button key={issue} type="button" className={`im-issue-btn${mainIssue === issue ? ' selected' : ''}`} onClick={() => setMainIssue(issue)}><span className="im-issue-dot" />{issue}</button>)}</div>{fieldErrors.mainIssue && <span className="im-err">Please choose the closest issue.</span>}</div>
                <div className="im-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><span className="im-label">Need treatment coverage?</span><div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>{['Yes', 'No', 'Not sure'].map(v => <Pill key={v} value={v} current={treatment} onSelect={setTreatment} />)}</div></div>
                  <div><span className="im-label">Missing work?</span><div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>{['Yes', 'No', 'Not sure'].map(v => <Pill key={v} value={v} current={workImpact} onSelect={setWorkImpact} />)}</div></div>
                </div>
                <div><span className="im-label">Short message <span className="im-label-hint">(optional)</span></span><textarea className="im-textarea" rows={4} maxLength={500} value={message} onChange={e => setMessage(e.target.value)} placeholder="A sentence or two about what happened or what feels stalled." /><div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}><span style={{ fontSize: '0.75rem', color: '#75777f' }}>Do not include policy numbers, health card numbers, or banking details.</span><span style={{ fontSize: '0.72rem', color: '#75777f' }}>{message.length}/500</span></div></div>
                <Trust />
                <hr className="im-divider" />
                <div className="im-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}><button type="button" className="im-btn-back" onClick={() => goTo(1)}><span className="material-symbols-outlined">arrow_back</span> Back</button><button type="button" className="im-btn-primary" onClick={goStep2to3}>Continue <span className="material-symbols-outlined">arrow_forward</span></button></div>
              </div>
            )}

            {step === 3 && (
              <div key={fadeKey} className="im-card im-step-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                <div className="im-info-box"><strong style={{ display: 'block', marginBottom: '0.25rem' }}>Privacy reassurance</strong>Your information is used only to review your accident-benefits situation and follow up about possible next steps.</div>
                <Field label="First name" error={fieldErrors.firstName} errText="Please enter your first name."><input className={`im-input${fieldErrors.firstName ? ' error' : ''}`} placeholder="First name" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} /></Field>
                <div className="im-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <Field label="Phone" error={fieldErrors.contact} errText="Please enter a phone or email."><input type="tel" className={`im-input${fieldErrors.contact ? ' error' : ''}`} placeholder="416-555-0100" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} /></Field>
                  <Field label="Email" error={fieldErrors.email || fieldErrors.contact} errText={fieldErrors.email ? 'Please enter a valid email.' : 'Please enter a phone or email.'}><input type="email" className={`im-input${fieldErrors.email || fieldErrors.contact ? ' error' : ''}`} placeholder="you@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
                </div>
                <div style={{ maxWidth: '18rem' }}><span className="im-label">Best time to reach you <span className="im-label-hint">(optional)</span></span><select className="im-select" value={bestTime} onChange={e => setBestTime(e.target.value)}><option value="">Select a time</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Anytime</option></select></div>
                {submitError && <div className="im-alert-box"><span>{submitError}</span></div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: '#44474f', lineHeight: 1.5 }}>
                  <p style={{ margin: 0 }}>Ontario Accident Review is not a law firm and does not provide legal advice.</p>
                  <p style={{ margin: 0 }}>Submitting this form does not create a lawyer-client relationship or any obligation.</p>
                </div>
                <hr className="im-divider" />
                <div className="im-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}><button type="button" className="im-btn-back" onClick={() => goTo(2)}><span className="material-symbols-outlined">arrow_back</span> Back</button><button type="button" className="im-btn-primary" disabled={submitting} onClick={submitForm}>{submitting ? 'Submitting...' : 'Submit Free Review'}</button></div>
              </div>
            )}

            <div style={{ background: '#e8eaec', borderRadius: '0.75rem', padding: '1.1rem 1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}><Trust /></div>
          </div>
        </main>
      </div>
    </>
  );
}

function Field({ label, children, error, errText }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}><span className="im-label">{label}</span>{children}{error && <span className="im-err">{errText}</span>}</div>;
}

function Trust() {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>{['Free review', 'Ontario claims only', 'No obligation', 'About 2 minutes'].map(t => <span key={t} className="im-trust"><span className="im-trust-dot"></span>{t}</span>)}</div>;
}
