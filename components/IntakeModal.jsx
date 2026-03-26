'use client';
import { fireFormConversion } from '@/lib/gtag';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { formSteps } from '@/lib/site';

const initialData = {
  fullName: '',
  phone: '',
  email: '',
  bestTime: '',
  contactMethod: '',
  accidentType: '',
  accidentDate: '',
  cityArea: '',
  accidentSummary: '',
  injured: '',
  medicalAttention: '',
  workImpact: '',
  ongoingSymptoms: '',
  injuryDetails: '',
  spokenWithLawyer: '',
  currentlyRepresented: '',
  thirdPartyInvolved: '',
  additionalNotes: '',
  consentTruth: false,
  consentNotLawFirm: false,
  consentToContact: false
};

const requiredByStep = [
  ['fullName', 'phone', 'email', 'bestTime', 'contactMethod'],
  ['accidentType', 'accidentDate', 'cityArea', 'accidentSummary'],
  ['injured', 'medicalAttention', 'workImpact', 'ongoingSymptoms'],
  ['spokenWithLawyer', 'currentlyRepresented', 'thirdPartyInvolved'],
  ['consentTruth', 'consentNotLawFirm', 'consentToContact']
];

function getStepError(stepIndex, data) {
  for (const key of requiredByStep[stepIndex]) {
    const value = data[key];
    if (typeof value === 'boolean') {
      if (!value) return 'Please complete the required fields before continuing.';
    } else if (!String(value || '').trim()) {
      return 'Please complete the required fields before continuing.';
    }
  }
  if (stepIndex === 0 && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Please enter a valid email address.';
  }
  return '';
}

function updateField(setter, name, value) {
  setter((current) => ({ ...current, [name]: value }));
}

