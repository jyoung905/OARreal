'use client';

import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@/lib/analytics';

/* ─────────────────────────────────────────────────────────────────
   IntakeModal — Rebrand 2026 (Mockup #4 style)
   - Hash trigger: #intake (preserved)
   - 4-step guided flow: Accident · Insurer status · Injuries · Contact
   - Cream bg, navy headings, option-card style answers, blue CTAs
   - Submits to /api/intake with the existing field shape (preserved)
   ───────────────────────────────────────────────────────────────── */

const ACCIDENT_TYPES = [
  { val: 'Car accident',           label: 'Car accident',     icon: 'car' },
  { val: 'Truck accident',         label: 'Truck',            icon: 'truck' },
  { val: 'Motorcycle accident',    label: 'Motorcycle',       icon: 'motorcycle' },
  { val: 'Pedestrian accident',    label: 'Pedestrian',       icon: 'walk' },
  { val: 'Bicycle accident',       label: 'Bicycle',          icon: 'bike' },
  { val: 'Other motor vehicle accident', label: 'Other',      icon: 'more' },
];

const CLAIM_STATUS_OPTIONS = [
  { val: 'I have not started a claim yet', icon: 'doc' },
  { val: 'I started a claim but I am confused', icon: 'help' },
  { val: 'My insurer is delayed or not responding', icon: 'check' },
  { val: 'A benefit was denied or reduced', icon: 'down' },
  { val: 'I received a settlement offer', icon: 'info' },
  { val: 'I am not sure', icon: 'help' },
];

const MAIN_ISSUES = [
  'I am not sure what benefits apply',
  'Insurance denied or delayed something',
  'I need treatment coverage',
  'I missed work',
  'My claim feels confusing',
  'Other',
];

const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

function readAttribution() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const existing = (() => { try { return JSON.parse(sessionStorage.getItem('oar_attribution') || '{}'); } catch { return {}; } })();
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
  const stored = (() => { try { return JSON.parse(sessionStorage.getItem('oar_attribution') || '{}'); } catch { return {}; } })();
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

const STEP_META = [
  { num: 1, title: 'Accident details', eyebrow: 'Tell us what happened in Ontario — short answers are fine.', up: 'Benefits and claim status' },
  { num: 2, title: 'Benefits and claim status', eyebrow: 'Choose the closest option. This helps us understand timing, urgency, and what to look at in your review.', up: 'Injuries and impact' },
  { num: 3, title: 'Injuries and impact', eyebrow: 'No medical records or detailed history needed at this stage.', up: 'Contact preference and consent' },
  { num: 4, title: 'Contact preference and consent', eyebrow: 'We use this to respond to your review request. Any referral or connection should be based on explicit consent.', up: null },
];

