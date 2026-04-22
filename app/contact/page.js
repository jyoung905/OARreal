import Link from 'next/link';

export const metadata = {
  title: 'Contact',
  description: "Get in touch with Ontario Accident Review. We're here to help with your initial accident review inquiry."
};

/* ─────────────────────────────────────────────────────────────────
   Contact page
   Copy: original OAR contact page (pre-rebrand)
   Visual: rebrand contact.tsx layout
   ───────────────────────────────────────────────────────────────── */

export default function ContactPage() {
  return (
    <section style={{ padding: 'clamp(5rem,8vw,8rem) 1.5rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header — ORIGINAL OAR COPY */}
        <div style={{ marginBottom: 'clamp(3rem,6vw,4rem)', textAlign: 'center' }}>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2.25rem,5vw,3.75rem)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--primary)', marginBottom: '1.5rem' }}>
            Contact Ontario Accident Review
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--muted)', maxWidth: 580, margin: '0 auto', lineHeight: 1.65 }}>
            Have a question before starting your review? Reach out using any of the options below. For the fastest response, use our online review form — it takes about two minutes and lets us assess your situation right away.
          </p>
        </div>

        {/* Cards — rebrand visual (2-col, p-8 border bg-card, icon boxes) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

          {/* Start Review card — ORIGINAL OAR COPY */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(138,90,26,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 400 }}>Start your free review</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem', flex: 1, lineHeight: 1.65, fontSize: '0.95rem' }}>
              The fastest way to get a response is to complete our short online review form. It takes about two minutes and helps us understand your situation before we reach out.
            </p>
            <Link href="/#intake" style={{ display: 'inline-flex', height: 48, alignItems: 'center', padding: '0 1.5rem', background: 'var(--primary)', color: '#fff', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', alignSelf: 'flex-start' }}>
              Begin Free Review
            </Link>
          </div>

          {/* Email card — ORIGINAL OAR COPY */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(13,27,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 400 }}>Get in touch</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem', flex: 1, lineHeight: 1.65, fontSize: '0.95rem' }}>
              Email: <a href="mailto:info@ontarioaccidentreview.ca" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>info@ontarioaccidentreview.ca</a>
              <br />Online review form available 24/7.
            </p>
            <a href="mailto:info@ontarioaccidentreview.ca" style={{ display: 'inline-flex', height: 48, alignItems: 'center', padding: '0 1.5rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-strong)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', alignSelf: 'flex-start' }}>
              info@ontarioaccidentreview.ca
            </a>
          </div>
        </div>

        {/* Important notice — ORIGINAL OAR COPY, rebrand muted bg block style */}
        <div style={{ padding: '2rem', background: 'rgba(214,220,230,0.3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <svg style={{ flexShrink: 0, marginTop: '0.125rem', color: 'var(--accent)' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
          </svg>
          <div>
            <h3 className="font-serif" style={{ fontSize: '1.125rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 400 }}>Important notice</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
              Ontario Accident Review is not a law firm and does not provide legal advice. If you have an urgent legal deadline or limitation period concern, please contact a licensed Ontario lawyer directly.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.65 }}>
              Do not send sensitive personal, financial, or insurance details by email — our review form is the appropriate channel for submitting your information securely.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
