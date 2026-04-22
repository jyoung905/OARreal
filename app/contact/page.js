import Link from 'next/link';

export const metadata = {
  title: 'Contact | Ontario Accident Review',
  description: "Get in touch with Ontario Accident Review. Start your free, confidential SABS review or send us a general question."
};

/* ─────────────────────────────────────────────────────────────────
   Contact page — rebuilt to match rebrand contact.tsx exactly
   Rebrand ref: /Desktop/.openclaw/web/src/pages/contact.tsx
   ───────────────────────────────────────────────────────────────── */

export default function ContactPage() {
  return (
    /* py-20 md:py-32 bg-background */
    <section style={{ padding: 'clamp(5rem,8vw,8rem) 1.5rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header — text-4xl md:text-6xl font-serif tracking-tight */}
        <div style={{ marginBottom: 'clamp(3rem,6vw,4rem)', textAlign: 'center' }}>
          <h1 className="font-serif" style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 400, letterSpacing: '-0.02em',
            color: 'var(--primary)', marginBottom: '1.5rem',
          }}>
            Contact Us
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--muted)', maxWidth: 580, margin: '0 auto', lineHeight: 1.65 }}>
            Whether you have a quick question or need a comprehensive review of your situation, we&apos;re here to provide clarity.
          </p>
        </div>

        {/* Two cards — grid md:grid-cols-2 gap-12 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>

          {/* Start Review card */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            padding: '2rem', border: '1px solid var(--border)',
            background: 'var(--surface)', transition: 'border-color 0.2s',
          }}
          >
            {/* Icon box — h-12 w-12 bg-secondary/10 flex items-center justify-center mb-6 */}
            <div style={{
              width: 48, height: 48,
              background: 'rgba(138,90,26,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 400 }}>Start Your Review</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem', flex: 1, lineHeight: 1.65, fontSize: '0.95rem' }}>
              The most efficient way to get our help. Complete our secure intake form to give us the context we need to review your claim and provide actionable guidance.
            </p>
            <Link
              href="/#intake"
              style={{
                display: 'inline-flex', height: 48, alignItems: 'center',
                padding: '0 1.5rem', background: 'var(--primary)',
                color: '#fff', fontSize: '0.875rem', fontWeight: 500,
                textDecoration: 'none', transition: 'background 0.15s',
                alignSelf: 'flex-start',
              }}
            >
              Begin Intake Form
              <svg style={{ marginLeft: '0.5rem' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Email card */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            padding: '2rem', border: '1px solid var(--border)',
            background: 'var(--surface)', transition: 'border-color 0.2s',
          }}
          >
            {/* Icon box — bg-primary/10 */}
            <div style={{
              width: 48, height: 48,
              background: 'rgba(13,27,46,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 400 }}>Email Us</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem', flex: 1, lineHeight: 1.65, fontSize: '0.95rem' }}>
              Have a general question before starting a review? Send us an email. We typically respond within 24 hours during the business week.
            </p>
            <a
              href="mailto:info@ontarioaccidentreview.ca"
              style={{
                display: 'inline-flex', height: 48, alignItems: 'center',
                padding: '0 1.5rem', background: 'transparent',
                border: '1px solid var(--border)', color: 'var(--text-strong)',
                fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
                transition: 'background 0.15s', alignSelf: 'flex-start',
              }}
            >
              info@ontarioaccidentreview.ca
            </a>
          </div>
        </div>

        {/* Confidentiality block — mt-16 p-8 bg-muted/50 border flex items-start gap-4 */}
        <div style={{
          padding: '2rem', background: 'rgba(214,220,230,0.3)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'flex-start', gap: '1rem',
        }}>
          <svg style={{ flexShrink: 0, marginTop: '0.125rem', color: 'var(--accent)' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
          </svg>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.125rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 400 }}>Confidentiality Guarantee</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.65 }}>
              All communications with Ontario Accident Review are strictly confidential. We do not sell, share, or distribute your personal information or accident details to insurance companies or law firms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