function Icn({ name, size = 18, color = 'currentColor' }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'check':       return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case 'check-circle':return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 16 10"/></svg>;
    case 'minus':       return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
    case 'down':        return <svg {...props}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
    case 'x':           return <svg {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case 'help':        return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case 'arrow-right': return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case 'arrow-left':  return <svg {...props}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
    case 'lock':        return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case 'user':        return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case 'shield':      return <svg {...props}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/></svg>;
    case 'info':        return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    case 'doc':         return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case 'car':         return <svg {...props}><path d="M5 17h14M3 17V11l2-5h14l2 5v6"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
    case 'truck':       return <svg {...props}><rect x="1" y="6" width="14" height="11" rx="1"/><path d="M15 9h4l3 4v4h-7"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>;
    case 'motorcycle':  return <svg {...props}><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6l-3-7h3M9 17l-3-7h3"/></svg>;
    case 'walk':        return <svg {...props}><circle cx="13" cy="4" r="2"/><path d="M9 22l2-7 3-3 3 4-3 6"/><path d="M11 15l-4-3 3-5 4 3"/></svg>;
    case 'bike':        return <svg {...props}><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-7h6l-2-4M10 10l3 4M14 10h2"/></svg>;
    case 'more':        return <svg {...props}><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>;
    default: return null;
  }
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
  const [claimStatus, setClaimStatus] = useState('');
  const [injured, setInjured] = useState('');
  const [mainIssue, setMainIssue] = useState('');
  const [workImpact, setWorkImpact] = useState('');
  const [treatment, setTreatment] = useState('');
  const [message, setMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [consent, setConsent] = useState(false);
  const [referralConsent, setReferralConsent] = useState(false);

  useEffect(() => {
    const onHash = () => {
      readAttribution();
      const open = window.location.hash === '#intake';
      setIsOpen(open);
      if (open) {
        intakeOpenTime.current = Date.now();
        setStep(1);
        Analytics.intakeStart();
        Analytics.intakeStepView({ step: 1, step_label: 'Accident basics' });
      }
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('modal-open', isOpen);
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goTo = (n) => { setStep(n); setFadeKey(k => k + 1); setSubmitError(''); setFieldErrors({}); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleClose = () => { setIsOpen(false); window.history.pushState(null, '', window.location.pathname); };

  const validate = (n) => {
    const errs = {};
    if (n === 1) {
      if (!accidentDate) errs.accidentDate = true;
      if (!cityArea.trim()) errs.cityArea = true;
      if (!inOntario) errs.inOntario = true;
    }
    if (n === 2) {
      if (!claimStatus) errs.claimStatus = true;
    }
    if (n === 3) {
      if (!injured) errs.injured = true;
      if (!mainIssue) errs.mainIssue = true;
    }
    if (n === 4) {
      if (!firstName.trim()) errs.firstName = true;
      if (!phone.trim() && !email.trim()) errs.contact = true;
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = true;
      if (!consent) errs.consent = true;
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    Analytics.intakeStepComplete({ step, step_label: STEP_META[step - 1].title });
    if (step < 4) { goTo(step + 1); Analytics.intakeStepView({ step: step + 1, step_label: STEP_META[step].title }); }
  };

  const submitForm = async () => {
    if (!validate(4)) return;
    setSubmitting(true); setSubmitError('');
    const elapsed = intakeOpenTime.current ? Date.now() - intakeOpenTime.current : undefined;
    Analytics.intakeSubmit({ accident_type: accidentType, claim_status: claimStatus, ontario_yn: inOntario, injured, time_to_submit_ms: elapsed });

    const insurerNote = claimStatus ? `Claim status: ${claimStatus}` : '';
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
      claimStatus,
      injured: injured || 'Not specified',
      medicalAttention: treatment || 'Not specified',
      workImpact: workImpact || 'Not specified',
      ongoingSymptoms: 'Not specified',
      spokenWithLawyer: 'Not specified',
      currentlyRepresented: 'No',
      thirdPartyInvolved: 'Not specified',
      accidentSummary: message || mainIssue || '',
      injuryDetails: message || '',
      additionalNotes: [insurerNote, mainIssue ? `Main issue: ${mainIssue}` : '', message ? `Message: ${message}` : ''].filter(Boolean).join('\n'),
      consentTruth: true,
      consentNotLawFirm: true,
      consentToContact: consent,
      consentReferralShare: referralConsent,
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
      ...getAttribution(),
    };

    try {
      const response = await fetch('/api/intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success === true) {
        Analytics.submissionSuccess({ accident_type: accidentType, claim_status: claimStatus, time_to_complete_ms: elapsed });
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
  const meta = STEP_META[step - 1];

  return (
    <div className="im-overlay" style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--bg)', overflowY: 'auto',
      fontFamily: 'var(--font-body)', color: 'var(--text-strong)',
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250, 246, 239, 0.94)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border-soft)', padding: '0.875rem 1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 880, margin: '0 auto', gap: '1rem' }}>
          <a href="/" onClick={(e) => { e.preventDefault(); handleClose(); }} style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.125rem', color: 'var(--primary)', letterSpacing: '-0.01em' }}>Ontario Accident Review</span>
          </a>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icn name="shield" size={16} />
            </span>
            <button onClick={handleClose} className="oar-hide-mobile" style={{ background: 'transparent', border: 0, color: 'var(--muted)', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}>Close</button>
          </span>
        </div>
      </header>

      <main className="im-main" style={{ padding: 'clamp(1.5rem, 4vw, 3rem) 1.25rem 5rem', maxWidth: 760, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* Step counter + dots */}
        <p style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.875rem' }}>
          Step {step} of 4
        </p>
        <div className="oar-stepper" style={{ marginBottom: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
          {[1, 2, 3, 4].map((n, i) => (
            <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className={`oar-step-dot ${n < step ? 'is-done' : n === step ? 'is-active' : ''}`}>
                {n < step ? <Icn name="check" size={13} color="#fff" /> : n}
              </span>
              {i < 3 && <span className={`oar-step-rail ${n < step ? 'is-done' : ''}`} />}
            </span>
          ))}
        </div>

        <div key={fadeKey} className="oar-card oar-card-elevated oar-fade-in im-card" style={{ background: 'var(--surface)', padding: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, borderRadius: 'var(--radius-md)',
            background: 'var(--green-soft)', color: 'var(--green-strong)',
            marginBottom: '1.25rem',
          }}>
            <Icn name={step === 1 ? 'doc' : step === 2 ? 'user' : step === 3 ? 'shield' : 'lock'} size={22} />
          </span>

          <h1 className="oar-h2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', marginTop: 0, marginBottom: '0.625rem' }}>
            {meta.title}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, marginTop: 0, marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }} id={`im-step-${step}-help`}>
            {meta.eyebrow}
          </p>

          {/* STEP 1 — Accident basics */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="oar-field">
                <span className="oar-field-label">What type of accident was it?</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.625rem' }}>
                  {ACCIDENT_TYPES.map(t => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setAccidentType(t.val)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: '0.5rem', padding: '0.875rem 0.5rem',
                        background: accidentType === t.val ? 'var(--accent-soft)' : 'var(--surface)',
                        border: `1px solid ${accidentType === t.val ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-md)',
                        color: accidentType === t.val ? 'var(--accent)' : 'var(--text-strong)',
                        fontSize: '0.85rem', fontWeight: 500,
                        cursor: 'pointer', minHeight: 80,
                        transition: 'all 0.15s',
                      }}
                    >
                      <Icn name={t.icon} size={22} color={accidentType === t.val ? 'var(--accent)' : 'var(--muted)'} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="im-grid-2">
                <div className="oar-field">
                  <label className="oar-field-label" htmlFor="im-date">Approximate accident date</label>
                  <input id="im-date" type="date" className="oar-input" value={accidentDate} onChange={e => setAccidentDate(e.target.value)} />
                  <span className="im-helper-text">Approximate is fine — use your best guess if you do not remember the exact day.</span>
                  {fieldErrors.accidentDate && <span style={{ color: '#b91c1c', fontSize: '0.78rem', fontWeight: 500 }}>Please enter an approximate date.</span>}
                </div>
                <div className="oar-field">
                  <label className="oar-field-label" htmlFor="im-city">City or region in Ontario</label>
                  <input id="im-city" className="oar-input" placeholder="Toronto, Hamilton, Brampton..." value={cityArea} onChange={e => setCityArea(e.target.value)} />
                  {fieldErrors.cityArea && <span style={{ color: '#b91c1c', fontSize: '0.78rem', fontWeight: 500 }}>Please enter the city or region.</span>}
                </div>
              </div>

              <div className="oar-field">
                <span className="oar-field-label">Did it happen in Ontario?</span>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                  {['Yes', 'No', 'Not sure'].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setInOntario(v)}
                      style={{
                        padding: '0.6rem 1.25rem',
                        background: inOntario === v ? 'var(--accent)' : 'var(--surface)',
                        border: `1px solid ${inOntario === v ? 'var(--accent)' : 'var(--border-strong)'}`,
                        borderRadius: 'var(--radius-full)',
                        color: inOntario === v ? '#fff' : 'var(--text-strong)',
                        fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer',
                      }}
                    >{v}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Claim status (option cards) */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }} role="radiogroup" aria-describedby="im-step-2-help" aria-label="Claim status">
              {CLAIM_STATUS_OPTIONS.map(opt => {
                const selected = claimStatus === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setClaimStatus(opt.val)}
                    className="im-claim-option"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1.125rem 1.25rem',
                      background: selected ? 'var(--green-soft)' : 'var(--surface)',
                      border: `1px solid ${selected ? 'var(--green)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                      boxShadow: selected ? '0 0 0 1px var(--green)' : 'none',
                    }}
                  >
                    <span style={{
                      width: 38, height: 38, borderRadius: 'var(--radius-sm)',
                      background: selected ? 'rgba(44, 138, 89, 0.18)' : 'var(--green-soft)',
                      color: 'var(--green-strong)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icn name={opt.icon} size={18} />
                    </span>
                    <span style={{ flex: 1, color: 'var(--text-strong)', fontSize: '0.95rem', fontWeight: 500 }}>{opt.val}</span>
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      border: `2px solid ${selected ? 'var(--green)' : 'var(--border-strong)'}`,
                      background: 'var(--surface)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {selected && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />}
                    </span>
                  </button>
                );
              })}
              {fieldErrors.claimStatus && <span role="alert" style={{ color: '#b91c1c', fontSize: '0.85rem', fontWeight: 500, marginTop: '0.25rem' }}>Please choose the closest option.</span>}

              <div className="oar-callout" style={{ marginTop: '1rem' }}>
                <span className="oar-callout-icon"><Icn name="info" size={12} color="#fff" /></span>
                <span>There&rsquo;s no right or wrong answer. If you&rsquo;re unsure, choose the option that feels closest.</span>
              </div>
            </div>
          )}

          {/* STEP 3 — Injuries / impact */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="oar-field">
                <span className="oar-field-label">Were you injured?</span>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                  {['Yes', 'No', 'Not sure'].map(v => (
                    <button key={v} type="button" onClick={() => setInjured(v)}
                      style={{
                        padding: '0.6rem 1.25rem',
                        background: injured === v ? 'var(--accent)' : 'var(--surface)',
                        border: `1px solid ${injured === v ? 'var(--accent)' : 'var(--border-strong)'}`,
                        borderRadius: 'var(--radius-full)',
                        color: injured === v ? '#fff' : 'var(--text-strong)',
                        fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer',
                      }}>{v}</button>
                  ))}
                </div>
                {fieldErrors.injured && <span style={{ color: '#b91c1c', fontSize: '0.78rem', fontWeight: 500 }}>Please choose one.</span>}
              </div>

              <div className="oar-field">
                <span className="oar-field-label">What is the main issue?</span>
                <div className="oar-option-list">
                  {MAIN_ISSUES.map(issue => {
                    const selected = mainIssue === issue;
                    return (
                      <button key={issue} type="button" onClick={() => setMainIssue(issue)}
                        className={`oar-option ${selected ? 'is-selected' : ''}`}
                        style={{ textAlign: 'left' }}>
                        <span className="oar-option-radio" />
                        <span className="oar-option-text">{issue}</span>
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.mainIssue && <span style={{ color: '#b91c1c', fontSize: '0.78rem', fontWeight: 500 }}>Please choose the closest issue.</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="im-grid-2">
                <div className="oar-field">
                  <span className="oar-field-label">Need treatment coverage?</span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['Yes', 'No', 'Not sure'].map(v => (
                      <button key={v} type="button" onClick={() => setTreatment(v)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: treatment === v ? 'var(--accent-soft)' : 'var(--surface)',
                          border: `1px solid ${treatment === v ? 'var(--accent)' : 'var(--border-strong)'}`,
                          borderRadius: 'var(--radius-full)',
                          color: treatment === v ? 'var(--accent)' : 'var(--text-strong)',
                          fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer',
                        }}>{v}</button>
                    ))}
                  </div>
                </div>
                <div className="oar-field">
                  <span className="oar-field-label">Missing work?</span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['Yes', 'No', 'Not sure'].map(v => (
                      <button key={v} type="button" onClick={() => setWorkImpact(v)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: workImpact === v ? 'var(--accent-soft)' : 'var(--surface)',
                          border: `1px solid ${workImpact === v ? 'var(--accent)' : 'var(--border-strong)'}`,
                          borderRadius: 'var(--radius-full)',
                          color: workImpact === v ? 'var(--accent)' : 'var(--text-strong)',
                          fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer',
                        }}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="oar-field">
                <label className="oar-field-label" htmlFor="im-msg">Anything else you want us to know? <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea id="im-msg" className="oar-textarea" rows={4} maxLength={500} placeholder="A sentence or two about what happened or what feels stalled." value={message} onChange={e => setMessage(e.target.value)} />
                <p style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>
                  <span>Don&rsquo;t include policy numbers, health card numbers, or banking details.</span>
                  <span>{message.length}/500</span>
                </p>
              </div>
            </div>
          )}

          {/* STEP 4 — Contact */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="oar-callout" style={{ background: 'var(--accent-soft)', borderColor: 'rgba(20,83,184,0.16)' }}>
                <span className="oar-callout-icon"><Icn name="lock" size={12} color="#fff" /></span>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.15rem', color: 'var(--primary)' }}>What happens after you submit.</strong>
                  We review the accident details, benefit issues, contact preference, and consent choices you provide. We use your submission to respond to the review request. We do not sell your information, and any referral or connection should happen only with explicit consent or as described in our Privacy Policy.
                </div>
              </div>

              <div className="oar-field">
                <label className="oar-field-label" htmlFor="im-name">First name</label>
                <input id="im-name" className="oar-input" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                {fieldErrors.firstName && <span style={{ color: '#b91c1c', fontSize: '0.78rem', fontWeight: 500 }}>Please enter your first name.</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="im-grid-2">
                <div className="oar-field">
                  <label className="oar-field-label" htmlFor="im-phone">Phone</label>
                  <input id="im-phone" type="tel" className="oar-input" placeholder="416-555-0100" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="oar-field">
                  <label className="oar-field-label" htmlFor="im-email">Email</label>
                  <input id="im-email" type="email" className="oar-input" placeholder="you@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
                  {fieldErrors.email && <span style={{ color: '#b91c1c', fontSize: '0.78rem', fontWeight: 500 }}>Please enter a valid email.</span>}
                </div>
              </div>
              {fieldErrors.contact && <span style={{ color: '#b91c1c', fontSize: '0.78rem', fontWeight: 500, marginTop: '-0.5rem' }}>Please enter at least a phone or email.</span>}

              <div className="oar-field" style={{ maxWidth: 280 }}>
                <label className="oar-field-label" htmlFor="im-time">Best time to reach you <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
                <select id="im-time" className="oar-select" value={bestTime} onChange={e => setBestTime(e.target.value)}>
                  <option value="">Select a time</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Anytime</option>
                </select>
              </div>

              <label className="im-consent-card im-consent-required" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.125rem', background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 18, height: 18, marginTop: 2, flexShrink: 0 }} />
                <span className="im-consent-copy" style={{ fontSize: '0.875rem', color: 'var(--text-strong)', lineHeight: 1.55 }}>
                  <strong>I consent to being contacted about my review request.</strong>
                  <span>I acknowledge the <a href="/privacy" style={{ color: 'var(--accent)', fontWeight: 500 }}>Privacy Policy</a> and understand Ontario Accident Review is not a law firm and does not provide legal advice.</span>
                </span>
              </label>
              {fieldErrors.consent && <span style={{ color: '#b91c1c', fontSize: '0.78rem', fontWeight: 500, marginTop: '-0.75rem' }}>Please confirm consent before submitting.</span>}

              <label className="im-consent-card im-consent-optional" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.125rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                <input type="checkbox" checked={referralConsent} onChange={e => setReferralConsent(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 18, height: 18, marginTop: 2, flexShrink: 0 }} />
                <span className="im-consent-copy" style={{ fontSize: '0.875rem', color: 'var(--text-strong)', lineHeight: 1.55 }}>
                  <strong>Optional referral consent.</strong>
                  <span>I consent to Ontario Accident Review sharing my submission with a qualified legal professional or relevant service provider if that appears useful for follow-up. This is optional and does not create a lawyer-client relationship.</span>
                </span>
              </label>

              {submitError && (
                <div className="oar-callout" style={{ background: '#fdecea', borderColor: '#f5b8b8', color: '#7a1f1f' }}>
                  <span className="oar-callout-icon" style={{ background: '#b91c1c' }}>!</span>
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Privacy badge */}
        <p style={{ marginTop: '0.875rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', width: '100%', justifyContent: 'center' }}>
          <Icn name="lock" size={13} color="var(--green)" /> Private review
        </p>

        {/* Action row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }} className="im-actions">
          {step > 1 ? (
            <button onClick={() => goTo(step - 1)} className="oar-btn oar-btn-secondary" style={{ background: 'var(--surface)' }}>
              <Icn name="arrow-left" size={14} /> Back
            </button>
          ) : <span />}
          {step < 4
            ? <button onClick={next} className="oar-btn oar-btn-primary">Continue <Icn name="arrow-right" size={14} /></button>
            : <button onClick={submitForm} disabled={submitting} aria-disabled={submitting} className="oar-btn oar-btn-primary">{submitting ? 'Submitting…' : 'Submit private review'} {!submitting && <Icn name="arrow-right" size={14} />}</button>
          }
        </div>

        {/* Next-up preview */}
        {meta.up && (
          <div className="oar-card im-next-card" style={{
            marginTop: '1.25rem', background: 'var(--surface)',
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            padding: '1rem 1.25rem',
          }}>
            <span style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-soft)', color: 'var(--accent)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icn name="doc" size={18} />
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>Next up: {meta.up}</p>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.825rem' }}>
                {step === 1 && 'How insurance has handled your situation so far.'}
                {step === 2 && 'Quick questions about your injuries and impact.'}
                {step === 3 && 'Where we should send your review summary.'}
              </p>
            </div>
            <Icn name="arrow-right" size={16} color="var(--muted)" />
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 560px) {
          .im-grid-2 { grid-template-columns: 1fr !important; }
          .im-actions { flex-direction: column-reverse; align-items: stretch !important; }
          .im-actions > .oar-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
