import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import TrackLead from '@/components/TrackLead';

export const metadata = {
  title: 'Thank You | Ontario Accident Review',
  description:
    'Your Ontario Accident Review request has been received. A representative may follow up after the submission is reviewed.',
  robots: {
    index: false,
    follow: false
  }
};

export default function ThankYouPage() {
  return (
    <>
      <TrackLead />
      {/* Google Ads Conversion */}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`gtag('event', 'conversion', {'send_to': 'AW-18043625605/8oKiCPKi4vIaEOr6xaED','value': 1.0,'currency': 'CAD'});`}
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

      <main style={{ background: '#f4f6fa', minHeight: '100vh', padding: '60px 20px 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Success card */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '48px 48px 40px',
            boxShadow: '0 4px 24px rgba(26,48,96,0.08)',
            marginBottom: 24
          }}>
            {/* Icon */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a3060 0%, #3a82c8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24
            }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M6 15.5l6 6L24 9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <p style={{ color: '#3a82c8', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              Submitted Successfully
            </p>
            <h1 style={{ color: '#1a3060', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
              Your accident is being reviewed
            </h1>
            <p style={{ color: '#445', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 560 }}>
              A representative from Ontario Accident Review will review your submission. If
              your situation appears to fit the review criteria, someone may contact you
              using the information you provided.
            </p>
          </div>

          {/* Info panels */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>

            <div style={{ background: '#fff', borderRadius: 12, padding: '28px 28px 24px', boxShadow: '0 2px 12px rgba(26,48,96,0.06)', borderTop: '3px solid #3a82c8' }}>
              <p style={{ color: '#3a82c8', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                What happens next
              </p>
              <h3 style={{ color: '#1a3060', fontWeight: 700, fontSize: '1.05rem', marginBottom: 10 }}>
                Reviewed before any follow-up
              </h3>
              <p style={{ color: '#556', fontSize: '0.92rem', lineHeight: 1.65 }}>
                This is an initial review request only. It does not create a lawyer-client
                relationship, and Ontario Accident Review is not a law firm.
              </p>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: '28px 28px 24px', boxShadow: '0 2px 12px rgba(26,48,96,0.06)', borderTop: '3px solid #1a3060' }}>
              <p style={{ color: '#3a82c8', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                Important reminder
              </p>
              <h3 style={{ color: '#1a3060', fontWeight: 700, fontSize: '1.05rem', marginBottom: 10 }}>
                Keep sensitive details out of first-step intake
              </h3>
              <p style={{ color: '#556', fontSize: '0.92rem', lineHeight: 1.65 }}>
                Please do not send insurance policy details, banking information, government
                IDs, or uploads unless you are asked through an approved follow-up process.
              </p>
            </div>

          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #1a3060 0%, #2a5298 100%)',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              padding: '14px 32px', borderRadius: 8, textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(26,48,96,0.25)'
            }}>
              Back to home
            </Link>
            <Link href="/privacy" style={{
              display: 'inline-block',
              background: '#fff', color: '#1a3060', fontWeight: 600, fontSize: '0.95rem',
              padding: '14px 32px', borderRadius: 8, textDecoration: 'none',
              border: '1.5px solid #d0d8e8'
            }}>
              Privacy Policy
            </Link>
          </div>

        </div>
      </main>

      <footer style={{ background: '#1a3060', color: '#a8bdd6', textAlign: 'center', padding: '24px 20px', fontSize: '0.85rem' }}>
        Ontario Accident Review is not a law firm. No legal advice. No legal representation.
      </footer>
    </>
  );
}
