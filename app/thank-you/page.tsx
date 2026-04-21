import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import TrackLead from '@/components/TrackLead';

export const metadata = {
  title: 'Review Request Received | Ontario Accident Review',
  description:
    'Your Ontario Accident Review request has been received. A representative will review your submission. No obligation, no legal case started.',
  robots: {
    index: false,
    follow: false
  }
};

export default function ThankYouPage() {
  return (
    <>
      <TrackLead />
      {/* Google Ads Conversion — Submit lead form (primary) */}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`gtag('event', 'conversion', {'send_to': 'AW-18043625605/HwLYCIypipAcEIXB75tD','value': 1.0,'currency': 'CAD'});`}
      </Script>
      {/* Header */}
      <header className="stitch-header">
        <div className="stitch-nav">
          <Link href="/" className="stitch-brand" aria-label="Ontario Accident Review">
            <Image src="/logo-placeholder.svg" alt="Ontario Accident Review" width={220} height={50} priority />
          </Link>
          <Link href="/" style={{ color: '#1a3060', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to home
          </Link>
        </div>
      </header>

      <style>{`
        .ty-card { background: #fff; border-radius: 14px; box-shadow: 0 2px 16px rgba(26,48,96,0.07); }
        .ty-step { display: flex; gap: 16px; align-items: flex-start; padding: 18px 0; border-bottom: 1px solid #edf0f5; }
        .ty-step:last-child { border-bottom: none; padding-bottom: 0; }
        .ty-num { width: 32px; height: 32px; border-radius: 50%; background: #1a3060; color: #fff; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; font-family: system-ui, sans-serif; }
        .ty-step-title { font-weight: 700; color: #1a3060; font-size: 0.95rem; margin-bottom: 4px; }
        .ty-step-body { color: #556; font-size: 0.88rem; line-height: 1.6; margin: 0; }
        .ty-urgent { background: #fff8e1; border: 1px solid #e8c84a; border-radius: 10px; padding: 20px 24px; display: flex; gap: 14px; align-items: flex-start; }
        .ty-reassure { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; }
        .ty-reassure-text { font-size: 0.875rem; color: #445; line-height: 1.5; }
        @media (max-width: 480px) {
          .ty-main-card { padding: 28px 20px 24px !important; }
          .ty-section { padding: 20px !important; }
        }
      `}</style>

      <main style={{ background: '#f4f6fa', minHeight: '100vh', padding: 'clamp(28px,5vw,56px) 16px clamp(48px,8vw,80px)' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Hero confirmation card ── */}
          <div className="ty-card ty-main-card" style={{ padding: '40px 40px 36px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1a3060 0%, #3a82c8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <svg width="26" height="26" viewBox="0 0 30 30" fill="none">
                <path d="M6 15.5l6 6L24 9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <p style={{ color: '#3a82c8', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'system-ui, sans-serif' }}>
              Review request received
            </p>
            <h1 style={{ color: '#1a3060', fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16, fontFamily: 'system-ui, sans-serif' }}>
              You&apos;re done. We&apos;ll take it from here.
            </h1>
            <p style={{ color: '#445', fontSize: '1rem', lineHeight: 1.75, margin: 0 }}>
              Your submission has been received. You don&apos;t need to do anything else right now.
              A representative will review your information and, if your situation fits our criteria,
              reach out to you using the contact details you provided.
            </p>
          </div>

          {/* ── What happens next ── */}
          <div className="ty-card ty-section" style={{ padding: '28px 32px' }}>
            <p style={{ color: '#3a82c8', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18, fontFamily: 'system-ui, sans-serif' }}>What happens next</p>

            <div className="ty-step">
              <div className="ty-num">1</div>
              <div>
                <p className="ty-step-title">Your submission is reviewed</p>
                <p className="ty-step-body">A representative reviews what you&apos;ve shared to assess whether your situation appears to fit our intake criteria. This typically happens within 1&ndash;2 business days.</p>
              </div>
            </div>

            <div className="ty-step">
              <div className="ty-num">2</div>
              <div>
                <p className="ty-step-title">We reach out if your situation fits</p>
                <p className="ty-step-body">If your situation appears suitable, a representative will contact you using the method and time you specified &mdash; to walk you through what may apply in plain language. Not every submission results in follow-up.</p>
              </div>
            </div>

            <div className="ty-step">
              <div className="ty-num">3</div>
              <div>
                <p className="ty-step-title">You decide what to do next</p>
                <p className="ty-step-body">If appropriate, we may suggest connecting with a licensed Ontario personal injury lawyer who can explain your options. There is no obligation at any stage &mdash; nothing moves forward unless you choose it to.</p>
              </div>
            </div>
          </div>

          {/* ── Reassurance block ── */}
          <div className="ty-card ty-section" style={{ padding: '24px 32px' }}>
            <p style={{ color: '#3a82c8', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'system-ui, sans-serif' }}>A few things to know</p>
            {[
              { icon: '✓', text: 'Submitting this form does not start a legal case or hire a lawyer. No legal relationship has been created.' },
              { icon: '✓', text: 'Your information is not shared with your insurance company. Ontario Accident Review has no affiliation with any insurer.' },
              { icon: '✓', text: 'There is no cost at any stage and no obligation to speak with or retain anyone.' },
              { icon: '✓', text: 'You do not need to do anything else right now. Simply wait to hear from us if your situation fits.' },
            ].map((item, i) => (
              <div key={i} className="ty-reassure">
                <span style={{ color: '#3a82c8', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <p className="ty-reassure-text">{item.text}</p>
              </div>
            ))}
          </div>

          {/* ── Urgent/time-sensitive callout ── */}
          <div className="ty-urgent">
            <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: 2 }}>⚠️</span>
            <div>
              <p style={{ fontWeight: 700, color: '#7a5800', fontSize: '0.9rem', marginBottom: 6, fontFamily: 'system-ui, sans-serif' }}>If your matter may be time-sensitive</p>
              <p style={{ color: '#7a5800', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>
                Ontario accident claims can involve deadlines for notifying your insurer and filing applications.
                If you believe your situation is urgent or a deadline may be approaching,
                please <strong>do not wait for our follow-up</strong> &mdash; seek qualified legal advice promptly.
                Ontario Accident Review does not provide legal deadline advice.
              </p>
            </div>
          </div>

          {/* ── Links ── */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/#faq" style={{ flex: 1, minWidth: 200, display: 'block', textAlign: 'center', background: '#1a3060', color: '#fff', fontWeight: 700, fontSize: '0.9rem', padding: '14px 24px', borderRadius: 8, textDecoration: 'none', minHeight: 48, lineHeight: '20px' }}>
              Common questions
            </Link>
            <Link href="/contact" style={{ flex: 1, minWidth: 200, display: 'block', textAlign: 'center', background: '#fff', color: '#1a3060', fontWeight: 600, fontSize: '0.9rem', padding: '14px 24px', borderRadius: 8, textDecoration: 'none', border: '1.5px solid #d0d8e8', minHeight: 48, lineHeight: '20px' }}>
              Contact us
            </Link>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#889', lineHeight: 1.5 }}>
            Ontario Accident Review is not a law firm and does not provide legal advice or legal representation.
          </p>

        </div>
      </main>

      <footer style={{ background: '#1a3060', color: '#a8bdd6', textAlign: 'center', padding: '20px', fontSize: '0.82rem' }}>
        &copy; 2026 Ontario Accident Review &mdash; Not a law firm. No legal advice. No legal representation.
      </footer>
    </>
  );
}
