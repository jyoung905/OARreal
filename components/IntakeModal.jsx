'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ACCIDENT_TYPES = [
  { id: 'motor-vehicle', label: 'Motor Vehicle Accident' },
  { id: 'slip-fall', label: 'Slip & Fall' },
  { id: 'workplace', label: 'Workplace Injury' },
  { id: 'other', label: 'Other Accident' },
];

const IMPACT_OPTIONS = [
  'Missed work or income',
  'Unable to do daily activities',
  'Required medical treatment',
  'Emotional / psychological impact',
  'Needed help from family or friends',
  'Had to cancel plans or trips',
];

const SYMPTOM_OPTIONS = [
  'Back / neck pain',
  'Headaches',
  'Anxiety or PTSD',
  'Concussion symptoms',
  'Broken bones or fractures',
  'Soft tissue injuries',
  'Sleep problems',
  'Other symptoms',
];

const INTENT_OPTIONS = [
  { id: 'understand-rights', label: 'Understand my rights', description: 'Find out what benefits and compensation I may be entitled to' },
  { id: 'check-claim', label: 'Check if I have a claim', description: 'Get an expert opinion on whether my situation qualifies' },
  { id: 'insurance-help', label: 'Help dealing with insurance', description: 'Navigate the insurance process and avoid common mistakes' },
  { id: 'connect-lawyer', label: 'Connect with a lawyer', description: 'Speak with a licensed Ontario legal professional' },
];

