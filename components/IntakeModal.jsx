'use client';

import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@/lib/analytics';

const META = [
  null,
  { label: 'Step 1 of 3', title: 'About the accident', helper: 'Approximate answers are fine. No policy number or claim number needed to begin.', pct: '33%', w: '33%' },
  { label: 'Step 2 of 3', title: 'Injuries and claim issue', helper: 'This helps us understand what facts, dates, and Ontario accident-benefits issues may matter.', pct: '66%', w: '66%' },
  { label: 'Step 3 of 3', title: 'Contact details', helper: 'Your request is private and is not sent to your insurer.', pct: '100%', w: '100%' },
];

const ACCIDENT_TYPES = [
  { val: 'Car accident', icon: 'directions_car', label: 'Car accident' },
  { val: 'Truck accident', icon: 'local_shipping', label: 'Truck' },
  { val: 'Motorcycle accident', icon: 'two_wheeler', label: 'Motorcycle' },
  { val: 'Pedestrian accident', icon: 'directions_walk', label: 'Pedestrian' },
  { val: 'Bicycle accident', icon: 'pedal_bike', label: 'Bicycle' },
  { val: 'Other motor vehicle accident', icon: 'more_horiz', label: 'Other' },
];

const MAIN_ISSUES = [
  { val: 'I am not sure what benefits apply', icon: 'help', label: 'I am not sure what benefits apply' },
  { val: 'Benefits were delayed', icon: 'schedule', label: 'Benefits were delayed' },
  { val: 'Benefits were denied', icon: 'block', label: 'Benefits were denied' },
  { val: 'Benefits were reduced', icon: 'trending_down', label: 'Benefits were reduced' },
  { val: 'I need treatment coverage', icon: 'medical_services', label: 'I need treatment coverage' },
  { val: 'I missed work', icon: 'payments', label: 'I missed work' },
  { val: 'My claim is confusing', icon: 'folder_open', label: 'Forms or insurer requests are confusing' },
  { val: 'Other', icon: 'more_horiz', label: 'Other' },
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

  return (
    <>
      <style>{`
        .im-overlay{position:fixed;inset:0;z-index:9999;overflow-y:auto;background:radial-gradient(circle at 82% 8%,rgba(20,117,190,.08),transparent 32%),linear-gradient(180deg,#fffdf9 0%,#fbf7ef 52%,#fff 100%);font-family:var(--font-body);color:var(--navy)}
        .im-topbar{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.88);backdrop-filter:blur(18px);border-bottom:1px solid rgba(229,224,216,.85)}
        .im-topbar-inner{width:min(920px,calc(100% - 32px));height:74px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem}
        .im-brand{font-family:Georgia,'Times New Roman',serif;font-weight:700;letter-spacing:-.055em;color:var(--navy);font-size:clamp(1.35rem,3vw,2rem);text-decoration:none;white-space:nowrap}
        .im-close{border:1px solid var(--line);background:rgba(255,255,255,.75);border-radius:999px;color:var(--navy);font-weight:800;min-height:42px;padding:0 1rem;cursor:pointer}
        .im-shell{width:min(920px,calc(100% - 32px));margin:0 auto;padding:clamp(1.5rem,4vw,3rem) 0 4rem}
        .im-progress-head{display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:end;margin-bottom:1.25rem}
        .im-step-label{display:block;color:var(--blue);font-weight:900;margin-bottom:.35rem}
        .im-title{font-family:Georgia,'Times New Roman',serif;color:var(--navy);letter-spacing:-.045em;line-height:1.02;font-size:clamp(2.1rem,5vw,4.2rem);margin:0}
        .im-helper{color:var(--muted);font-size:1.05rem;line-height:1.55;margin:.7rem 0 0;max-width:690px}
        .im-pct{font-weight:900;color:var(--navy);white-space:nowrap}
        .im-progress-track{display:flex;align-items:center;margin:1.25rem 0 1.5rem}
        .im-progress-circle{width:42px;height:42px;border-radius:999px;border:2px solid #d9dee8;background:#fff;color:#7d8796;display:flex;align-items:center;justify-content:center;font-weight:900;flex:0 0 auto}
        .im-progress-circle.done,.im-progress-circle.current{background:var(--blue);border-color:var(--blue);color:#fff}
        .im-progress-line{height:3px;flex:1;background:#dfe5ee}.im-progress-line.done{background:var(--blue)}
        .im-card{background:rgba(255,255,255,.93);border:1px solid var(--line);border-radius:30px;box-shadow:var(--shadow);padding:clamp(1.35rem,4vw,2.4rem)}
        .im-card-grid{display:grid;gap:1.25rem}.im-step-fade{animation:imFadeSlide .22s ease both}@keyframes imFadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .im-section-title{display:flex;align-items:center;gap:.75rem;color:var(--navy);font-weight:900;margin:0 0 .85rem;font-size:1.03rem}
        .im-icon{width:42px;height:42px;border-radius:50%;background:#e9f5f1;color:var(--teal);display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}
        .im-option-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}.im-option-grid.two{grid-template-columns:repeat(2,1fr)}
        .im-choice{min-height:76px;border:1px solid #dce1e8;background:#fff;border-radius:14px;padding:.9rem;display:flex;align-items:center;gap:.85rem;color:var(--navy-2);font-weight:800;text-align:left;cursor:pointer;transition:border-color .15s ease,box-shadow .15s ease,background .15s ease}.im-choice:hover{border-color:var(--blue)}.im-choice.selected{border-color:var(--green);background:#f4fbf7;box-shadow:0 0 0 3px rgba(45,154,108,.08)}
        .im-choice .material-symbols-outlined{color:var(--teal);font-size:1.5rem}.im-choice-main{display:block}.im-choice-sub{display:block;color:var(--muted);font-size:.82rem;font-weight:600;margin-top:.15rem}
        .im-radio{width:22px;height:22px;border-radius:50%;border:2px solid #b8c0cc;margin-left:auto;flex:0 0 auto}.selected .im-radio{border-color:var(--green);background:radial-gradient(circle at center,var(--green) 42%,transparent 44%)}
        .im-field-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.im-field{display:flex;flex-direction:column;gap:.45rem}.im-label{color:var(--navy);font-weight:900;font-size:.92rem}.im-label-hint{font-weight:600;color:var(--muted)}
        .im-input,.im-select,.im-textarea{width:100%;border:1px solid #d9dee8;background:#fff;border-radius:12px;color:var(--navy);font-size:1rem;outline:none;box-sizing:border-box}.im-input,.im-select{height:54px;padding:0 .95rem}.im-textarea{min-height:116px;padding:.9rem .95rem;resize:vertical}.im-input:focus,.im-select:focus,.im-textarea:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(0,87,184,.08)}.im-input.error,.im-select.error,.im-textarea.error{border-color:#ba1a1a}
        .im-pill-row{display:flex;gap:.65rem;flex-wrap:wrap}.im-pill{border:1px solid #dce1e8;background:#fff;color:var(--navy-2);border-radius:999px;min-height:44px;padding:0 1rem;font-weight:800;cursor:pointer}.im-pill.selected{border-color:var(--green);background:#f4fbf7;color:var(--navy);box-shadow:0 0 0 3px rgba(45,154,108,.08)}
        .im-note{border:1px solid rgba(0,87,184,.22);background:#f3f8ff;color:var(--navy-2);border-radius:14px;padding:1rem;display:flex;gap:.8rem;line-height:1.55}.im-note.gold{background:linear-gradient(135deg,#fff,#fbf4e8);border-color:rgba(185,147,85,.24)}
        .im-trust{display:inline-flex;align-items:center;gap:.4rem;color:var(--navy-2);font-weight:800;font-size:.82rem}.im-trust-dot{width:7px;height:7px;border-radius:50%;background:var(--teal);flex:0 0 auto}.im-trust-row{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;border-top:1px solid var(--line);padding-top:1.1rem;margin-top:.35rem}
        .im-actions{display:flex;justify-content:space-between;align-items:center;gap:1rem;border-top:1px solid var(--line);padding-top:1.25rem}.im-btn-primary,.im-btn-back{min-height:58px;border-radius:14px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;gap:.75rem;cursor:pointer}.im-btn-primary{border:0;background:linear-gradient(135deg,var(--blue),var(--blue-strong));color:#fff;padding:0 1.5rem;box-shadow:0 12px 28px rgba(0,87,184,.24);min-width:220px}.im-btn-primary:disabled{opacity:.65;cursor:not-allowed}.im-btn-back{border:1px solid rgba(0,87,184,.22);background:#fff;color:var(--blue);padding:0 1.25rem}
        .im-err{color:#ba1a1a;font-size:.82rem;font-weight:800}.im-alert-box{background:#ffdad6;color:#8f1919;padding:1rem;border-radius:14px;font-weight:800}.im-counter{display:flex;justify-content:space-between;gap:1rem;color:var(--muted);font-size:.82rem;margin-top:.35rem}
        .material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 450,'GRAD' 0,'opsz' 24}
        @media(max-width:720px){.im-progress-head{grid-template-columns:1fr}.im-pct{display:none}.im-field-grid,.im-option-grid,.im-option-grid.two{grid-template-columns:1fr}.im-actions{flex-direction:column-reverse;align-items:stretch}.im-btn-primary,.im-btn-back{width:100%}.im-shell{width:min(100% - 24px,920px)}.im-topbar-inner{width:min(100% - 24px,920px)}.im-title{font-size:2.35rem}.im-card{border-radius:22px}}
      `}</style>

      <div className="im-overlay" role="dialog" aria-modal="true" aria-label="Start your Ontario Accident Review">
        <header className="im-topbar">
          <div className="im-topbar-inner">
            <a href="/" onClick={handleClose} className="im-brand">Ontario Accident Review</a>
            <button onClick={handleClose} className="im-close">Close</button>
          </div>
        </header>

        <main className="im-shell">
          <div className="im-progress-head">
            <div>
              <span className="im-step-label">{m.label}</span>
              <h1 className="im-title">{m.title}</h1>
              <p className="im-helper">{m.helper}</p>
            </div>
            <span className="im-pct">{m.pct}</span>
          </div>
          <Progress step={step} />

          {step === 1 && (
            <div key={fadeKey} className="im-card im-card-grid im-step-fade">
              <div>
                <h2 className="im-section-title"><span className="im-icon"><span className="material-symbols-outlined">directions_car</span></span>What type of motor vehicle accident was it?</h2>
                <div className="im-option-grid">
                  {ACCIDENT_TYPES.map(t => <Choice key={t.val} selected={accidentType === t.val} onClick={() => setAccidentType(t.val)} icon={t.icon} label={t.label} />)}
                </div>
              </div>

              <div className="im-field-grid">
                <Field label="Approximate accident date" error={fieldErrors.accidentDate} errText="Please enter an approximate date.">
                  <input type="date" className={`im-input${fieldErrors.accidentDate ? ' error' : ''}`} value={accidentDate} onChange={e => setAccidentDate(e.target.value)} />
                </Field>
                <Field label="City or region in Ontario" error={fieldErrors.cityArea} errText="Please enter the city or region.">
                  <input className={`im-input${fieldErrors.cityArea ? ' error' : ''}`} placeholder="Toronto, Brampton, Hamilton..." value={cityArea} onChange={e => setCityArea(e.target.value)} />
                </Field>
              </div>

              <div>
                <h2 className="im-section-title"><span className="im-icon"><span className="material-symbols-outlined">map</span></span>Did it happen in Ontario?</h2>
                <div className="im-pill-row">{['Yes', 'No', 'Not sure'].map(v => <Pill key={v} value={v} current={inOntario} onSelect={setInOntario} />)}</div>
                {fieldErrors.inOntario && <span className="im-err">Please choose one.</span>}
              </div>

              <Note icon="info">Approximate dates are okay. The goal is to organize the claim issue, not to give legal deadline advice.</Note>
              <Trust />
              <div className="im-actions"><span /><button type="button" className="im-btn-primary" onClick={goStep1to2}>Continue <span className="material-symbols-outlined">arrow_forward</span></button></div>
            </div>
          )}

          {step === 2 && (
            <div key={fadeKey} className="im-card im-card-grid im-step-fade">
              <div>
                <h2 className="im-section-title"><span className="im-icon"><span className="material-symbols-outlined">favorite</span></span>Were you injured?</h2>
                <div className="im-pill-row">{['Yes', 'No', 'Not sure'].map(v => <Pill key={v} value={v} current={injured} onSelect={setInjured} />)}</div>
                {fieldErrors.injured && <span className="im-err">Please choose one.</span>}
              </div>

              <div>
                <h2 className="im-section-title"><span className="im-icon"><span className="material-symbols-outlined">fact_check</span></span>What is the main accident-benefits issue?</h2>
                <div className="im-option-grid two">
                  {MAIN_ISSUES.map(issue => <Choice key={issue.val} selected={mainIssue === issue.val} onClick={() => setMainIssue(issue.val)} icon={issue.icon} label={issue.label} />)}
                </div>
                {fieldErrors.mainIssue && <span className="im-err">Please choose the closest issue.</span>}
              </div>

              <div className="im-field-grid">
                <div>
                  <h2 className="im-section-title"><span className="im-icon"><span className="material-symbols-outlined">medical_services</span></span>Need treatment coverage?</h2>
                  <div className="im-pill-row">{['Yes', 'No', 'Not sure'].map(v => <Pill key={v} value={v} current={treatment} onSelect={setTreatment} />)}</div>
                </div>
                <div>
                  <h2 className="im-section-title"><span className="im-icon"><span className="material-symbols-outlined">payments</span></span>Missing work?</h2>
                  <div className="im-pill-row">{['Yes', 'No', 'Not sure'].map(v => <Pill key={v} value={v} current={workImpact} onSelect={setWorkImpact} />)}</div>
                </div>
              </div>

              <Field label="Short message" hint="optional">
                <textarea className="im-textarea" rows={4} maxLength={500} value={message} onChange={e => setMessage(e.target.value)} placeholder="A sentence or two about what happened, what was denied, or what feels stalled." />
                <div className="im-counter"><span>Do not include policy numbers, health card numbers, or banking details.</span><span>{message.length}/500</span></div>
              </Field>

              <Note icon="info">There is no perfect answer here. Choose the closest issue so the review can focus on the right facts and dates.</Note>
              <Trust />
              <div className="im-actions"><button type="button" className="im-btn-back" onClick={() => goTo(1)}><span className="material-symbols-outlined">arrow_back</span> Back</button><button type="button" className="im-btn-primary" onClick={goStep2to3}>Continue <span className="material-symbols-outlined">arrow_forward</span></button></div>
            </div>
          )}

          {step === 3 && (
            <div key={fadeKey} className="im-card im-card-grid im-step-fade">
              <Note icon="shield" gold>Ontario Accident Review is not a law firm and does not provide legal advice. Submitting this request does not create a lawyer-client relationship.</Note>

              <Field label="First name" error={fieldErrors.firstName} errText="Please enter your first name.">
                <input className={`im-input${fieldErrors.firstName ? ' error' : ''}`} placeholder="First name" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </Field>

              <div className="im-field-grid">
                <Field label="Phone" error={fieldErrors.contact} errText="Please enter a phone or email.">
                  <input type="tel" className={`im-input${fieldErrors.contact ? ' error' : ''}`} placeholder="416-555-0100" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                </Field>
                <Field label="Email" error={fieldErrors.email || fieldErrors.contact} errText={fieldErrors.email ? 'Please enter a valid email.' : 'Please enter a phone or email.'}>
                  <input type="email" className={`im-input${fieldErrors.email || fieldErrors.contact ? ' error' : ''}`} placeholder="you@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
              </div>

              <Field label="Best time to reach you" hint="optional">
                <select className="im-select" value={bestTime} onChange={e => setBestTime(e.target.value)}><option value="">Select a time</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Anytime</option></select>
              </Field>

              {submitError && <div className="im-alert-box">{submitError}</div>}
              <div className="im-note"><span className="material-symbols-outlined">lock</span><span>Your information is used to review your accident-benefits situation and follow up about possible next steps. It is not sent to your insurer.</span></div>
              <Trust />
              <div className="im-actions"><button type="button" className="im-btn-back" onClick={() => goTo(2)}><span className="material-symbols-outlined">arrow_back</span> Back</button><button type="button" className="im-btn-primary" disabled={submitting} onClick={submitForm}>{submitting ? 'Submitting...' : 'Submit Free Review'}</button></div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function Progress({ step }) {
  return <div className="im-progress-track" aria-hidden="true"><span className="im-progress-circle done">✓</span><span className={`im-progress-line${step > 1 ? ' done' : ''}`} /><span className={`im-progress-circle${step >= 2 ? step > 2 ? ' done' : ' current' : ''}`}>2</span><span className={`im-progress-line${step > 2 ? ' done' : ''}`} /><span className={`im-progress-circle${step === 3 ? ' current' : ''}`}>3</span></div>;
}

function Choice({ selected, onClick, icon, label, sub }) {
  return <button type="button" className={`im-choice${selected ? ' selected' : ''}`} onClick={onClick}><span className="material-symbols-outlined">{icon}</span><span><span className="im-choice-main">{label}</span>{sub && <span className="im-choice-sub">{sub}</span>}</span><span className="im-radio" /></button>;
}

function Pill({ value, current, onSelect, children }) {
  return <button type="button" className={`im-pill${current === value ? ' selected' : ''}`} onClick={() => onSelect(value)}>{children || value}</button>;
}

function Field({ label, hint, children, error, errText }) {
  return <div className="im-field"><span className="im-label">{label} {hint && <span className="im-label-hint">({hint})</span>}</span>{children}{error && <span className="im-err">{errText}</span>}</div>;
}

function Note({ icon = 'info', gold = false, children }) {
  return <div className={`im-note${gold ? ' gold' : ''}`}><span className="material-symbols-outlined">{icon}</span><span>{children}</span></div>;
}

function Trust() {
  return <div className="im-trust-row">{['Free review', 'Ontario accident benefits', 'No obligation', 'About 2 minutes'].map(t => <span key={t} className="im-trust"><span className="im-trust-dot"></span>{t}</span>)}</div>;
}
