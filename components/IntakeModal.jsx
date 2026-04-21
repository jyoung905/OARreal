'use client';

import { useState, useEffect } from 'react';

/* ── Step metadata ── */
const META = [
  null,
  { label: 'Step 1 of 3', title: 'Tell us about the accident', pct: '33%', w: '33%' },
  { label: 'Step 2 of 3', title: 'How has this affected you?', pct: '66%', w: '66%' },
  { label: 'Step 3 of 3', title: 'Where should we reach you?', pct: '100%', w: '100%' },
];

const ACCIDENT_TYPES = [
  { val: 'Car accident',         icon: 'directions_car',    label: 'Car accident' },
  { val: 'Slip and fall',        icon: 'person_raised_hand', label: 'Slip and fall' },
  { val: 'Pedestrian accident',  icon: 'directions_walk',   label: 'Pedestrian' },
  { val: 'Bicycle accident',     icon: 'pedal_bike',        label: 'Bicycle' },
  { val: 'Motorcycle accident',  icon: 'two_wheeler',       label: 'Motorcycle' },
  { val: 'Other',                icon: 'more_horiz',        label: 'Other' },
];

const CLAIM_STATUS_OPTIONS = [
  { val: 'No claim filed yet',              label: 'I haven\'t filed a claim yet' },
  { val: 'Claim filed — ongoing',           label: 'I filed — still open' },
  { val: 'Claim denied or underpaid',       label: 'My claim was denied or underpaid' },
  { val: 'Claim closed — unsure if right',  label: 'My claim was closed — not sure if it should be' },
  { val: 'Received a settlement offer',     label: 'I received a settlement offer' },
  { val: 'Not sure',                        label: 'Not sure' },
];

