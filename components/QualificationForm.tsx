'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Dispatch, FormEvent, ReactNode, SetStateAction } from 'react';
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
  inOntario: '',
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
  ['accidentType', 'accidentDate', 'cityArea', 'inOntario', 'accidentSummary'],
  ['injured', 'medicalAttention', 'workImpact', 'ongoingSymptoms'],
  ['spokenWithLawyer', 'currentlyRepresented', 'thirdPartyInvolved'],
  ['consentTruth', 'consentNotLawFirm', 'consentToContact']
];

function getStepError(stepIndex: number, data: typeof initialData) {
  for (const key of requiredByStep[stepIndex]) {
    const value = data[key as keyof typeof initialData];
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

function updateField(
  setter: React.Dispatch<React.SetStateAction<typeof initialData>>,
  name: keyof typeof initialData,
  value: string | boolean
) {
  setter((current) => ({ ...current, [name]: value }));
}

export function QualificationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [submitState, setSubmitState] = useState({ status: 'idle', error: '' });

  const progress = useMemo(() => ((step + 1) / formSteps.length) * 100, [step]);
  const progressLabel = `Step ${step + 1} of ${formSteps.length} · ${formSteps[step]?.label || ''}`;

  const next = () => {
    const error = getStepError(step, data);
    if (error) {
      setSubmitState({ status: 'idle', error });
      return;
    }
    setSubmitState({ status: 'idle', error: '' });
    setStep((current) => Math.min(current + 1, formSteps.length - 1));
  };

  const previous = () => {
    setSubmitState({ status: 'idle', error: '' });
    setStep((current) => Math.max(current - 1, 0));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = getStepError(step, data);
    if (error) {
      setSubmitState({ status: 'idle', error });
      return;
    }

    setSubmitState({ status: 'submitting', error: '' });

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sourcePage: '/' })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Submission failed. Please try again.');
      }
      router.push('/thank-you');
    } catch (errorMessage) {
      setSubmitState({
        status: 'idle',
        error:
          errorMessage instanceof Error
            ? errorMessage.message
            : 'There was a problem submitting your inquiry.'
      });
    }
  };

  return (
    <section className="intake-section-v2" id="intake">
      <div className="container">
        <div className="intake-shell-v2">
          <div className="intake-head-v2">
            <span className="intake-eyebrow-v2">
              <span className="dot" />
              Start your review
            </span>
            <h2>
              Tell us the basics of <span className="serif-italic">your accident.</span>
            </h2>
            <p>
              Keep it simple. We only ask for the information needed for an initial review and
              possible follow-up.
            </p>
          </div>

          <div className="intake-reassurance-v2">
            <article>
              <strong>Takes about 2 minutes</strong>
              <span>
                Answer approximately. The goal is a useful first review, not a perfect legal
                file.
              </span>
            </article>
            <article>
              <strong>Reviewed before follow-up</strong>
              <span>A representative from Ontario Accident Review reviews submissions first.</span>
            </article>
            <article>
              <strong>Minimal information</strong>
              <span>No insurance details. No document uploads. No sensitive IDs.</span>
            </article>
          </div>

          <div className="intake-stepper" aria-hidden="true">
            {formSteps.map((s, i) => (
              <div
                key={s.id}
                className={`step-pill ${i < step ? 'is-done' : ''} ${i === step ? 'is-active' : ''}`}
              >
                <span className="bar" />
                <span className="label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="intake-progress-v2" role="status" aria-live="polite">
            <span>{progressLabel}</span>
            <div className="track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <span>{`${Math.round(progress)}%`}</span>
          </div>

          <form className="intake-form intake-form-v2" onSubmit={submit}>
          <section className={`form-step ${step === 0 ? 'active' : ''}`}>
            <div className="step-heading">
              <span className="step-kicker">Step 1</span>
              <h3>Where should we reach you?</h3>
              <p className="step-copy">
                If your situation appears to fit our review criteria, a representative from
                Ontario Accident Review may contact you using the details you provide.
              </p>
            </div>
            <div className="field-grid">
              <Field label="Full name"><input required value={data.fullName} onChange={(e) => updateField(setData, 'fullName', e.target.value)} /></Field>
              <Field label="Phone number"><input required type="tel" value={data.phone} onChange={(e) => updateField(setData, 'phone', e.target.value)} /></Field>
              <Field label="Email address"><input required type="email" value={data.email} onChange={(e) => updateField(setData, 'email', e.target.value)} /></Field>
              <Field label="Best time to reach you">
                <select required value={data.bestTime} onChange={(e) => updateField(setData, 'bestTime', e.target.value)}>
                  <option value="">Select one</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Anytime</option>
                </select>
              </Field>
            </div>
            <RadioGroup label="Preferred contact method" name="contactMethod" value={data.contactMethod} onChange={(value) => updateField(setData, 'contactMethod', value)} options={['Phone', 'Email', 'Either']} />
          </section>

          <section className={`form-step ${step === 1 ? 'active' : ''}`}>
            <div className="step-heading"><span className="step-kicker">Step 2</span><h3>Tell us the basics</h3></div>
            <div className="field-grid">
              <Field label="What type of accident was it?">
                <select required value={data.accidentType} onChange={(e) => updateField(setData, 'accidentType', e.target.value)}>
                  <option value="">Select one</option><option>Car accident</option><option>Truck accident</option><option>Motorcycle accident</option><option>Pedestrian accident</option><option>Bicycle accident</option><option>Slip and fall</option><option>Other</option>
                </select>
              </Field>
              <Field label="Date of accident"><input required type="date" value={data.accidentDate} onChange={(e) => updateField(setData, 'accidentDate', e.target.value)} /></Field>
              <Field label="City or town in Ontario"><input required value={data.cityArea} placeholder="Toronto, Brampton, Mississauga, Hamilton, etc." onChange={(e) => updateField(setData, 'cityArea', e.target.value)} /></Field>
              <RadioGroup compact label="Did the accident happen in Ontario?" name="inOntario" value={data.inOntario} onChange={(value) => updateField(setData, 'inOntario', value)} options={['Yes', 'No']} />
            </div>
            <Field label="Briefly describe what happened"><textarea required rows={6} placeholder="A short summary is enough. Tell us what happened and what problems you are dealing with now." value={data.accidentSummary} onChange={(e) => updateField(setData, 'accidentSummary', e.target.value)} /></Field>
          </section>

          <section className={`form-step ${step === 2 ? 'active' : ''}`}>
            <div className="step-heading"><span className="step-kicker">Step 3</span><h3>How has this affected you?</h3></div>
            <div className="field-grid">
              <RadioGroup compact label="Were you injured?" name="injured" value={data.injured} onChange={(value) => updateField(setData, 'injured', value)} options={['Yes', 'No', 'Not sure']} />
              <RadioGroup compact label="Did you receive medical attention?" name="medicalAttention" value={data.medicalAttention} onChange={(value) => updateField(setData, 'medicalAttention', value)} options={['Yes', 'No', 'Not yet']} />
              <RadioGroup compact label="Has the accident affected your work or daily life?" name="workImpact" value={data.workImpact} onChange={(value) => updateField(setData, 'workImpact', value)} options={['Yes', 'No', 'Not sure']} />
              <RadioGroup compact label="Are you still experiencing symptoms?" name="ongoingSymptoms" value={data.ongoingSymptoms} onChange={(value) => updateField(setData, 'ongoingSymptoms', value)} options={['Yes', 'No', 'Not sure']} />
            </div>
            <Field label="What injuries or symptoms did you experience?"><textarea rows={4} placeholder="You can keep this short." value={data.injuryDetails} onChange={(e) => updateField(setData, 'injuryDetails', e.target.value)} /></Field>
          </section>

          <section className={`form-step ${step === 3 ? 'active' : ''}`}>
            <div className="step-heading"><span className="step-kicker">Step 4</span><h3>A few final questions</h3></div>
            <div className="field-grid">
              <RadioGroup compact label="Have you already spoken with a lawyer about this accident?" name="spokenWithLawyer" value={data.spokenWithLawyer} onChange={(value) => updateField(setData, 'spokenWithLawyer', value)} options={['Yes', 'No']} />
              <RadioGroup compact label="Do you currently have a lawyer representing you for this matter?" name="currentlyRepresented" value={data.currentlyRepresented} onChange={(value) => updateField(setData, 'currentlyRepresented', value)} options={['Yes', 'No']} />
              <RadioGroup compact label="Was another person, driver, property owner, or business potentially involved?" name="thirdPartyInvolved" value={data.thirdPartyInvolved} onChange={(value) => updateField(setData, 'thirdPartyInvolved', value)} options={['Yes', 'No', 'Not sure']} />
            </div>
            <Field label="Is there anything else you want us to know?"><textarea rows={4} value={data.additionalNotes} onChange={(e) => updateField(setData, 'additionalNotes', e.target.value)} /></Field>
          </section>

          <section className={`form-step ${step === 4 ? 'active' : ''}`}>
            <div className="step-heading">
              <span className="step-kicker">Step 5</span>
              <h3>Review and submit</h3>
              <p className="step-copy">Submitting this form is only a request for an initial review.</p>
            </div>
            <Consent checked={data.consentTruth} onChange={(value) => updateField(setData, 'consentTruth', value)} label="I confirm the information I provided is true to the best of my knowledge." />
            <Consent checked={data.consentNotLawFirm} onChange={(value) => updateField(setData, 'consentNotLawFirm', value)} label="I understand Ontario Accident Review is not a law firm and does not provide legal advice or legal representation." />
            <label className="consent-row consent-block">
              <input type="checkbox" checked={data.consentToContact} onChange={(e) => updateField(setData, 'consentToContact', e.target.checked)} />
              <span>
                I consent to being contacted by Ontario Accident Review about my review request and I acknowledge the <Link href="/privacy" className="text-link">Privacy Policy</Link>.
              </span>
            </label>
            <p className="disclaimer">Submitting information through this site is only a request for an initial review and does not create a lawyer-client relationship.</p>
          </section>

            {submitState.error ? <p className="disclaimer" role="alert">{submitState.error}</p> : null}

            <div className="form-actions">
              <button type="button" className={`button button-secondary ${step === 0 ? 'hidden' : ''}`} onClick={previous}>Back</button>
              {step < formSteps.length - 1 ? (
                <button type="button" className="button" onClick={next}>Continue</button>
              ) : (
                <button type="submit" className="button" disabled={submitState.status === 'submitting'}>
                  {submitState.status === 'submitting' ? 'Submitting...' : 'Submit My Review'}
                </button>
              )}
            </div>
          </form>
          <div className="intake-footnote">
            Your answers are reviewed by a person. Ontario Accident Review is not a law firm and
            does not provide legal advice or legal representation.
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field-group">
      <label>{label}</label>
      {children}
    </div>
  );
}

function RadioGroup({
  label,
  options,
  value,
  onChange,
  compact = false,
  name
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  name: string;
}) {
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

function Consent({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="consent-row consent-block">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
