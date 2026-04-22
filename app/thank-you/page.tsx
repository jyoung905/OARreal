import Link from 'next/link';
import Script from 'next/script';
import TrackLead from '@/components/TrackLead';

/* ─────────────────────────────────────────────────────────────────
   Thank-you / confirmation page — rebuilt to match rebrand review.tsx
   isSubmitted state exactly.
   Rebrand ref: /Desktop/.openclaw/web/src/pages/review.tsx (isSubmitted block)
   Logic preserved: TrackLead, Google Ads conversion Script
   ───────────────────────────────────────────────────────────────── */

export const metadata = {
  title: 'Review Request Received | Ontario Accident Review',
  description: 'Your Ontario Accident Review request has been received. A representative will review your submission.',
  robots: { index: false, follow: false }
};

export default function ThankYouPage() {
  return (
    <>
      <TrackLead />
      {/* Google Ads Conversion */}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`gtag('event', 'conversion', {'send_to': 'AW-18043625605/HwLYCIypipAcEIXB75tD','value': 1.0,'currency': 'CAD'});`}
      </Script>

      {/* Matches rebrand: min-h-[80vh] flex flex-col items-center justify-center bg-background px-4 py-20 text-center */}
      <div style={{
        minHeight: '80vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', padding: 'clamp(3rem,8vw,5rem) 1.5rem', textAlign: 'center',
      }}>

        {/* Icon — w-20 h-20 bg-secondary/10 flex items-center justify-center rounded-full mb-8 */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(138,90,26,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '2rem',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        {/* Heading — text-4xl md:text-5xl font-serif text-primary mb-6 */}
        <h1 className="font-serif" style={{
          fontSize: 'clamp(1.875rem, 4vw, 3rem)',
          fontWeight: 400, color: 'var(--primary)',
          marginBottom: '1.5rem', letterSpacing: '-0.01em', lineHeight: 1.15,
        }}>
          Review Request Submitted
        </h1>

        {/* Body — text-xl text-muted-foreground max-w-2xl mx-auto mb-10 */}
        <p style={{
          fontSize: '1.25rem', color: 'var(--muted)',
          maxWidth: 640, marginBottom: '2.5rem', lineHeight: 1.65,
        }}>
          Thank you for trusting us with your information. A SABS specialist will review your details and email your independent assessment within 1 business day.
        </p>

        {/* Next steps card — p-6 bg-muted/50 border border-border max-w-xl mx-auto text-sm text-left */}
        <div style={{
          padding: '1.5rem 2rem',
          background: 'rgba(214,220,230,0.3)',
          border: '1px solid var(--border)',
          maxWidth: 560, width: '100%', textAlign: 'left',
        }}>
          <h3 className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 400, color: 'var(--primary)', marginBottom: '0.75rem' }}>
            Next Steps
          </h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              Check your inbox for a confirmation email.
            </li>
            <li style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              Begin gathering your accident documentation (police reports, OCF forms) so you have them ready.
            </li>
            <li style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              Read our guide on{' '}
              <Link href="/resources" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                what to do in the first 72 hours
              </Link>.
            </li>
          </ul>
        </div>

        {/* Back link */}
        <Link
          href="/"
          style={{ marginTop: '2.5rem', fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}
          onMouseOver={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
          onMouseOut={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted)'}
        >
          ← Return to home
        </Link>
      </div>
    </>
  );
}