export function IntakeModal({ isOpen, onClose }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Step 1
  const [accidentType, setAccidentType] = useState('');
  const [ontarioAccident, setOntarioAccident] = useState('');
  const [accidentDate, setAccidentDate] = useState('');

  // Step 2
  const [impacts, setImpacts] = useState([]);
  const [symptoms, setSymptoms] = useState([]);

  // Step 3
  const [intent, setIntent] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Step 4
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bestTime, setBestTime] = useState('');

  const pushEvent = (eventName, params = {}) => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...params });
    }
  };

  const toggleMulti = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!accidentType) errs.accidentType = 'Please select an accident type';
      if (!ontarioAccident) errs.ontarioAccident = 'Please answer this question';
      if (!accidentDate) errs.accidentDate = 'Please enter the approximate date';
    }
    if (step === 2) {
      if (impacts.length === 0) errs.impacts = 'Please select at least one impact';
    }
    if (step === 3) {
      if (!intent) errs.intent = 'Please select an option';
    }
    if (step === 4) {
      if (!firstName.trim()) errs.firstName = 'Required';
      if (!lastName.trim()) errs.lastName = 'Required';
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email required';
      if (!phone.trim()) errs.phone = 'Required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    pushEvent(`step${step}_complete`, { accident_type: accidentType });
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setIsSubmitting(true);
    pushEvent('form_submit', { accident_type: accidentType, intent });

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accidentType,
          ontarioAccident,
          accidentDate,
          impacts,
          symptoms,
          intent,
          additionalInfo,
          firstName,
          lastName,
          email,
          phone,
          bestTime,
        }),
      });
      if (res.ok) {
        router.push('/thank-you');
      } else {
        setErrors({ submit: 'Something went wrong. Please try again.' });
        setIsSubmitting(false);
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    pushEvent('form_abandon', { step, accident_type: accidentType });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        {/* Progress header */}
        <div className="modal-header">
          <div className="modal-progress-track">
            <div className="modal-progress-bar" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
          <div className="modal-header-row">
            <span className="modal-step-label">Step {step} of 4</span>
            <button className="modal-close" onClick={handleClose} aria-label="Close">&#x2715;</button>
          </div>
          <p className="modal-trust-line">Free &middot; Private &middot; No obligation</p>
        </div>

        {/* ââ Step 1: Qualification ââ */}
        {step === 1 && (
          <div className="modal-body">
            <h2 className="modal-title">Tell us about your accident</h2>
            <p className="modal-sub">We&apos;ll use this to match you with the right review.</p>

            <p className="modal-label">What type of accident was it?</p>
            <div className="modal-option-grid">
              {ACCIDENT_TYPES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={`modal-option-card${accidentType === t.id ? ' selected' : ''}`}
                  onClick={() => setAccidentType(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {errors.accidentType && <p className="modal-error">{errors.accidentType}</p>}

            <p className="modal-label">Did this accident happen in Ontario?</p>
            <div className="modal-pill-row">
              {['Yes', 'No'].map(v => (
                <button
                  key={v}
                  type="button"
                  className={`modal-pill${ontarioAccident === v ? ' selected' : ''}`}
                  onClick={() => setOntarioAccident(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            {ontarioAccident === 'No' && (
              <p className="modal-warning">Our review service is currently for Ontario accidents only. You&apos;re welcome to submit and we&apos;ll do our best to point you in the right direction.</p>
            )}
            {errors.ontarioAccident && <p className="modal-error">{errors.ontarioAccident}</p>}

            <p className="modal-label">Approximate date of accident</p>
            <input
              type="date"
              className={`modal-input${errors.accidentDate ? ' error' : ''}`}
              value={accidentDate}
              onChange={e => setAccidentDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.accidentDate && <p className="modal-error">{errors.accidentDate}</p>}

            <button type="button" className="modal-btn-primary" onClick={nextStep}>
              Continue &#8594;
            </button>
          </div>
        )}

        {/* ââ Step 2: Impact ââ */}
        {step === 2 && (
          <div className="modal-body">
            <h2 className="modal-title">How did the accident affect you?</h2>
            <p className="modal-sub">Select all that apply â this helps us understand the full picture.</p>

            <p className="modal-label">Impact on your life</p>
            <div className="modal-chip-group">
              {IMPACT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`modal-chip${impacts.includes(opt) ? ' selected' : ''}`}
                  onClick={() => toggleMulti(impacts, setImpacts, opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {errors.impacts && <p className="modal-error">{errors.impacts}</p>}

            <p className="modal-label">Any symptoms or injuries? <span className="modal-optional">(optional)</span></p>
            <div className="modal-chip-group">
              {SYMPTOM_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`modal-chip${symptoms.includes(opt) ? ' selected' : ''}`}
                  onClick={() => toggleMulti(symptoms, setSymptoms, opt)}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="modal-nav">
              <button type="button" className="modal-btn-back" onClick={() => setStep(1)}>&#8592; Back</button>
              <button type="button" className="modal-btn-primary" onClick={nextStep}>Continue &#8594;</button>
            </div>
          </div>
        )}

        {/* ââ Step 3: Intent ââ */}
        {step === 3 && (
          <div className="modal-body">
            <h2 className="modal-title">What kind of help are you looking for?</h2>
            <p className="modal-sub">Choose the option that best describes your situation.</p>

            <div className="modal-intent-grid">
              {INTENT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`modal-intent-card${intent === opt.id ? ' selected' : ''}`}
                  onClick={() => setIntent(opt.id)}
                >
                  <strong className="modal-intent-title">{opt.label}</strong>
                  <span className="modal-intent-desc">{opt.description}</span>
                </button>
              ))}
            </div>
            {errors.intent && <p className="modal-error">{errors.intent}</p>}

            <p className="modal-label">Anything else you&apos;d like us to know? <span className="modal-optional">(optional)</span></p>
            <textarea
              className="modal-textarea"
              placeholder="Brief details about your situation..."
              value={additionalInfo}
              onChange={e => setAdditionalInfo(e.target.value.slice(0, 400))}
              rows={3}
            />
            <p className="modal-char-count">{additionalInfo.length}/400</p>

            <div className="modal-nav">
              <button type="button" className="modal-btn-back" onClick={() => setStep(2)}>&#8592; Back</button>
              <button type="button" className="modal-btn-primary" onClick={nextStep}>Continue &#8594;</button>
            </div>
          </div>
        )}

        {/* ââ Step 4: Contact ââ */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="modal-body">
            <h2 className="modal-title">Almost done â where should we send your review?</h2>
            <p className="modal-sub">A licensed Ontario professional will personally review your situation. No spam, no sales calls â just answers.</p>

            <div className="modal-row-2col">
              <div className="modal-field">
                <label className="modal-label">First name</label>
                <input
                  type="text"
                  className={`modal-input${errors.firstName ? ' error' : ''}`}
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
                {errors.firstName && <p className="modal-error">{errors.firstName}</p>}
              </div>
              <div className="modal-field">
                <label className="modal-label">Last name</label>
                <input
                  type="text"
                  className={`modal-input${errors.lastName ? ' error' : ''}`}
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
                {errors.lastName && <p className="modal-error">{errors.lastName}</p>}
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label">Email address</label>
              <input
                type="email"
                className={`modal-input${errors.email ? ' error' : ''}`}
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
              {errors.email && <p className="modal-error">{errors.email}</p>}
            </div>

            <div className="modal-field">
              <label className="modal-label">Phone number</label>
              <input
                type="tel"
                className={`modal-input${errors.phone ? ' error' : ''}`}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                autoComplete="tel"
              />
              {errors.phone && <p className="modal-error">{errors.phone}</p>}
            </div>

            <div className="modal-field">
              <label className="modal-label">Best time to reach you <span className="modal-optional">(optional)</span></label>
              <select
                className="modal-input"
                value={bestTime}
                onChange={e => setBestTime(e.target.value)}
              >
                <option value="">No preference</option>
                <option value="morning">Morning (9amâ12pm)</option>
                <option value="afternoon">Afternoon (12pmâ5pm)</option>
                <option value="evening">Evening (5pmâ8pm)</option>
              </select>
            </div>

            {errors.submit && <p className="modal-error modal-error-global">{errors.submit}</p>}

            <p className="modal-privacy-note">&#128274; Your information is private and protected. We never share or sell your data.</p>

            <div className="modal-nav">
              <button type="button" className="modal-btn-back" onClick={() => setStep(3)}>&#8592; Back</button>
              <button type="submit" className="modal-btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting\u2026' : 'Get My Free Review \u2192'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
