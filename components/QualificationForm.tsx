'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { formSteps } from '@/lib/site';

/* ─────────────────────────────────────────────────────────────────
   QualificationForm — Rebrand visual port
   Logic 100% preserved (validation, submit, Supabase via /api/intake)
   Visual matches: /Desktop/.openclaw/web/src/pages/review.tsx
   ───────────────────────────────────────────────────────────────── */

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
  setter: (value: (current: typeof initialData) => typeof initialData) => void,
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

  const next = () => {
    const error = getStepError(step, data);
    if (error) { setSubmitState({ status: 'idle', error }); return; }
    setSubmitState({ status: 'idle', error: '' });
    setStep(s => Math.min(s + 1, formSteps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const previous = () => {
    setSubmitState({ status: 'idle', error: '' });
    setStep(s => Math.max(s - 1, 0));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      router.push('/thank-you');
    } catch (errorMessage) {
      setSubmitState({
        status: 'idle',
        error: errorMessage instanceof Error ? errorMessage.message : 'There was a problem submitting your inquiry.'
      });
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div id="intake" style={{ background: 'var(--bg)', paddingTop: 1 }}>
      {/* Header banner — matches rebrand: bg-primary text-primary-foreground py-12 md:py-16 */}
      <div style={{ background: 'var(--primary)', color: '#fff', padding: 'clamp(3rem,6vw,4rem) 1.5rem' }}>
        <div style={{ maxWidth: 768, margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 400, color: '#fff', marginBottom: '1rem', lineHeight: 1.2,
          }}>
            Confidential SABS Review
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', fontWeight: 300, lineHeight: 1.65 }}>
            Answer a few questions about your situation. We&apos;ll provide a plain-language assessment of your rights and options.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 768, margin: '0 auto', padding: 'clamp(2rem,4vw,3rem) 1.5rem clamp(4rem,8vw,6rem)' }}>

        {/* Progress bar — matches rebrand: labels + h-1 bar */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            {[
              { label: 'Incident',  idx: 0 },
              { label: 'Injuries',  idx: 1 },
              { label: 'Impact',    idx: 2 },
              { label: 'Status',    idx: 3 },
              { label: 'Details',   idx: 4 },
            ].map(({ label, idx }) => (
              <span key={label} style={{
                fontSize: '0.72rem', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: step >= idx ? 'var(--primary)' : 'var(--muted)',
              }}>{label}</span>
            ))}
          </div>
          <div style={{ height: 4, width: '100%', background: 'var(--border)' }}>
            <div style={{
              height: '100%', background: 'var(--accent)',
              transition: 'width 0.5s ease',
              width: `${progress}%`,
            }} />
          </div>
        </div>

        {/* Form card — matches rebrand: bg-card border p-6 md:p-10 shadow-sm */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: 'clamp(1.5rem,4vw,2.5rem)', boxShadow: 'var(--shadow)',
        }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* ── Step 1: Contact ── */}
            {step === 0 && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <StepHeader step="1" title="The Contact Details" subtitle="If your situation appears to fit our review criteria, a representative will reach you using these details." />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <Field label="Full name">
                    <Input value={data.fullName} onChange={e => updateField(setData, 'fullName', e.target.value)} required />
                  </Field>
                  <Field label="Phone number">
                    <Input type="tel" value={data.phone} onChange={e => updateField(setData, 'phone', e.target.value)} required />
                  </Field>
                  <Field label="Email address">
                    <Input type="email" value={data.email} onChange={e => updateField(setData, 'email', e.target.value)} required />
                  </Field>
                  <Field label="Best time to reach you">
                    <Select value={data.bestTime} onChange={e => updateField(setData, 'bestTime', e.target.value)} required>
                      <option value="">Select one</option>
                      <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Anytime</option>
                    </Select>
                  </Field>
                </div>
                <RadioField
                  label="Preferred contact method"
                  name="contactMethod"
                  value={data.contactMethod}
                  options={['Phone', 'Email', 'Either']}
                  onChange={v => updateField(setData, 'contactMethod', v)}
                />
              </div>
            )}

            {/* ── Step 2: Accident Basics ── */}
            {step === 1 && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <StepHeader step="2" title="The Incident" subtitle="SABS deadlines are strictly tied to the date of the accident — accuracy matters here." />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <Field label="What type of accident was it?">
                    <Select value={data.accidentType} onChange={e => updateField(setData, 'accidentType', e.target.value)} required>
                      <option value="">Select one</option>
                      <option>Car accident</option><option>Truck accident</option><option>Motorcycle accident</option>
                      <option>Pedestrian accident</option><option>Bicycle accident</option><option>Slip and fall</option><option>Other</option>
                    </Select>
                  </Field>
                  <Field label="Date of accident" hint="Approximate is fine">
                    <Input type="date" value={data.accidentDate} onChange={e => updateField(setData, 'accidentDate', e.target.value)} required />
                  </Field>
                  <Field label="City or town in Ontario">
                    <Input value={data.cityArea} placeholder="e.g. Toronto, Hamilton, Brampton" onChange={e => updateField(setData, 'cityArea', e.target.value)} required />
                  </Field>
                  <RadioField compact label="Did the accident happen in Ontario?" name="inOntario" value={data.inOntario} options={['Yes', 'No']} onChange={v => updateField(setData, 'inOntario', v)} />
                </div>
                <Field label="Briefly describe what happened">
                  <Textarea
                    rows={6}
                    placeholder="A short summary is enough. Tell us what happened and what problems you are dealing with now."
                    value={data.accidentSummary}
                    onChange={e => updateField(setData, 'accidentSummary', e.target.value)}
                    required
                  />
                </Field>
              </div>
            )}

            {/* ── Step 3: Injuries & Impact ── */}
            {step === 2 && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <StepHeader step="3" title="Injuries &amp; Impact" subtitle="These answers help us understand the impact without asking for sensitive documents." />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <RadioField compact label="Were you injured?" name="injured" value={data.injured} options={['Yes', 'No', 'Not sure']} onChange={v => updateField(setData, 'injured', v)} />
                  <RadioField compact label="Did you receive medical attention?" name="medicalAttention" value={data.medicalAttention} options={['Yes', 'No', 'Not yet']} onChange={v => updateField(setData, 'medicalAttention', v)} />
                  <RadioField compact label="Has the accident affected your work or daily life?" name="workImpact" value={data.workImpact} options={['Yes', 'No', 'Not sure']} onChange={v => updateField(setData, 'workImpact', v)} />
                  <RadioField compact label="Are you still experiencing symptoms?" name="ongoingSymptoms" value={data.ongoingSymptoms} options={['Yes', 'No', 'Not sure']} onChange={v => updateField(setData, 'ongoingSymptoms', v)} />
                </div>
                <Field label="What injuries or symptoms did you experience? (Optional)">
                  <Textarea rows={4} placeholder="Keep it short." value={data.injuryDetails} onChange={e => updateField(setData, 'injuryDetails', e.target.value)} />
                </Field>
              </div>
            )}

            {/* ── Step 4: Current Status ── */}
            {step === 3 && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <StepHeader step="4" title="Current Status" subtitle="We use these answers to understand whether the matter is still at the review stage." />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <RadioField label="Have you notified your insurance company?" name="insuranceNotified" value={data.spokenWithLawyer} options={['Yes, and I\'ve submitted the application forms', 'Yes, but I haven\'t submitted the forms yet', 'No, I haven\'t notified them yet']} onChange={v => updateField(setData, 'spokenWithLawyer', v)} />
                  <RadioField label="Do you currently have legal representation?" name="hasLawyer" value={data.currentlyRepresented} options={['No, I am researching my options', 'Yes, I already have a lawyer']} onChange={v => updateField(setData, 'currentlyRepresented', v)} />
                  <RadioField compact label="Was another person, driver, property owner, or business potentially involved?" name="thirdPartyInvolved" value={data.thirdPartyInvolved} options={['Yes', 'No', 'Not sure']} onChange={v => updateField(setData, 'thirdPartyInvolved', v)} />
                </div>
              </div>
            )}

            {/* ── Step 5: Review & Consent ── */}
            {step === 4 && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <StepHeader step="5" title="Your Details &amp; Consent" subtitle="Submitting this form is only a request for an initial review. Your answers are encrypted and confidential." />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                  <Field label="First Name"><Input value={data.fullName.split(' ')[0] || data.fullName} onChange={e => updateField(setData, 'fullName', e.target.value + ' ' + (data.fullName.split(' ').slice(1).join(' ') || ''))} required /></Field>
                  <Field label="Last Name"><Input value={data.fullName.split(' ').slice(1).join(' ')} onChange={e => updateField(setData, 'fullName', (data.fullName.split(' ')[0] || '') + ' ' + e.target.value)} required /></Field>
                  <Field label="Email Address"><Input type="email" value={data.email} onChange={e => updateField(setData, 'email', e.target.value)} required /></Field>
                  <Field label="Phone Number (Optional)"><Input type="tel" value={data.phone} onChange={e => updateField(setData, 'phone', e.target.value)} /></Field>
                </div>
                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <ConsentRow checked={data.consentTruth} onChange={v => updateField(setData, 'consentTruth', v)}
                    label="I confirm the information I provided is true to the best of my knowledge." />
                  <ConsentRow checked={data.consentNotLawFirm} onChange={v => updateField(setData, 'consentNotLawFirm', v)}
                    label="I understand Ontario Accident Review is not a law firm and does not provide legal advice or legal representation." />
                  <ConsentRow checked={data.consentToContact} onChange={v => updateField(setData, 'consentToContact', v)}
                    label={<>I consent to being contacted by Ontario Accident Review about my review request and I acknowledge the <Link href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Privacy Policy</Link>.</>} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                    Submitting information through this site is only a request for an initial review and does not create a lawyer-client relationship.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {submitState.error && (
              <p style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '0.875rem', fontWeight: 500 }} role="alert">
                {submitState.error}
              </p>
            )}

            {/* Nav buttons — matches rebrand: flex justify-between */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              {step > 0 ? (
                <button
                  type="button" onClick={previous}
                  style={{
                    display: 'inline-flex', height: 48, alignItems: 'center',
                    padding: '0 1.5rem', background: 'transparent',
                    border: '1px solid var(--border)', color: 'var(--text-strong)',
                    fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-alt)'}
                  onMouseOut={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
                >
                  ← Back
                </button>
              ) : <div />}

              {step < formSteps.length - 1 ? (
                <button
                  type="button" onClick={next}
                  style={{
                    display: 'inline-flex', height: 48, alignItems: 'center',
                    padding: '0 2rem', background: 'var(--primary)',
                    color: '#fff', fontSize: '0.875rem', fontWeight: 500,
                    cursor: 'pointer', border: 'none', marginLeft: 'auto',
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-strong)'}
                  onMouseOut={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary)'}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitState.status === 'submitting'}
                  style={{
                    display: 'inline-flex', height: 48, alignItems: 'center',
                    padding: '0 2rem', background: 'var(--accent)',
                    color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500,
                    cursor: submitState.status === 'submitting' ? 'not-allowed' : 'pointer',
                    border: 'none', marginLeft: 'auto', opacity: submitState.status === 'submitting' ? 0.7 : 1,
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => { if (submitState.status !== 'submitting') (e.currentTarget as HTMLButtonElement).style.background = '#a06d22'; }}
                  onMouseOut={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)'}
                >
                  {submitState.status === 'submitting' ? 'Submitting…' : 'Submit for Review ✓'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Security note */}
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Secure, encrypted, and strictly confidential.
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components matching rebrand input styling ─────────────── */

function StepHeader({ step, title, subtitle }: { step: string; title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', color: 'var(--primary)', marginBottom: '0.5rem' }}
        dangerouslySetInnerHTML={{ __html: `${title}` }}
      />
      <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{subtitle}</p>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-strong)' }}>
        {label}
        {hint && <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: '0.4rem', fontWeight: 400 }}>({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputBase: React.CSSProperties = {
  width: '100%', height: 48, padding: '0 1rem',
  border: '1px solid var(--border)', background: 'var(--surface)',
  color: 'var(--text-strong)', fontSize: '0.95rem',
  outline: 'none', transition: 'border-color 0.15s', borderRadius: 0,
  boxSizing: 'border-box',
};

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ ...inputBase, ...props.style }}
      onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{ ...inputBase, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
      onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {children}
    </select>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-strong)', fontSize: '0.95rem', outline: 'none', resize: 'none', transition: 'border-color 0.15s', borderRadius: 0, boxSizing: 'border-box', ...props.style }}
      onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
    />
  );
}

// Radio options styled as bordered clickable rows — matches rebrand exactly
function RadioField({
  label, name, options, value, onChange, compact = false,
}: {
  label: string; name: string; options: string[]; value: string;
  onChange: (v: string) => void; compact?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-strong)' }}>{label}</label>
      <div style={{ display: 'flex', flexDirection: compact ? 'row' : 'column', flexWrap: 'wrap', gap: compact ? '0.5rem' : '0.375rem' }}>
        {options.map(opt => {
          const checked = value === opt;
          return (
            <label
              key={opt}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: compact ? '0.5rem 1rem' : '1rem 1rem',
                border: `1px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
                background: checked ? 'rgba(138,90,26,0.05)' : 'var(--surface)',
                cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-strong)',
                transition: 'all 0.12s', userSelect: 'none',
              }}
              onMouseOver={e => { if (!checked) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,27,46,0.4)'; }}
              onMouseOut={e => { if (!checked) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            >
              <input
                type="radio" name={name} value={opt} checked={checked}
                onChange={() => onChange(opt)}
                style={{ accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }}
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ConsentRow({
  checked, onChange, label,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
      <input
        type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0, marginTop: '0.125rem' }}
      />
      <span style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>{label}</span>
    </label>
  );
}