export function IntakeModal() {
  const [isOpen, setIsOpen]       = useState(false);
  const [step, setStep]           = useState(1);
  const [fadeKey, setFadeKey]     = useState(0);

  /* Form state */
  const [accidentType, setAccidentType]   = useState('');
  const [ontario, setOntario]             = useState('');
  const [accidentDate, setAccidentDate]   = useState('');
  const [claimStatus, setClaimStatus]     = useState('');
  const [injured, setInjured]             = useState('');
  const [missedWork, setMissedWork]       = useState('');
  const [treatment, setTreatment]         = useState('');
  const [ongoingSymptoms, setOngoingSymptoms] = useState('');
  const [description, setDescription]     = useState('');
  const [firstName, setFirstName]         = useState('');
  const [lastName, setLastName]           = useState('');
  const [email, setEmail]                 = useState('');
  const [phone, setPhone]                 = useState('');
  const [bestTime, setBestTime]           = useState('');
  const [fieldErrors, setFieldErrors]     = useState({});
  const [submitError, setSubmitError]     = useState('');
  const [submitting, setSubmitting]       = useState(false);

  /* Hash-based open/close */
  useEffect(() => {
    const onHash = () => setIsOpen(window.location.hash === '#intake');
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const pushEvent = (name, params) => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, ...params });
    }
  };

  const goTo = (n) => { setStep(n); setFadeKey(k => k + 1); };

  const handleClose = () => {
    setIsOpen(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  const goStep1to2 = () => { pushEvent('intake_step1_complete', { accident_type: accidentType }); goTo(2); };
  const goStep2to3 = () => { pushEvent('intake_step2_complete'); goTo(3); };

  const submitForm = async () => {
    const errs = {};
    if (!firstName.trim()) errs.firstName = true;
    if (!lastName.trim())  errs.lastName  = true;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = true;
    if (!phone.trim()) errs.phone = true;
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      fullName:           (firstName + ' ' + lastName).trim(),
      email,
      phone,
      bestTime:           bestTime || 'Not specified',
      contactMethod:      'Either',
      accidentType:       accidentType || 'Not specified',
      accidentDate:       accidentDate || 'Not specified',
      inOntario:          ontario || 'Not specified',
      claimStatus:        claimStatus || 'Not specified',
      injured:            injured || 'Not specified',
      medicalAttention:   treatment || 'Not specified',
      workImpact:         missedWork || 'Not specified',
      ongoingSymptoms:    ongoingSymptoms || 'Not specified',
      spokenWithLawyer:   'Not specified',
      currentlyRepresented: 'No',
      thirdPartyInvolved: 'Not specified',
      accidentSummary:    description || '',
      additionalNotes:    '',
      cityArea:           'Ontario',
      sourcePage:         typeof window !== 'undefined' ? window.location.pathname : '/',
    };

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok && data.success !== false) {
        pushEvent('form_submit_success', { accident_type: accidentType, claim_status: claimStatus });
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

  /* Shared pill button */
  const Pill = ({ value, current, onSelect, children }) => (
    <button
      type="button"
      className={`im-pill${current === value ? ' selected' : ''}`}
      onClick={() => onSelect(value)}
    >
      {children || value}
    </button>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .im-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#f8f9fb;overflow-y:auto;font-family:'Open Sans',system-ui,sans-serif;color:#191c1e}
        .im-headline{font-family:Raleway,system-ui,sans-serif}
        .im-label{font-family:'Open Sans',sans-serif;font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#44474f;margin-bottom:0.35rem;display:block}
        .im-label-hint{font-weight:400;text-transform:none;letter-spacing:normal;color:#75777f}
        .im-glass{background:rgba(248,249,251,0.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(197,198,208,0.15)}
        .im-card{background:#ffffff;border-radius:0.75rem;padding:2rem 2rem;box-shadow:0 2px 24px rgba(0,2,10,0.06);border:1px solid #e8eaec}

        .im-prog-track{height:6px;width:100%;background:#edeef0;border-radius:3px;overflow:hidden}
        .im-prog-bar{height:100%;border-radius:3px;transition:width 0.5s ease;background:linear-gradient(90deg,#735c00,#cba72f)}

        .im-step-fade{animation:imFadeSlide 0.22s ease both}
        @keyframes imFadeSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

        /* Accident type grid buttons */
        .im-acc-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.4rem;padding:0.875rem 0.5rem;border-radius:0.5rem;border:2px solid #d8d9e0;background:#f3f4f6;font-family:'Open Sans',sans-serif;font-size:0.8rem;font-weight:600;color:#44474f;cursor:pointer;transition:all 0.15s;text-align:center;line-height:1.3;min-height:76px}
        .im-acc-btn:hover{background:#fff;border-color:#001b44;color:#001b44}
        .im-acc-btn.selected{background:#fff;border-color:#735c00;color:#001b44;box-shadow:0 0 0 3px rgba(115,92,0,0.12)}
        .im-acc-btn.selected .im-acc-icon{color:#735c00}
        .im-acc-icon{font-size:1.4rem;color:#75777f;transition:color 0.15s;font-variation-settings:'FILL' 1}

        /* Pills (yes/no/not sure) */
        .im-pill{padding:0.5rem 1.1rem;border-radius:999px;font-size:0.82rem;font-weight:600;font-family:'Open Sans',sans-serif;border:1.5px solid #c5c6d0;background:#fff;color:#44474f;cursor:pointer;transition:all 0.15s;white-space:nowrap}
        .im-pill:hover{border-color:#001b44;color:#001b44}
        .im-pill.selected{background:#001b44;border-color:#001b44;color:#fff}

        /* Claim status — stacked button list */
        .im-claim-btn{display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1rem;border-radius:0.5rem;border:2px solid #d8d9e0;background:#f3f4f6;cursor:pointer;transition:all 0.15s;text-align:left;width:100%;font-family:'Open Sans',sans-serif;font-size:0.875rem;font-weight:600;color:#44474f}
        .im-claim-btn:hover{background:#fff;border-color:#001b44;color:#001b44}
        .im-claim-btn.selected{background:#fff;border-color:#735c00;color:#001b44;box-shadow:0 0 0 3px rgba(115,92,0,0.1)}
        .im-claim-dot{width:10px;height:10px;border-radius:50%;background:#c5c6d0;flex-shrink:0;transition:background 0.15s}
        .im-claim-btn.selected .im-claim-dot{background:#735c00}

        /* Y/N question row */
        .im-yn-block{background:#f3f4f6;border-radius:0.75rem;overflow:hidden}
        .im-yn-row{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:0.875rem 1.25rem}
        .im-yn-row+.im-yn-row{border-top:1px solid rgba(197,198,208,0.3)}
        .im-yn-q{font-size:0.875rem;font-weight:600;color:#001b44;line-height:1.4;flex:1}
        .im-yn-hint{font-size:0.75rem;color:#75777f;font-weight:400;margin-top:0.15rem}

        /* Text input / textarea */
        .im-input{width:100%;background:transparent;border:0;border-bottom:2px solid #c5c6d0;padding:0.25rem 0 0.6rem;font-weight:500;color:#191c1e;font-size:0.95rem;outline:none;font-family:'Open Sans',sans-serif;box-sizing:border-box}
        .im-input:focus{border-bottom-color:#735c00}
        .im-input.error{border-bottom-color:#ba1a1a}
        .im-input::placeholder{color:#75777f}

        .im-textarea{width:100%;background:#f3f4f6;border:0;border-bottom:2px solid #c5c6d0;padding:0.75rem 1rem;font-weight:400;color:#191c1e;font-size:0.875rem;outline:none;font-family:'Open Sans',sans-serif;border-radius:0.5rem 0.5rem 0 0;resize:none;box-sizing:border-box}
        .im-textarea:focus{border-bottom-color:#735c00}
        .im-textarea::placeholder{color:#75777f}

        .im-select{width:100%;background:#f3f4f6;border:0;border-bottom:2px solid #c5c6d0;padding:0.75rem 0;font-weight:500;color:#191c1e;font-size:0.875rem;outline:none;font-family:'Open Sans',sans-serif}
        .im-select:focus{border-bottom-color:#735c00}

        /* Buttons */
        .im-btn-primary{background:linear-gradient(135deg,#001b44,#003180);color:#fff;padding:1rem 2rem;border-radius:0.375rem;font-weight:700;letter-spacing:0.04em;box-shadow:0 8px 20px rgba(0,27,68,0.2);display:inline-flex;align-items:center;gap:0.75rem;font-family:'Open Sans',sans-serif;font-size:0.875rem;cursor:pointer;border:none;transition:all 0.15s;white-space:nowrap}
        .im-btn-primary:hover{box-shadow:0 12px 28px rgba(0,27,68,0.3);transform:translateY(-1px)}
        .im-btn-primary:active{transform:scale(0.96)}
        .im-btn-primary:disabled{opacity:0.65;cursor:not-allowed;transform:none}

        .im-btn-back{display:flex;align-items:center;gap:0.4rem;color:#44474f;font-weight:600;font-family:'Open Sans',sans-serif;font-size:0.875rem;cursor:pointer;background:none;border:none;padding:0.5rem 0;transition:color 0.15s}
        .im-btn-back:hover{color:#001b44}

        /* Trust row */
        .im-trust{display:inline-flex;align-items:center;gap:0.3rem;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#44474f;font-family:'Open Sans',sans-serif}
        .im-trust-dot{width:5px;height:5px;border-radius:50%;background:#cba72f;flex-shrink:0}

        /* Error/alert */
        .im-err{color:#ba1a1a;font-size:0.75rem;font-weight:600;margin-top:0.25rem;display:block}
        .im-alert-box{background:#ffdad6;color:#ba1a1a;padding:0.75rem 1rem;border-radius:0.5rem;font-size:0.875rem;display:flex;align-items:flex-start;gap:0.5rem}

        /* Info/note boxes */
        .im-note-box{background:#fff8e1;border:1px solid #cba72f;border-radius:0.5rem;padding:0.875rem 1rem;font-size:0.82rem;color:#735c00;line-height:1.5}
        .im-info-box{background:#e8f0ff;border:1px solid #3a82c8;border-radius:0.5rem;padding:0.875rem 1rem;font-size:0.82rem;color:#001b44;line-height:1.6}

        /* Divider */
        .im-divider{border:0;border-top:1px solid rgba(197,198,208,0.25);margin:0}

        /* Responsive */
        @media(max-width:520px){
          .im-card{padding:1.5rem 1rem}
          .im-acc-grid{grid-template-columns:repeat(2,1fr) !important}
          .im-contact-grid{grid-template-columns:1fr !important}
          .im-yn-row{flex-direction:column;align-items:flex-start;gap:0.75rem}
        }

        .material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24}
      `}</style>

      <div className="im-overlay">

        {/* ── Header ── */}
        <header className="im-glass" style={{position:'sticky',top:0,zIndex:50}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.875rem 1.5rem',maxWidth:'52rem',margin:'0 auto'}}>
            <a href="/" onClick={handleClose} style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 100" fill="none" height="34" style={{width:'auto'}}>
                <path d="M 72 64 A 28 28 0 1 1 48 22" stroke="#1a3060" strokeWidth="7" strokeLinecap="round" fill="none"/>
                <path d="M 48 22 A 28 28 0 0 1 72 64" stroke="#3a82c8" strokeWidth="7" strokeLinecap="round" fill="none"/>
                <line x1="48" y1="30" x2="48" y2="42" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round"/>
                <line x1="48" y1="42" x2="48" y2="58" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round"/>
                <polyline points="38,50 48,62 58,50" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <text x="92" y="44" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="25" fill="#1a3060">Ontario</text>
                <text x="92" y="74" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="25" fill="#1a3060">Accident Review</text>
              </svg>
            </a>
            <div style={{display:'flex',alignItems:'center',gap:'1.25rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:'0.375rem',fontSize:'0.75rem',fontWeight:600,color:'#44474f'}}>
                <span className="material-symbols-outlined" style={{fontSize:'1rem',color:'#735c00',fontVariationSettings:"'FILL' 1"}}>lock</span>
                Confidential
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'0.375rem',fontSize:'0.75rem',fontWeight:600,color:'#44474f'}}>
                <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#22c55e',display:'inline-block'}}></span>
                Free &middot; No Obligation
              </div>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main style={{padding:'2rem 1rem 4rem',maxWidth:'52rem',margin:'0 auto',width:'100%',boxSizing:'border-box'}}>
          <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>

            {/* Progress */}
            <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:'1rem'}}>
                <div>
                  <span style={{display:'block',fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#735c00',fontFamily:"'Open Sans',sans-serif",marginBottom:'0.2rem'}}>{m.label}</span>
                  <h1 className="im-headline" style={{fontSize:'1.625rem',fontWeight:800,color:'#001b44',lineHeight:1.2,margin:0}}>{m.title}</h1>
                </div>
                <span style={{fontSize:'0.875rem',fontWeight:700,color:'#001b44',whiteSpace:'nowrap',fontFamily:"'Open Sans',sans-serif"}}>{m.pct}</span>
              </div>
              <div className="im-prog-track">
                <div className="im-prog-bar" style={{width:m.w}}></div>
              </div>
            </div>

            {/* ════════ STEP 1 — Accident basics ════════ */}
            {step === 1 && (
              <div key={fadeKey} className="im-card im-step-fade" style={{display:'flex',flexDirection:'column',gap:'1.75rem'}}>

                <p style={{fontSize:'0.875rem',color:'#44474f',lineHeight:1.6,margin:0}}>
                  Just the basics — no documents needed, no insurance details required.
                </p>

                {/* Accident type */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
                  <span className="im-label">What type of accident was it?</span>
                  <div className="im-acc-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.625rem'}}>
                    {ACCIDENT_TYPES.map(t => (
                      <button key={t.val} type="button" className={`im-acc-btn${accidentType === t.val ? ' selected' : ''}`} onClick={() => setAccidentType(t.val)}>
                        <span className="material-symbols-outlined im-acc-icon">{t.icon}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ontario Y/N */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
                  <span className="im-label">Did this happen in Ontario?</span>
                  <div style={{display:'flex',gap:'0.625rem'}}>
                    {['Yes', 'No'].map(v => <Pill key={v} value={v} current={ontario} onSelect={setOntario} />)}
                  </div>
                  {ontario === 'No' && (
                    <div className="im-note-box">
                      <strong>Heads up:</strong> We review Ontario accident situations only. If your accident occurred outside Ontario, we may not be the right fit.
                    </div>
                  )}
                </div>

                {/* Approximate date */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.375rem'}}>
                  <span className="im-label">
                    When did the accident happen?{' '}
                    <span className="im-label-hint">(approximate is fine)</span>
                  </span>
                  <input type="date" className="im-input" style={{maxWidth:'15rem'}} value={accidentDate} onChange={e => setAccidentDate(e.target.value)} />
                  <span style={{fontSize:'0.75rem',color:'#75777f'}}>
                    Ontario accident claims have deadlines. Timing helps us give you relevant guidance.
                  </span>
                </div>

                {/* Claim status */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
                  <span className="im-label">
                    Where does your claim situation stand right now?{' '}
                    <span className="im-label-hint">(pick the closest)</span>
                  </span>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                    {CLAIM_STATUS_OPTIONS.map(opt => (
                      <button key={opt.val} type="button" className={`im-claim-btn${claimStatus === opt.val ? ' selected' : ''}`} onClick={() => setClaimStatus(opt.val)}>
                        <span className="im-claim-dot"></span>
                        {opt.label}
                        {claimStatus === opt.val && (
                          <span className="material-symbols-outlined" style={{fontSize:'1rem',color:'#735c00',flexShrink:0,marginLeft:'auto',fontVariationSettings:"'FILL' 1"}}>check_circle</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <span style={{fontSize:'0.75rem',color:'#75777f'}}>
                    This helps us understand what kind of review is most useful for you.
                  </span>
                </div>

                {/* Trust row */}
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem'}}>
                  {['Free', 'Confidential', 'No obligation', 'No documents required'].map(t => (
                    <span key={t} className="im-trust"><span className="im-trust-dot"></span>{t}</span>
                  ))}
                </div>

                <hr className="im-divider" />
                <div style={{display:'flex',justifyContent:'flex-end'}}>
                  <button type="button" className="im-btn-primary" onClick={goStep1to2}>
                    Continue <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 0"}}>arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* ════════ STEP 2 — Impact ════════ */}
            {step === 2 && (
              <div key={fadeKey} className="im-card im-step-fade" style={{display:'flex',flexDirection:'column',gap:'1.75rem'}}>

                <p style={{fontSize:'0.875rem',color:'#44474f',lineHeight:1.6,margin:0}}>
                  If you&apos;re not sure, pick the closest answer — you can explain more at the end.
                </p>

                {/* Y/N block */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
                  <span className="im-label">A few quick questions</span>
                  <div className="im-yn-block">
                    <div className="im-yn-row">
                      <div style={{flex:1}}>
                        <div className="im-yn-q">Were you injured?</div>
                        <div className="im-yn-hint">Physical pain, psychological impact, or both</div>
                      </div>
                      <div style={{display:'flex',gap:'0.5rem',flexShrink:0}}>
                        {['Yes','No','Not sure'].map(v => <Pill key={v} value={v} current={injured} onSelect={setInjured} />)}
                      </div>
                    </div>
                    <div className="im-yn-row">
                      <div style={{flex:1}}>
                        <div className="im-yn-q">Did it affect your work or daily life?</div>
                        <div className="im-yn-hint">Time off, reduced capacity, or household tasks</div>
                      </div>
                      <div style={{display:'flex',gap:'0.5rem',flexShrink:0}}>
                        {['Yes','No','Not sure'].map(v => <Pill key={v} value={v} current={missedWork} onSelect={setMissedWork} />)}
                      </div>
                    </div>
                    <div className="im-yn-row">
                      <div style={{flex:1}}>
                        <div className="im-yn-q">Are you receiving or seeking treatment?</div>
                        <div className="im-yn-hint">Doctor, physio, chiro, therapy, etc.</div>
                      </div>
                      <div style={{display:'flex',gap:'0.5rem',flexShrink:0}}>
                        {['Yes','No','Not yet'].map(v => <Pill key={v} value={v} current={treatment} onSelect={setTreatment} />)}
                      </div>
                    </div>
                    <div className="im-yn-row">
                      <div style={{flex:1}}>
                        <div className="im-yn-q">Are you still experiencing symptoms?</div>
                        <div className="im-yn-hint">Pain, mobility issues, mental health, etc.</div>
                      </div>
                      <div style={{display:'flex',gap:'0.5rem',flexShrink:0}}>
                        {['Yes','No','Not sure'].map(v => <Pill key={v} value={v} current={ongoingSymptoms} onSelect={setOngoingSymptoms} />)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brief description */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.375rem'}}>
                  <span className="im-label">
                    Briefly tell us what happened{' '}
                    <span className="im-label-hint">(optional — a few sentences is enough)</span>
                  </span>
                  <textarea
                    className="im-textarea"
                    rows={4}
                    maxLength={400}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Where did it happen, what occurred, and what are you dealing with now? No documents or policy numbers needed."
                  />
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontSize:'0.75rem',color:'#75777f'}}>Do not include insurance policy numbers, health card numbers, or banking details.</span>
                    <span style={{fontSize:'0.72rem',color:description.length >= 380 ? '#ba1a1a' : '#75777f',flexShrink:0,marginLeft:'0.5rem'}}>{description.length}/400</span>
                  </div>
                </div>

                {/* Trust row */}
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem'}}>
                  {['Free','Confidential','No obligation','No document uploads needed'].map(t => (
                    <span key={t} className="im-trust"><span className="im-trust-dot"></span>{t}</span>
                  ))}
                </div>

                <hr className="im-divider" />
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <button type="button" className="im-btn-back" onClick={() => goTo(1)}>
                    <span className="material-symbols-outlined" style={{fontSize:'1.25rem'}}>arrow_back</span> Back
                  </button>
                  <button type="button" className="im-btn-primary" onClick={goStep2to3}>
                    Continue <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 0"}}>arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* ════════ STEP 3 — Contact ════════ */}
            {step === 3 && (
              <div key={fadeKey} className="im-card im-step-fade" style={{display:'flex',flexDirection:'column',gap:'1.75rem'}}>

                <div className="im-info-box">
                  <strong style={{display:'block',marginBottom:'0.25rem'}}>Almost done.</strong>
                  We only contact you if your situation fits our review criteria. We&apos;ll use the details below to reach out — once, calmly, to explain what may apply.
                </div>

                {/* Name */}
                <div className="im-contact-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem 1.25rem'}}>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.25rem'}}>
                    <span className="im-label">First name <span style={{color:'#ba1a1a'}}>*</span></span>
                    <input type="text" className={`im-input${fieldErrors.firstName ? ' error' : ''}`} placeholder="First name" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    {fieldErrors.firstName && <span className="im-err">Please enter your first name.</span>}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.25rem'}}>
                    <span className="im-label">Last name <span style={{color:'#ba1a1a'}}>*</span></span>
                    <input type="text" className={`im-input${fieldErrors.lastName ? ' error' : ''}`} placeholder="Last name" autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} />
                    {fieldErrors.lastName && <span className="im-err">Please enter your last name.</span>}
                  </div>
                </div>

                {/* Phone */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.25rem'}}>
                  <span className="im-label">Phone number <span style={{color:'#ba1a1a'}}>*</span></span>
                  <input type="tel" className={`im-input${fieldErrors.phone ? ' error' : ''}`} placeholder="e.g. 416-555-0100" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{maxWidth:'18rem'}} />
                  {fieldErrors.phone && <span className="im-err">Please enter a phone number.</span>}
                  <span style={{fontSize:'0.75rem',color:'#75777f'}}>We&apos;ll only call if your situation fits — and we respect your preferred time below.</span>
                </div>

                {/* Email */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.25rem'}}>
                  <span className="im-label">Email address <span style={{color:'#ba1a1a'}}>*</span></span>
                  <input type="email" className={`im-input${fieldErrors.email ? ' error' : ''}`} placeholder="you@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} style={{maxWidth:'22rem'}} />
                  {fieldErrors.email && <span className="im-err">Please enter a valid email address.</span>}
                  <span style={{fontSize:'0.75rem',color:'#75777f'}}>Used to send a confirmation and any follow-up. We don&apos;t share your email.</span>
                </div>

                {/* Best time */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.375rem',maxWidth:'18rem'}}>
                  <span className="im-label">
                    Best time to reach you{' '}
                    <span className="im-label-hint">(optional)</span>
                  </span>
                  <select className="im-select" value={bestTime} onChange={e => setBestTime(e.target.value)}>
                    <option value="">Select a time</option>
                    <option>Morning (8am – 12pm)</option>
                    <option>Afternoon (12pm – 5pm)</option>
                    <option>Evening (5pm – 8pm)</option>
                    <option>Anytime</option>
                  </select>
                </div>

                {submitError && (
                  <div className="im-alert-box">
                    <span className="material-symbols-outlined" style={{fontSize:'1rem',flexShrink:0,marginTop:'0.1rem'}}>error</span>
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Trust row */}
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem'}}>
                  {['Free','Confidential','No insurance info required'].map(t => (
                    <span key={t} className="im-trust"><span className="im-trust-dot"></span>{t}</span>
                  ))}
                </div>

                <hr className="im-divider" />
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <button type="button" className="im-btn-back" onClick={() => goTo(2)}>
                    <span className="material-symbols-outlined" style={{fontSize:'1.25rem'}}>arrow_back</span> Back
                  </button>
                  <button type="button" className="im-btn-primary" disabled={submitting} onClick={submitForm}>
                    {submitting ? (
                      <><span className="material-symbols-outlined" style={{animation:'spin 1s linear infinite',fontSize:'1rem'}}>progress_activity</span>Submitting…</>
                    ) : (
                      <>Submit My Review <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1",fontSize:'1rem'}}>send</span></>
                    )}
                  </button>
                </div>

                {/* Final micro-disclaimers */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.35rem',paddingTop:'0.25rem'}}>
                  {[
                    'Submitting this form does not start a legal case.',
                    'No lawyer-client relationship is created.',
                    'Do not include insurance policy numbers, health card numbers, or banking details.',
                  ].map(text => (
                    <p key={text} style={{fontSize:'0.75rem',color:'#44474f',display:'flex',alignItems:'flex-start',gap:'0.35rem',margin:0,lineHeight:1.5}}>
                      <span className="material-symbols-outlined" style={{fontSize:'0.875rem',flexShrink:0,marginTop:'0.1rem',color:'#735c00',fontVariationSettings:"'FILL' 1"}}>check_circle</span>
                      {text}
                    </p>
                  ))}
                </div>

              </div>
            )}

            {/* Trust bar */}
            <div style={{background:'#e8eaec',borderRadius:'0.75rem',padding:'1.125rem 1.5rem',display:'flex',flexWrap:'wrap',justifyContent:'space-around',gap:'1rem'}}>
              {[
                { icon:'verified_user',  text:'Licensed Ontario Reviewers' },
                { icon:'lock',           text:'Encrypted & Confidential' },
                { icon:'attach_money',   text:'Free · No Obligation' },
                { icon:'timer',          text:'About 2 Minutes' },
              ].map(item => (
                <div key={item.text} style={{display:'flex',alignItems:'center',gap:'0.4rem',fontSize:'0.75rem',fontWeight:700,color:'#44474f',fontFamily:"'Open Sans',sans-serif",opacity:0.7}}>
                  <span className="material-symbols-outlined" style={{fontSize:'0.875rem',fontVariationSettings:"'FILL' 1"}}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

          </div>
        </main>

        {/* ── Footer ── */}
        <footer style={{background:'#f0f1f3',borderTop:'1px solid rgba(197,198,208,0.2)'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'2rem 1.5rem',maxWidth:'52rem',margin:'0 auto',gap:'0.75rem',textAlign:'center'}}>
            <p style={{fontSize:'0.75rem',color:'#44474f',lineHeight:1.6,maxWidth:'36rem',margin:0}}>
              Ontario Accident Review is not a law firm and does not provide legal advice or legal representation. Submitting this form does not start a legal case or create any commitment.
            </p>
            <div style={{display:'flex',gap:'1.25rem',fontSize:'0.75rem',fontWeight:500}}>
              <a href="/privacy"           style={{color:'#44474f',textDecoration:'underline'}}>Privacy Policy</a>
              <a href="/terms-of-service"  style={{color:'#44474f',textDecoration:'underline'}}>Terms of Service</a>
              <a href="/disclaimer"        style={{color:'#44474f',textDecoration:'underline'}}>Legal Disclaimer</a>
            </div>
            <div style={{fontSize:'0.75rem',color:'#75777f'}}>&copy; 2026 Ontario Accident Review. All rights reserved.</div>
          </div>
        </footer>

      </div>
    </>
  );
}