export function IntakeModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [submitState, setSubmitState] = useState({ status: 'idle', error: '' });

  const progress = useMemo(() => ((step + 1) / formSteps.length) * 100, [step]);
  const progressLabel = `Step ${step + 1} of ${formSteps.length} · ${formSteps[step]?.label || ''}`;

  // Intercept all a[href="#intake"] clicks anywhere on the page
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a[href="#intake"], button[data-open-intake]');
      if (link) {
        e.preventDefault();
        openModal();
        return;
      }
      // Intercept hash nav links so they scroll without adding hash to URL
      // (prevents "page starts in middle" on next visit when hash persists)
      const hashLink = e.target.closest('a[href^="#"]:not([href="#intake"])');
      if (hashLink) {
        const target = document.querySelector(hashLink.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Also open if the page loads with #intake hash
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#intake') {
      openModal();
    }
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const openModal = () => {
    setIsOpen(true);
    setStep(0);
    setData(initialData);
    setSubmitState({ status: 'idle', error: '' });
  };

  const closeModal = () => {
    setIsOpen(false);
    setStep(0);
    setData(initialData);
    setSubmitState({ status: 'idle', error: '' });
    // Clear hash without page jump
    if (typeof window !== 'undefined' && window.location.hash === '#intake') {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  const next = () => {
    const error = getStepError(step, data);
    if (error) { setSubmitState({ status: 'idle', error }); return; }
    setSubmitState({ status: 'idle', error: '' });
    setStep((s) => Math.min(s + 1, formSteps.length - 1));
  };

  const previous = () => {
    setSubmitState({ status: 'idle', error: '' });
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async (e) => {
    e.preventDefault();
    const error = getStepError(step, data);
    if (error) { setSubmitState({ status: 'idle', error }); return; }
    setSubmitState({ status: 'submitting', error: '' });
    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sourcePage: '/' })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Submission failed. Please try again.');
      closeModal();
      fireFormConversion();
      router.push('/thank-you');
    } catch (err) {
      setSubmitState({
        status: 'idle',
        error: err instanceof Error ? err.message : 'There was a problem submitting your inquiry.'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="intake-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Start your review"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div className="intake-modal-container">
        <button className="intake-modal-close" onClick={closeModal} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Modal header */}
        <div className="intake-modal-header">
          <p className="eyebrow">Start Your Review</p>
          <h2>Tell us the basics of your accident</h2>
          <p className="intake-modal-subhead">
            Keep it simple — we only ask for what's needed for an initial review and possible follow-up.
          </p>
        </div>

        {/* Progress bar */}
        <div className="progress-wrap progress-wrap-card">
          <div className="progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-label">{progressLabel}</div>
        </div>

        {/* Step nav pills */}
        <div className="intake-step-list modal-step-list" aria-hidden="true">
          {formSteps.map((item, index) => {
            const state = index === step ? 'is-active' : index < step ? 'is-complete' : '';
            return (
              <div key={item.id} className={`intake-step-pill ${state}`.trim()}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.label}</strong>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <form className="intake-form" onSubmit={submit}>

          {/* Step 1 — Contact */}
          <section className={`form-step ${step === 0 ? 'active' : ''}`}>
            <div className="step-heading step-heading-card">
              <span className="step-kicker">Step 1</span>
              <h3>Where should we reach you?</h3>
              <p className="step-copy">
                If your situation appears to fit our review criteria, a representative from Ontario Accident Review may contact you using the details you provide.
              </p>
            </div>
            <div className="field-grid">
              <Field label="Full name">
                <input required value={data.fullName} onChange={(e) => updateField(setData, 'fullName', e.target.value)} />
              </Field>
              <Field label="Phone number">
                <input required type="tel" value={data.phone} onChange={(e) => updateField(setData, 'phone', e.target.value)} />
              </Field>
              <Field label="Email address">
                <input required type="email" value={data.email} onChange={(e) => updateField(setData, 'email', e.target.value)} />
              </Field>
              <Field label="Best time to reach you">
                <select required value={data.bestTime} onChange={(e) => updateField(setData, 'bestTime', e.target.value)}>
                  <option value="">Select one</option>
                  <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Anytime</option>
                </select>
              </Field>
            </div>
            <RadioGroup
              label="Preferred contact method"
              name="contactMethod"
              value={data.contactMethod}
              onChange={(v) => updateField(setData, 'contactMethod', v)}
              options={['Phone', 'Email', 'Either']}
              compact
            />
          </section>

          {/* Step 2 — Accident basics */}
          <section className={`form-step ${step === 1 ? 'active' : ''}`}>
            <div className="step-heading step-heading-card">
              <span className="step-kicker">Step 2</span>
              <h3>Tell us the basics</h3>
              <p className="step-copy">A short summary is enough. We are just looking for the essentials needed for an initial review.</p>
            </div>
            <div className="field-grid">
              <Field label="What type of accident was it?">
                <select required value={data.accidentType} onChange={(e) => updateField(setData, 'accidentType', e.target.value)}>
                  <option value="">Select one</option>
                  <option>Car accident</option><option>Truck accident</option><option>Motorcycle accident</option>
                  <option>Pedestrian accident</option><option>Bicycle accident</option><option>Slip and fall</option><option>Other</option>
                </select>
              </Field>
              <Field label="Date of accident">
                <input required type="date" value={data.accidentDate} onChange={(e) => updateField(setData, 'accidentDate', e.target.value)} />
              </Field>
              <Field label="City or town in Ontario">
                <input required value={data.cityArea} placeholder="Toronto, Brampton, Mississauga, Hamilton, etc." onChange={(e) => updateField(setData, 'cityArea', e.target.value)} />
              </Field>
            </div>
            <Field label="Briefly describe what happened">
              <textarea required rows={5} placeholder="A short summary is enough. Tell us what happened and what problems you are dealing with now." value={data.accidentSummary} onChange={(e) => updateField(setData, 'accidentSummary', e.target.value)} />
            </Field>
          </section>

          {/* Step 3 — Impact */}
          <section className={`form-step ${step === 2 ? 'active' : ''}`}>
            <div className="step-heading step-heading-card">
              <span className="step-kicker">Step 3</span>
              <h3>How has this affected you?</h3>
              <p className="step-copy">These answers help us understand the impact of the accident without asking for sensitive documents or insurance details.</p>
            </div>
            <div className="field-grid">
              <RadioGroup compact label="Were you injured?" name="injured" value={data.injured} onChange={(v) => updateField(setData, 'injured', v)} options={['Yes', 'No', 'Not sure']} />
              <RadioGroup compact label="Did you receive medical attention?" name="medicalAttention" value={data.medicalAttention} onChange={(v) => updateField(setData, 'medicalAttention', v)} options={['Yes', 'No', 'Not yet']} />
              <RadioGroup compact label="Has the accident affected your work or daily life?" name="workImpact" value={data.workImpact} onChange={(v) => updateField(setData, 'workImpact', v)} options={['Yes', 'No', 'Not sure']} />
              <RadioGroup compact label="Are you still experiencing symptoms?" name="ongoingSymptoms" value={data.ongoingSymptoms} onChange={(v) => updateField(setData, 'ongoingSymptoms', v)} options={['Yes', 'No', 'Not sure']} />
            </div>
            <Field label="What injuries or symptoms did you experience?">
              <textarea rows={4} placeholder="You can keep this short." value={data.injuryDetails} onChange={(e) => updateField(setData, 'injuryDetails', e.target.value)} />
            </Field>
          </section>

          {/* Step 4 — Legal status */}
          <section className={`form-step ${step === 3 ? 'active' : ''}`}>
            <div className="step-heading step-heading-card">
              <span className="step-kicker">Step 4</span>
              <h3>A few final questions</h3>
              <p className="step-copy">We use these answers to understand whether the matter is still at the review stage.</p>
            </div>
            <div className="field-grid">
              <RadioGroup compact label="Have you already spoken with a lawyer about this accident?" name="spokenWithLawyer" value={data.spokenWithLawyer} onChange={(v) => updateField(setData, 'spokenWithLawyer', v)} options={['Yes', 'No']} />
              <RadioGroup compact label="Do you currently have a lawyer representing you for this matter?" name="currentlyRepresented" value={data.currentlyRepresented} onChange={(v) => updateField(setData, 'currentlyRepresented', v)} options={['Yes', 'No']} />
              <RadioGroup compact label="Was another person, driver, property owner, or business potentially involved?" name="thirdPartyInvolved" value={data.thirdPartyInvolved} onChange={(v) => updateField(setData, 'thirdPartyInvolved', v)} options={['Yes', 'No', 'Not sure']} />
            </div>
            <Field label="Is there anything else you want us to know?">
              <textarea rows={4} value={data.additionalNotes} onChange={(e) => updateField(setData, 'additionalNotes', e.target.value)} />
            </Field>
          </section>

          {/* Step 5 — Consent */}
          <section className={`form-step ${step === 4 ? 'active' : ''}`}>
            <div className="step-heading step-heading-card">
              <span className="step-kicker">Step 5</span>
              <h3>Review and submit</h3>
              <p className="step-copy">Submitting this form is only a request for an initial review.</p>
            </div>
            <Consent checked={data.consentTruth} onChange={(v) => updateField(setData, 'consentTruth', v)} label="I confirm the information I provided is true to the best of my knowledge." />
            <Consent checked={data.consentNotLawFirm} onChange={(v) => updateField(setData, 'consentNotLawFirm', v)} label="I understand Ontario Accident Review is not a law firm and does not provide legal advice or legal representation." />
            <label className="consent-row consent-block">
              <input type="checkbox" checked={data.consentToContact} onChange={(e) => updateField(setData, 'consentToContact', e.target.checked)} />
              <span>
                I consent to being contacted by Ontario Accident Review about my review request and I acknowledge the{' '}
                <Link href="/privacy" className="text-link">Privacy Policy</Link>.
              </span>
            </label>
            <p className="disclaimer">
              Submitting information through this site is only a request for an initial review and does not create a lawyer-client relationship.
            </p>
          </section>

          {submitState.error && (
            <p className="disclaimer form-error" role="alert">{submitState.error}</p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className={`button button-secondary ${step === 0 ? 'hidden' : ''}`}
              onClick={previous}
            >
              Back
            </button>
            {step < formSteps.length - 1 ? (
              <button type="button" className="button" onClick={next}>Continue</button>
            ) : (
              <button type="submit" className="button" disabled={submitState.status === 'submitting'}>
                {submitState.status === 'submitting' ? 'Submitting…' : 'Submit My Review'}
              </button>
            )}
          </div>
        </form>

        <p className="intake-modal-footer-note">
          Ontario Accident Review is not a law firm and does not provide legal advice or legal representation.
        </p>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function Field({ label, children }) {
  return (
    <div className="field-group">
      <label>{label}</label>
      {children}
    </div>
  );
}

function RadioGroup({ label, options, value, onChange, compact = false, name }) {
  return (
    <div className="field-group">
      <label>{label}</label>
      <div className={`option-list radio-list inline-list ${compact ? 'compact-inline' : ''}`}>
        {options.map((option) => (
          <label key={`${name}-${option}`}>
            <input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} /> {option}
          </label>
        ))}
      </div>
    </div>
  );
}

function Consent({ checked, onChange, label }) {
  return (
    <label className="consent-row consent-block">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
