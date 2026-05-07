import Link from 'next/link';

export const metadata = {
  title: 'Contact',
  description: "Get in touch with Ontario Accident Review. We're here to help with your initial accident review inquiry.",
};

export default function ContactPage() {
  return (
    <main style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 1.5rem clamp(2rem, 3vw, 2.5rem)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="oar-container-narrow" style={{ textAlign: 'center' }}>
          <div className="oar-eyebrow" style={{ marginBottom: '1rem' }}>Contact</div>
          <h1 className="oar-h1" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', marginTop: 0, marginBottom: '1.25rem' }}>
            Contact Ontario Accident Review
          </h1>
          <p className="oar-body-lg" style={{ maxWidth: 640, margin: '0 auto' }}>
            Have a question before starting your review? Use the options below. The fastest response comes from our short online review &mdash; about two minutes and we&rsquo;ll have what we need to follow up.
          </p>
        </div>
      </section>

      <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem' }}>
        <div className="oar-container-narrow">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="oar-card oar-card-elevated" style={{ background: 'var(--surface)' }}>
              <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
              </span>
              <h2 className="oar-h3" style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '0.5rem' }}>Start your free review</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.65, marginTop: 0, marginBottom: '1.25rem', fontSize: '0.93rem' }}>
                The fastest path to a real answer. Two minutes, plain language, no obligation, no documents needed.
              </p>
              <Link href="/#intake" className="oar-btn oar-btn-primary">
                Begin free review
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>

            <div className="oar-card oar-card-elevated" style={{ background: 'var(--surface)' }}>
              <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--green-soft)', color: 'var(--green-strong)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
              </span>
              <h2 className="oar-h3" style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '0.5rem' }}>Email us</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.65, marginTop: 0, marginBottom: '1.25rem', fontSize: '0.93rem' }}>
                For non-urgent questions you can reach us by email. Our review form is online 24/7.
              </p>
              <a href="mailto:hello@ontarioaccidentreview.ca" className="oar-btn oar-btn-secondary">
                hello@ontarioaccidentreview.ca
              </a>
            </div>
          </div>

          <div className="oar-disclaimer">
            <span className="oar-disclaimer-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><polyline points="9 12 11 14 15 10"/></svg>
            </span>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--primary)', margin: '0 0 0.4rem', fontSize: '0.95rem' }}>Important notice</p>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Ontario Accident Review is not a law firm and does not provide legal advice. If you have an urgent legal deadline or limitation period concern, please contact a licensed Ontario lawyer directly.
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>
                Don&rsquo;t send sensitive personal, financial, or insurance details by email &mdash; the review form is the appropriate channel for submitting your information securely.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
