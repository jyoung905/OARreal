import Link from 'next/link';

export const metadata = {
  title: 'About',
  description: 'About Ontario Accident Review — independent, plain-language guidance for Ontario accident benefits.',
};

const VALUES = [
  { icon: 'shield', title: 'Not affiliated with insurers or government', body: 'We are not a law firm, insurer, or government service. Our role is to provide general claim-navigation information and possible next steps.' },
  { icon: 'leaf',   title: 'Ontario-focused', body: "We work exclusively with Ontario claims and Ontario's Statutory Accident Benefits Schedule." },
  { icon: 'chat',   title: 'Plain language', body: 'No jargon. We explain benefits, deadlines, and processes in language anyone can understand.' },
  { icon: 'lock',   title: 'Private', body: 'Your information is submitted through a secure form, never sold, and only shared with a qualified professional or relevant provider with your consent or as described in our Privacy Policy.' },
];

function I({ name, color = 'currentColor' }) {
  const props = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'shield': return <svg {...props}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/></svg>;
    case 'leaf':   return <svg {...props}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>;
    case 'chat':   return <svg {...props}><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>;
    case 'lock':   return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    default: return null;
  }
}

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--bg)' }}>
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 1.5rem' }}>
        <div className="oar-container-narrow">
          <div className="oar-eyebrow" style={{ marginBottom: '1rem' }}>About us</div>
          <h1 className="oar-h1" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', marginTop: 0, marginBottom: '1.25rem' }}>
            A calm first step after an Ontario accident.
          </h1>
          <p className="oar-lead" style={{ marginTop: 0, marginBottom: '1rem' }}>
            We help people understand their accident benefits, deadlines, and next steps &mdash; without pressure.
          </p>
          <p className="oar-body-lg" style={{ maxWidth: 720 }}>
            Ontario Accident Review is an independent claim-navigation service. Our reviews are free, private, and built around clarity. We are not a law firm, and we do not provide legal advice. We help you make sense of a confusing system so you can make informed decisions about your recovery.
          </p>
        </div>
      </section>

      <section style={{ padding: 'clamp(2rem, 5vw, 4rem) 1.5rem', borderTop: '1px solid var(--border-soft)', background: 'var(--surface)' }}>
        <div className="oar-container">
          <h2 className="oar-h2" style={{ marginTop: 0, marginBottom: '2rem' }}>What we stand for</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {VALUES.map(v => (
              <div key={v.title} className="oar-card" style={{ background: 'var(--bg)', border: '1px solid var(--border-soft)' }}>
                <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
                  <I name={v.icon} />
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.15rem', fontWeight: 500, marginTop: 0, marginBottom: '0.5rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem' }}>
        <div className="oar-container-narrow oar-card oar-card-elevated" style={{ background: 'var(--surface)', textAlign: 'center', padding: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
          <h2 className="oar-h3" style={{ marginTop: 0, marginBottom: '0.625rem' }}>Have a quick question?</h2>
          <p style={{ color: 'var(--muted)', marginTop: 0, marginBottom: '1.5rem' }}>Email is the fastest way to reach the team.</p>
          <Link href="/contact" className="oar-btn oar-btn-primary">Contact us</Link>
        </div>
      </section>
    </main>
  );
}
