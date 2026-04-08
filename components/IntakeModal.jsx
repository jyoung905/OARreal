'use client';

import { useState, useEffect } from 'react';

/* ── Step metadata ── */
const META = [
  null,
  { label: 'Step 1 of 4 · Basics', title: 'Start Your Free Accident Review', pct: '25%', w: '25%' },
  { label: 'Step 2 of 4 · Impact', title: 'Tell us how this has affected you', pct: '50%', w: '50%' },
  { label: 'Step 3 of 4 · Context', title: 'What do you want help understanding?', pct: '75%', w: '75%' },
  { label: 'Step 4 of 4 · Contact', title: 'Where should we send your review?', pct: '100%', w: '100%' },
];

const ACCIDENT_TYPES = [
  { val: 'Car accident', icon: 'directions_car', label: 'Car accident' },
  { val: 'Slip and fall', icon: 'person_raised_hand', label: 'Slip and fall' },
  { val: 'Pedestrian accident', icon: 'directions_walk', label: 'Pedestrian accident' },
  { val: 'Bicycle accident', icon: 'pedal_bike', label: 'Bicycle accident' },
  { val: 'Motorcycle accident', icon: 'two_wheeler', label: 'Motorcycle accident' },
  { val: 'Other', icon: 'more_horiz', label: 'Other' },
];

const SYMPTOM_OPTIONS = ['Pain', 'Stress / anxiety', 'Mobility issues', 'Unable to work normally', 'Ongoing treatment'];

const INTENT_OPTIONS = [
  'Whether I may qualify for compensation',
  'Whether insurance is treating me fairly',
  'What my next steps are',
  'Whether it’s worth speaking to a legal professional',
  'Understanding the deadlines that apply',
  'What benefits I may be entitled to',
];

