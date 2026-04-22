import Link from 'next/link';
import Script from 'next/script';
import TrackLead from '@/components/TrackLead';

/* ─────────────────────────────────────────────────────────────────
   Thank-you / confirmation page
   Copy: original OAR thank-you page (pre-rebrand)
   Visual: rebrand review.tsx isSubmitted state layout
   ───────────────────────────────────────────────────────────────── */

export const metadata = {
  title: 'Review Request Received | Ontario Accident Review',
  description: 'Your Ontario Accident Review request has been received. A representative will review your submission. No obligation, no legal case started.',
  robots: { index: false, follow: false }
};

const STEPS = [
  {
    n: '1',
    title: 'Your submission is reviewed',
    body: 'A representative reviews what you\'ve shared to assess whether your situation appears to fit our intake criteria. This typically happens within 1–2 business days.',
  },
  {
    n: '2',
    title: 'We reach out if your situation fits',
    body: 'If your situation appears suitable, a representative will contact you using the method and time you specified — to walk you through what may apply in plain language. Not every submission results in follow-up.',
  },
  {
    n: '3',
    title: 'You decide what to do next',
    body: 'If appropriate, we may suggest connecting with a licensed Ontario personal injury lawyer who can explain your options. There is no obligation at any stage — nothing moves forward unless you choose it to.',
  },
];

const REASSURANCES = [
  'Submitting this form does not start a legal case or hire a lawyer. No legal relationship has been created.',
  'Your information is not shared with your insurance company. Ontario Accident Review has no affiliation with any insurer.',
  'There is no cost at any stage and no obligation to speak with or retain anyone.',
  'You do not need to do anything else right now. Simply wait to hear from us if your situation fits.',
];

export default function ThankYouPage() {
  return (
    <>
      <TrackLead />
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`gtag('event', 'conversion', {'send_to': 'AW-18043625605/HwLYCIypipAcEIXB75tD','value': 1.0,'currency': 'CAD'});`}
      </Script>

      {/* Visual: min-h-[80vh] flex flex-col items-center justify-center bg-background px-4 py-20 */}
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 'clamp(3rem,8vw,5rem) 1.5rem' }}>
        <div style={{ maxWidth: 640, width: '100%' }}>

          {/* Icon — visual: w-20 h-20 bg-secondary/10 rounded-full, rebrand CheckCircle2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(138,90,26,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>

            {/* Eyebrow — ORIGINAL OAR COPY */}
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>
              Review request received
            </div>

            {/* Heading — ORIGINAL OAR COPY */}
            <h1 className="font-serif" style={{ fontSize: 'clamp(1.875rem,4vw,3rem)', fontWeight: 400, color: 'var(--primary)', marginBottom: '1.25rem', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
              You&apos;re done. We&apos;ll take it from here.
            </h1>

            {/* Body — ORIGINAL OAR COPY */}
            <p style={{ fontSize: '1.125rem', color: 'var(--muted)', lineHeight: 1.65, maxWidth: 560 }}>
              Your submission has been received. You don&apos;t need to do anything else right now.
              A representative will review your information and, if your situation fits our criteria,
              reach out to you using the contact details you provided.
            </p>
          </div>

          {/* What happens next — ORIGINAL OAR COPY, rebrand card visual */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.75rem 2rem', marginBottom: '1rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.125rem', color: 'var(--primary)', marginBottom: '1.25rem', fontWeight: 400 }}>
              What happens next
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS.map(({ n, title, body }, i) => (
                <div key={n} style={{ display: 'flex', gap: '1rem', paddingTop: i > 0 ? '1.25rem' : 0, paddingBottom: i < STEPS.length - 1 ? '1.25rem' : 0, borderBottom: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>{n}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{title}</p>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reassurances — ORIGINAL OAR COPY, rebrand muted card visual */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem 2rem', marginBottom: '1rem' }}>
            <h3 className="font-serif" style={{ fontSize: '1.125rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 400 }}>
              A few things to know
            </h3>
            {REASSURANCES.map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.625rem 0', borderBottom: i < REASSURANCES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.65 }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Time-sensitive callout — ORIGINAL OAR COPY, rebrand muted warning visual */}
          <div style={{ background: '#fff8e1', border: '1px solid #e8c84a', padding: '1.25rem 1.5rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: 2 }}>⚠️</span>
            <div>
              <p style={{ fontWeight: 700, color: '#7a5800', fontSize: '0.9rem', marginBottom: '0.375rem' }}>If your matter may be time-sensitive</p>
              <p style={{ color: '#7a5800', fontSize: '0.85rem', lineHeight: 1.65 }}>
                Ontario accident claims can involve deadlines for notifying your insurer and filing applications.
                If you believe your situation is urgent or a deadline may be approaching,
                please <strong>do not wait for our follow-up</strong> — seek qualified legal advice promptly.
                Ontario Accident Review does not provide legal deadline advice.
              </p>
            </div>
          </div>

          {/* Action links — ORIGINAL LABELS */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <Link href="/#faq" style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48, background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
              Common questions
            </Link>
            <Link href="/contact" style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 48, background: 'transparent', border: '1px solid var(--border)', color: 'var(--primary)', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none' }}>
              Contact us
            </Link>
          </div>

          {/* Legal disclaimer — ORIGINAL OAR COPY */}
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            Ontario Accident Review is not a law firm and does not provide legal advice or legal representation.
          </p>
        </div>
      </div>
    </>
  );
}