export function IntakeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [fadeKey, setFadeKey] = useState(0);

  /* Form state */
  const [accidentType, setAccidentType] = useState('');
  const [ontario, setOntario] = useState('');
  const [accidentDate, setAccidentDate] = useState('');
  const [injured, setInjured] = useState('');
  const [missedWork, setMissedWork] = useState('');
  const [treatment, setTreatment] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [intents, setIntents] = useState([]);
  const [description, setDescription] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const goTo = (n) => {
    setStep(n);
    setFadeKey(k => k + 1);
  };

  const handleClose = () => {
    setIsOpen(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  const toggleSymptom = (s) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  /* Step validators */
  const goStep1to2 = () => { pushEvent('step1_complete'); goTo(2); };
  const goStep2to3 = () => { pushEvent('step2_complete'); goTo(3); };
  const goStep3to4 = () => { pushEvent('step3_complete'); goTo(4); };

  /* Submit */
  const submitForm = async () => {
    const errs = {};
    if (!firstName.trim()) errs.firstName = true;
    if (!lastName.trim()) errs.lastName = true;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = true;
    if (!phone.trim()) errs.phone = true;
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      fullName: (firstName + ' ' + lastName).trim(),
      email,
      phone,
      bestTime: bestTime || 'Not specified',
      contactMethod: 'Either',
      accidentType: accidentType || 'Not specified',
      accidentDate: accidentDate || 'Not specified',
      inOntario: ontario || 'Not specified',
      injured: injured || 'Not specified',
      medicalAttention: treatment || 'Not specified',
      workImpact: missedWork || 'Not specified',
      ongoingSymptoms: symptoms.length > 0 ? symptoms.join(', ') : 'None selected',
      spokenWithLawyer: 'Not specified',
      currentlyRepresented: 'No',
      thirdPartyInvolved: 'Not specified',
      accidentSummary: description || '',
      additionalNotes: intents.length > 0 ? intents.join(', ') : '',
      cityArea: 'Ontario',
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/'
    };

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok && data.success !== false) {
        pushEvent('form_submit', { accident_type: accidentType, intent: intents.join(', ') });
        window.location.href = '/thank-you';
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      setSubmitting(false);
      setSubmitError('Something went wrong. Please try again, or contact us directly.');
    }
  };

  if (!isOpen) return null;

  const m = META[step];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .im-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#f8f9fb;overflow-y:auto;font-family:'Open Sans',system-ui,sans-serif;color:#191c1e}
        .im-headline{font-family:Raleway,system-ui,sans-serif}
        .im-label{font-family:'Open Sans',sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#44474f;margin-bottom:0.2rem}
        .im-glass{background:rgba(248,249,251,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(197,198,208,0.1)}
        .im-card{background:#ffffff;border-radius:0.75rem;padding:1.5rem 2.5rem;box-shadow:0 20px 40px rgba(0,2,10,0.06)}
        .im-prog-track{height:6px;width:100%;background:#edeef0;border-radius:3px;overflow:hidden}
        .im-prog-bar{height:100%;border-radius:3px;transition:width 0.5s;background:linear-gradient(90deg,#735c00,#cba72f)}
        .im-step-fade{animation:imFadeSlide 0.25s ease both}
        @keyframes imFadeSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

        .im-acc-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;padding:1rem 0.75rem;border-radius:0.5rem;border:2px solid #c5c6d0;background:#f3f4f6;font-family:'Open Sans',sans-serif;font-size:0.82rem;font-weight:600;color:#44474f;cursor:pointer;transition:all 0.15s;text-align:center;line-height:1.3;min-height:80px}
        .im-acc-btn:hover{background:#fff;border-color:#001b44;color:#001b44}
        .im-acc-btn.selected{background:#fff;border-color:#735c00;color:#001b44}
        .im-acc-btn.selected .im-acc-icon{color:#735c00}
        .im-acc-icon{font-size:1.5rem;color:#75777f;transition:color 0.15s}

        .im-pill{padding:0.45rem 1.1rem;border-radius:999px;font-size:0.82rem;font-weight:600;font-family:'Open Sans',sans-serif;border:1.5px solid #c5c6d0;background:#fff;color:#44474f;cursor:pointer;transition:all 0.15s;white-space:nowrap}
        .im-pill:hover{border-color:#735c00;color:#001b44}
        .im-pill.selected{background:#001b44;border-color:#001b44;color:#fff}

        .im-chip{padding:0.45rem 1rem;border-radius:999px;font-size:0.8rem;font-weight:600;font-family:'Open Sans',sans-serif;border:1.5px solid #c5c6d0;background:#fff;color:#44474f;cursor:pointer;transition:all 0.15s;white-space:nowrap;display:inline-flex;align-items:center;gap:0.3rem;min-width:0}
        .im-chip:hover{border-color:#735c00;color:#001b44}
        .im-chip.selected{background:#001b44;border-color:#001b44;color:#fff}

        .im-intent{display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1rem;border-radius:0.5rem;border:2px solid #c5c6d0;background:#f3f4f6;cursor:pointer;transition:all 0.15s;text-align:left;width:100%;font-family:'Open Sans',sans-serif}
        .im-intent:hover{background:#fff;border-color:#001b44}
        .im-intent.selected{background:#fff;border-color:#735c00}
        .im-intent.selected .im-intent-dot{background:#735c00}
        .im-intent-dot{width:10px;height:10px;border-radius:50%;background:#c5c6d0;flex-shrink:0;transition:background 0.15s}

        .im-input{width:100%;background:transparent;border:0;border-bottom:2px solid #c5c6d0;padding:0.4rem 0 0.75rem;font-weight:500;color:#191c1e;font-size:0.95rem;outline:none;font-family:'Open Sans',sans-serif}
        .im-input:focus{border-bottom-color:#735c00}
        .im-input.error{border-bottom-color:#ba1a1a}
        .im-input::placeholder{color:#75777f}

        .im-textarea{width:100%;background:#f3f4f6;border:0;border-bottom:2px solid #c5c6d0;padding:0.5rem 1rem 0.75rem;font-weight:500;color:#191c1e;font-size:0.875rem;outline:none;font-family:'Open Sans',sans-serif;border-top-left-radius:0.5rem;border-top-right-radius:0.5rem;resize:none}
        .im-textarea:focus{border-bottom-color:#735c00}
        .im-textarea::placeholder{color:#75777f}

        .im-btn-primary{background:linear-gradient(135deg,#001b44,#003180);color:#fff;padding:1rem 2rem;border-radius:0.375rem;font-weight:700;letter-spacing:0.04em;box-shadow:0 10px 25px rgba(0,27,68,0.25);display:inline-flex;align-items:center;gap:0.75rem;font-family:'Open Sans',sans-serif;font-size:0.875rem;cursor:pointer;border:none;transition:all 0.15s}
        .im-btn-primary:hover{box-shadow:0 14px 30px rgba(0,27,68,0.35)}
        .im-btn-primary:active{transform:scale(0.95)}
        .im-btn-primary:disabled{opacity:0.7;cursor:not-allowed}

        .im-btn-back{display:flex;align-items:center;gap:0.5rem;color:#44474f;font-weight:600;font-family:'Open Sans',sans-serif;font-size:0.875rem;cursor:pointer;background:none;border:none;padding:0.5rem 0;transition:color 0.15s}
        .im-btn-back:hover{color:#001b44}

        .im-trust{display:inline-flex;align-items:center;gap:0.3rem;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#44474f;font-family:'Open Sans',sans-serif}
        .im-trust-dot{width:5px;height:5px;border-radius:50%;background:#cba72f;flex-shrink:0}

        .im-err{color:#ba1a1a;font-size:0.75rem;font-weight:600;margin-top:0.25rem}

        .im-select{width:100%;background:#f3f4f6;border:0;border-bottom:2px solid #c5c6d0;padding:0.75rem 0;font-weight:500;color:#191c1e;font-size:0.95rem;outline:none;font-family:'Open Sans',sans-serif}
        .im-select:focus{border-bottom-color:#735c00}

        .im-yn-row{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 1.25rem}
        .im-yn-q{font-size:0.875rem;font-weight:600;color:#001b44;line-height:1.4}

        .material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24}
      `}</style>

      <div className="im-overlay">
        {/* Header */}
        <header className="im-glass" style={{position:'sticky',top:0,zIndex:50}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.5rem',maxWidth:'80rem',margin:'0 auto'}}>
            <a href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 100" fill="none" height="38" style={{width:'auto'}}>
                <path d="M 72 64 A 28 28 0 1 1 48 22" stroke="#1a3060" strokeWidth="7" strokeLinecap="round" fill="none"/>
                <path d="M 48 22 A 28 28 0 0 1 72 64" stroke="#3a82c8" strokeWidth="7" strokeLinecap="round" fill="none"/>
                <line x1="48" y1="30" x2="48" y2="42" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round"/>
                <line x1="48" y1="42" x2="48" y2="58" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round"/>
                <polyline points="38,50 48,62 58,50" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <text x="92" y="44" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="25" fill="#1a3060">Ontario</text>
                <text x="92" y="74" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="25" fill="#1a3060">Accident Review</text>
              </svg>
            </a>
            <div style={{display:'flex',alignItems:'center',gap:'0.375rem',fontSize:'0.75rem',fontWeight:600,color:'#44474f'}}>
              <span className="material-symbols-outlined" style={{fontSize:'0.875rem',color:'#735c00'}}>lock</span>
              Secure &amp; Confidential
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'0.375rem',fontSize:'0.75rem',fontWeight:600,color:'#44474f'}}>
              <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#22c55e',display:'inline-block'}}></span>
              Free &middot; No Obligation
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{flexGrow:1,padding:'2rem 1rem',maxWidth:'80rem',margin:'0 auto',width:'100%'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:'2.5rem'}}>

            {/* LEFT: Form */}
            <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>

              {/* Progress header */}
              <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
                  <div>
                    <span className="im-label" style={{color:'#735c00'}}>{m.label}</span>
                    <h1 className="im-headline" style={{fontSize:'1.75rem',fontWeight:800,color:'#001b44',lineHeight:1.2,marginTop:'0.25rem'}}>{m.title}</h1>
                  </div>
                  <span style={{fontSize:'0.875rem',fontWeight:600,color:'#001b44',whiteSpace:'nowrap',marginLeft:'1rem'}}>{m.pct}</span>
                </div>
                <div className="im-prog-track">
                  <div className="im-prog-bar" style={{width:m.w}}></div>
                </div>
              </div>

              {/* Form card */}
              <div className="im-card">

                {/* STEP 1 */}
                {step === 1 && (
                  <div key={fadeKey} className="im-step-fade" style={{display:'flex',flexDirection:'column',gap:'2rem'}}>
                    <p style={{fontSize:'0.875rem',color:'#44474f',lineHeight:1.6}}>Tell us the basics so we can point you in the right direction.</p>

                    <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                      <span className="im-label">Type of accident</span>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'0.75rem'}}>
                        {ACCIDENT_TYPES.map(t => (
                          <button key={t.val} type="button" className={`im-acc-btn${accidentType === t.val ? ' selected' : ''}`} onClick={() => setAccidentType(t.val)}>
                            <span className="material-symbols-outlined im-acc-icon">{t.icon}</span>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                      <span className="im-label">Did this happen in Ontario?</span>
                      <div style={{display:'flex',gap:'0.75rem'}}>
                        {['Yes', 'No'].map(v => (
                          <button key={v} type="button" className={`im-pill${ontario === v ? ' selected' : ''}`} onClick={() => setOntario(v)}>{v}</button>
                        ))}
                      </div>
                      {ontario === 'No' && (
                        <div style={{background:'#fff8e1',border:'1px solid #cba72f',borderRadius:'0.5rem',padding:'0.875rem 1rem',fontSize:'0.82rem',color:'#735c00',lineHeight:1.5}}>
                          <strong>Heads up:</strong> We review Ontario accident situations only. If your accident occurred outside of Ontario, we may not be the right fit. You&apos;re still welcome to continue if you believe there may be an Ontario connection.
                        </div>
                      )}
                    </div>

                    <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                      <span className="im-label">Approximate date of accident</span>
                      <input type="date" className="im-input" style={{maxWidth:'16rem'}} value={accidentDate} onChange={e => setAccidentDate(e.target.value)} />
                    </div>

                    <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',paddingTop:'0.5rem'}}>
                      {['Free', 'Private', 'No obligation', 'Ontario only', 'No insurance details required'].map(t => (
                        <span key={t} className="im-trust"><span className="im-trust-dot"></span>{t}</span>
                      ))}
                    </div>

                    <div style={{paddingTop:'1.5rem',display:'flex',justifyContent:'flex-end',borderTop:'1px solid rgba(197,198,208,0.2)'}}>
                      <button type="button" className="im-btn-primary" onClick={goStep1to2}>
                        Continue <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div key={fadeKey} className="im-step-fade" style={{display:'flex',flexDirection:'column',gap:'2rem'}}>
                    <p style={{fontSize:'0.875rem',color:'#44474f',lineHeight:1.6}}>We only ask what&apos;s needed for an initial review.</p>

                    <div style={{background:'#f3f4f6',borderRadius:'0.75rem',overflow:'hidden'}}>
                      <div className="im-yn-row" style={{borderBottom:'1px solid rgba(197,198,208,0.25)'}}>
                        <span className="im-yn-q">Were you injured?</span>
                        <div style={{display:'flex',gap:'0.5rem',flexShrink:0}}>
                          {['Yes', 'No', 'Not sure'].map(v => (
                            <button key={v} type="button" className={`im-pill${injured === v ? ' selected' : ''}`} onClick={() => setInjured(v)}>{v}</button>
                          ))}
                        </div>
                      </div>
                      <div className="im-yn-row" style={{borderBottom:'1px solid rgba(197,198,208,0.25)'}}>
                        <span className="im-yn-q">Did you miss work?</span>
                        <div style={{display:'flex',gap:'0.5rem',flexShrink:0}}>
                          {['Yes', 'No', 'Not sure'].map(v => (
                            <button key={v} type="button" className={`im-pill${missedWork === v ? ' selected' : ''}`} onClick={() => setMissedWork(v)}>{v}</button>
                          ))}
                        </div>
                      </div>
                      <div className="im-yn-row">
                        <span className="im-yn-q">Are you receiving treatment?</span>
                        <div style={{display:'flex',gap:'0.5rem',flexShrink:0}}>
                          {['Yes', 'No', 'Not yet'].map(v => (
                            <button key={v} type="button" className={`im-pill${treatment === v ? ' selected' : ''}`} onClick={() => setTreatment(v)}>{v}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                      <span className="im-label">Any of these apply? <span style={{fontWeight:400,textTransform:'none',letterSpacing:'normal'}}>(select all that fit)</span></span>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
                        {SYMPTOM_OPTIONS.map(s => (
                          <button key={s} type="button" className={`im-chip${symptoms.includes(s) ? ' selected' : ''}`} onClick={() => toggleSymptom(s)} style={{justifyContent:'flex-start',borderRadius:'0.5rem',padding:'0.6rem 0.75rem',whiteSpace:'normal',textAlign:'left',lineHeight:1.3}}>
                            {symptoms.includes(s) && <span className="material-symbols-outlined" style={{fontSize:'0.9rem',fontVariationSettings:"'FILL' 1",flexShrink:0,marginRight:'0.25rem'}}>check</span>}
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',paddingTop:'0.5rem'}}>
                      {['Free', 'Private', 'No obligation', 'No document uploads at this stage'].map(t => (
                        <span key={t} className="im-trust"><span className="im-trust-dot"></span>{t}</span>
                      ))}
                    </div>

                    <div style={{paddingTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid rgba(197,198,208,0.2)'}}>
                      <button type="button" className="im-btn-back" onClick={() => goTo(1)}>
                        <span className="material-symbols-outlined" style={{fontSize:'1.25rem'}}>arrow_back</span> Back
                      </button>
                      <button type="button" className="im-btn-primary" onClick={goStep2to3}>
                        Continue <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div key={fadeKey} className="im-step-fade" style={{display:'flex',flexDirection:'column',gap:'2rem'}}>
                    <p style={{fontSize:'0.875rem',color:'#44474f',lineHeight:1.6}}>Choose what best fits your situation.</p>

                    <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                      <span className="im-label">What do you want help understanding? <span style={{fontWeight:400,textTransform:'none',letterSpacing:'normal'}}>(select all that apply)</span></span>
                      <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
                        {INTENT_OPTIONS.map(opt => (
                          <button key={opt} type="button" className={`im-intent${intents.includes(opt) ? ' selected' : ''}`} onClick={() => setIntents(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])}>
                            <span className="im-intent-dot" style={intents.includes(opt) ? {background:'#735c00'} : {}}></span>
                            <span style={{fontSize:'0.875rem',fontWeight:600,color:'#001b44',flex:1,textAlign:'left'}}>{opt}</span>
                            {intents.includes(opt) && <span className="material-symbols-outlined" style={{fontSize:'1rem',color:'#735c00',flexShrink:0,fontVariationSettings:"'FILL' 1"}}>check_circle</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                        <span className="im-label">Briefly tell us what happened <span style={{fontWeight:400,textTransform:'none',letterSpacing:'normal'}}>(optional)</span></span>
                        <span style={{fontSize:'0.72rem',color:description.length >= 380 ? '#ba1a1a' : '#75777f'}}>{description.length} / 400</span>
                      </div>
                      <textarea className="im-textarea" rows={4} maxLength={400} value={description} onChange={e => setDescription(e.target.value)} placeholder="A few sentences is enough. No sensitive details needed at this stage." />
                      <p style={{fontSize:'0.75rem',color:'#44474f'}}>Do not include insurance policy numbers, health card numbers, or other sensitive personal information.</p>
                    </div>

                    <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',paddingTop:'0.5rem'}}>
                      {['Free', 'Private', 'No obligation', 'Ontario only'].map(t => (
                        <span key={t} className="im-trust"><span className="im-trust-dot"></span>{t}</span>
                      ))}
                    </div>

                    <div style={{paddingTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid rgba(197,198,208,0.2)'}}>
                      <button type="button" className="im-btn-back" onClick={() => goTo(2)}>
                        <span className="material-symbols-outlined" style={{fontSize:'1.25rem'}}>arrow_back</span> Back
                      </button>
                      <button type="button" className="im-btn-primary" onClick={goStep3to4}>
                        Continue <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <div key={fadeKey} className="im-step-fade" style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
                    <div style={{background:'#f3f4f6',borderRadius:'0.75rem',padding:'0.875rem 1.25rem'}}>
                      <p style={{fontSize:'0.875rem',color:'#44474f',lineHeight:1.6,margin:0}}>A licensed Ontario legal professional reviews your situation. If it appears to fit our review criteria, a representative may contact you.</p>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                      <div style={{display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                        <span className="im-label">First name <span style={{color:'#ba1a1a'}}>*</span></span>
                        <input type="text" className={`im-input${fieldErrors.firstName ? ' error' : ''}`} placeholder="First name" autoComplete="given-name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        {fieldErrors.firstName && <p className="im-err">Please enter your first name.</p>}
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                        <span className="im-label">Last name <span style={{color:'#ba1a1a'}}>*</span></span>
                        <input type="text" className={`im-input${fieldErrors.lastName ? ' error' : ''}`} placeholder="Last name" autoComplete="family-name" value={lastName} onChange={e => setLastName(e.target.value)} />
                        {fieldErrors.lastName && <p className="im-err">Please enter your last name.</p>}
                      </div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                      <div style={{display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                        <span className="im-label">Email address <span style={{color:'#ba1a1a'}}>*</span></span>
                        <input type="email" className={`im-input${fieldErrors.email ? ' error' : ''}`} placeholder="you@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
                        {fieldErrors.email && <p className="im-err">Please enter a valid email.</p>}
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                        <span className="im-label">Phone number <span style={{color:'#ba1a1a'}}>*</span></span>
                        <input type="tel" className={`im-input${fieldErrors.phone ? ' error' : ''}`} placeholder="e.g. 416-555-0100" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                        {fieldErrors.phone && <p className="im-err">Please enter a phone number.</p>}
                      </div>
                    </div>

                    <div style={{display:'flex',flexDirection:'column',gap:'0.2rem',maxWidth:'16rem'}}>
                      <span className="im-label">Best time to reach you <span style={{fontWeight:400,textTransform:'none',letterSpacing:'normal'}}>(optional)</span></span>
                      <select className="im-select" value={bestTime} onChange={e => setBestTime(e.target.value)}>
                        <option value="">Select a time</option>
                        <option>Morning (8am – 12pm)</option>
                        <option>Afternoon (12pm – 5pm)</option>
                        <option>Evening (5pm – 8pm)</option>
                        <option>Anytime</option>
                      </select>
                    </div>

                    <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',paddingTop:'0.5rem'}}>
                      {['Free', 'Private', 'No insurance info required'].map(t => (
                        <span key={t} className="im-trust"><span className="im-trust-dot"></span>{t}</span>
                      ))}
                    </div>

                    {submitError && (
                      <div style={{background:'#ffdad6',color:'#ba1a1a',padding:'0.75rem 1rem',borderRadius:'0.5rem',fontSize:'0.875rem',display:'flex',alignItems:'flex-start',gap:'0.5rem'}}>
                        <span className="material-symbols-outlined" style={{fontSize:'1rem',flexShrink:0,marginTop:'0.125rem'}}>error</span>
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div style={{paddingTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid rgba(197,198,208,0.2)'}}>
                      <button type="button" className="im-btn-back" onClick={() => goTo(3)}>
                        <span className="material-symbols-outlined" style={{fontSize:'1.25rem'}}>arrow_back</span> Back
                      </button>
                      <button type="button" className="im-btn-primary" disabled={submitting} onClick={submitForm} style={{padding:'0.75rem 1.25rem',fontSize:'0.875rem',minHeight:'auto'}}>
                        {submitting ? (
                          <><span className="material-symbols-outlined" style={{animation:'spin 1s linear infinite',fontSize:'1rem'}}>progress_activity</span> Submitting&hellip;</>
                        ) : (
                          <>Submit My Review <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1",fontSize:'1rem'}}>send</span></>
                        )}
                      </button>
                    </div>

                    <div style={{display:'flex',flexDirection:'column',gap:'0.375rem',paddingTop:'0.5rem'}}>
                      {[
                        'No legal case is started by submitting this form.',
                        'No pressure, no commitment required.',
                        'Do not include insurance policy numbers, health card numbers, or banking details in this intake.',
                      ].map(text => (
                        <p key={text} style={{fontSize:'0.75rem',color:'#44474f',display:'flex',alignItems:'flex-start',gap:'0.375rem'}}>
                          <span className="material-symbols-outlined" style={{fontSize:'0.875rem',flexShrink:0,marginTop:'0.125rem',color:'#735c00',fontVariationSettings:"'FILL' 1"}}>check_circle</span>
                          {text}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Trust bar */}
              <div style={{background:'#e1e2e4',borderRadius:'0.75rem',padding:'1.25rem',display:'flex',flexWrap:'wrap',justifyContent:'space-around',gap:'1.5rem',opacity:0.6}}>
                {[
                  { icon: 'verified_user', text: 'Licensed Ontario Reviewers' },
                  { icon: 'lock', text: 'Encrypted & Confidential' },
                  { icon: 'attach_money', text: 'Free · No Obligation' },
                  { icon: 'timer', text: 'About 2 Minutes' },
                ].map(item => (
                  <div key={item.text} style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.75rem',fontWeight:700,color:'#44474f',fontFamily:'Open Sans',sans-serif}}>
                    <span className="material-symbols-outlined" style={{fontSize:'0.875rem'}}>{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer style={{width:'100%',marginTop:'auto',background:'#f3f4f6',borderTop:'1px solid rgba(197,198,208,0.15)'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'2.5rem 1.5rem',maxWidth:'80rem',margin:'0 auto',gap:'1rem',textAlign:'center'}}>
            <p style={{fontSize:'0.75rem',color:'#44474f',lineHeight:1.6,maxWidth:'36rem'}}>Ontario Accident Review is not a law firm and does not provide legal advice or legal representation. Submitting this form does not start a legal case. This intake tool is for assessment purposes only.</p>
            <div style={{display:'flex',gap:'1.25rem',fontSize:'0.75rem',fontWeight:500}}>
              <a href="/privacy" style={{color:'#44474f',textDecoration:'underline'}}>Privacy Policy</a>
              <a href="/terms-of-service" style={{color:'#44474f',textDecoration:'underline'}}>Terms of Service</a>
              <a href="/disclaimer" style={{color:'#44474f',textDecoration:'underline'}}>Legal Disclaimer</a>
            </div>
            <div style={{fontSize:'0.75rem',color:'#75777f'}}>&copy; 2026 Ontario Accident Review. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
