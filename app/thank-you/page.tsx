import Link from 'next/link';
import TrackLead from '@/components/TrackLead';

export const metadata = {
  title: 'Request received | Ontario Accident Review',
  description: 'Your free Ontario Accident Review request was received. Our team will review your situation and follow up shortly.',
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    n: '1',
    icon: 'doc',
    title: 'Review submitted information',
    body: 'We carefully review the details you provided.',
  },
  {
    n: '2',
    icon: 'scale',
    title: 'We assess your situation',
    body: 'We look at possible benefits, deadlines, and next steps.',
  },
  {
    n: '3',
    icon: 'mail',
    title: 'You receive a practical follow-up',
    body: 'Our team will contact you with clear, personalized next steps.',
  },
];

const HELPFUL_RESOURCES = [
  { href: '/blog/ontario-sabs-explained',                 label: 'Understanding Accident Benefits in Ontario' },
  { href: '/blog/ontario-accident-deadlines',             label: 'Important deadlines you should know' },
  { href: '/blog/income-replacement-rehab-benefits-ontario', label: 'What to do after an accident' },
];

function Icn({ name, size = 18, color = 'currentColor' }: { name: string; size?: number; color?: string }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'doc':   return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case 'scale': return <svg {...props}><path d="M12 3v18M5 7h14M5 7l-3 9a4 4 0 0 0 6 0zM19 7l3 9a4 4 0 0 1-6 0z"/></svg>;
    case 'mail':  return <svg {...props}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></svg>;
    case 'check': return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case 'shield':return <svg {...props}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/></svg>;
    case 'arrow-right': return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case 'home':  return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
    case 'restart': return <svg {...props}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
    case 'book':  return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/></svg>;
    case 'calendar': return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case 'user':  return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
    case 'car':   return <svg {...props}><path d="M5 17h14M3 17V11l2-5h14l2 5v6"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
    case 'umbrella': return <svg {...props}><path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z"/><path d="M12 12v7a3 3 0 0 1-6 0"/></svg>;
    case 'arrow-down': return <svg {...props}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
    default: return null;
  }
}

function generateRefNumber() {
  // Stable on server render — based on date for SSR-safe randomness.
  // Real prod would receive this from /api/intake response.
  const now = new Date();
  const datePart = `${now.getMonth() + 1}${now.getDate()}`;
  const rand = (Math.random() + 1).toString(36).slice(2, 6).toUpperCase();
  return `OAR-${datePart}-${rand}`;
}

export default function ThankYouPage() {
  const ref = generateRefNumber();

  return (
    <>
      <TrackLead />
      <div style={{ background: 'var(--bg)', minHeight: '60vh' }}>
        <section style={{ padding: 'clamp(2.5rem, 5vw, 4.5rem) 1.5rem' }}>
          <div className="oar-container-wide" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'flex-start' }} >
            {/* Left: confirmation */}
            <div className="oar-thanks-left">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.95rem', borderRadius: 'var(--radius-full)', background: 'var(--green-soft)', color: 'var(--green-strong)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                <Icn name="check" size={14} />
                Request received
              </div>

              <h1 className="oar-h1" style={{ marginTop: 0, marginBottom: '1.25rem' }}>
                Thank you &mdash; your<br/>request is in.
              </h1>

              <p className="oar-lead" style={{ marginTop: 0, marginBottom: '1rem' }}>
                We&rsquo;ve received your information and our team will review it shortly.
              </p>

              <p className="oar-body-lg" style={{ marginTop: 0, marginBottom: '2rem', maxWidth: 540 }}>
                This is a free, private review. We will assess possible benefits, deadlines, and next steps for your situation.
              </p>

              <div className="oar-disclaimer" style={{ marginBottom: '2.5rem', maxWidth: 580 }}>
                <span className="oar-disclaimer-icon">
                  <Icn name="shield" size={16} />
                </span>
                <span>
                  Ontario Accident Review is not a law firm and does not provide legal advice or create a lawyer&ndash;client relationship.
                </span>
              </div>

              {/* What happens next */}
              <div className="oar-card oar-card-elevated" style={{ background: 'var(--surface)', padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 500, marginTop: 0, marginBottom: '1.5rem' }}>
                  What happens next
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem 1rem' }}>
                  {STEPS.map((s, i) => (
                    <div key={s.n} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                      <span style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--accent-soft)', color: 'var(--accent)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                      }}>{s.n}</span>
                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                          <Icn name={s.icon} size={14} color="var(--accent)" />
                        </span>
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--primary)', fontSize: '0.875rem' }}>{s.title}</p>
                        <p style={{ margin: '0.25rem 0 0', color: 'var(--muted)', fontSize: '0.825rem', lineHeight: 1.55 }}>{s.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
                <Link href="/resources" className="oar-btn oar-btn-primary">
                  <Icn name="book" size={14} /> Browse resources
                </Link>
                <Link href="/" className="oar-btn oar-btn-secondary">
                  <Icn name="restart" size={14} /> Start another review
                </Link>
                <Link href="/" className="oar-btn oar-btn-ghost" style={{ height: 52 }}>
                  Return home <Icn name="arrow-right" size={14} />
                </Link>
              </div>
            </div>

            {/* Right: summary */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="oar-card oar-card-elevated" style={{ background: 'var(--surface)', padding: '1.75rem 1.875rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 500, marginTop: 0, marginBottom: '1rem' }}>
                  Your request summary
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'var(--green-soft)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--green-strong)', fontWeight: 500, fontSize: '0.875rem' }}>
                    <Icn name="shield" size={14} /> Reference number
                  </span>
                  <code style={{ background: 'var(--surface)', padding: '0.3rem 0.625rem', borderRadius: 'var(--radius-sm)', color: 'var(--green-strong)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.04em' }}>
                    {ref}
                  </code>
                </div>

                <p style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', fontWeight: 500, marginTop: '1rem', marginBottom: '0.75rem' }}>What you submitted</p>
                <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', margin: 0 }}>
                  {[
                    { icon: 'calendar', label: 'Submitted', value: 'Just now' },
                    { icon: 'user',     label: 'Coverage applied for', value: 'Accident benefits' },
                    { icon: 'car',      label: 'Accident type', value: 'Motor vehicle accident' },
                    { icon: 'umbrella', label: 'Status',       value: 'Awaiting review' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: '1px solid var(--border-soft)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.875rem' }}>
                        <Icn name={row.icon} size={14} /> {row.label}
                      </span>
                      <span style={{ color: 'var(--text-strong)', fontSize: '0.875rem', fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="oar-card oar-card-elevated" style={{ background: 'var(--surface)', padding: '1.5rem 1.625rem' }}>
                <p style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 500, marginTop: 0, marginBottom: '1rem' }}>Helpful resources while you wait</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {HELPFUL_RESOURCES.map(r => (
                    <Link key={r.href} href={r.href} style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem',
                      padding: '0.75rem 0.875rem', borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg)', textDecoration: 'none',
                      color: 'var(--text-strong)',
                    }}>
                      <span style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icn name="book" size={14} />
                      </span>
                      <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{r.label}</span>
                      <Icn name="arrow-right" size={14} color="var(--accent)" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Time-sensitive notice */}
              <div style={{ background: 'var(--amber-soft)', border: '1px solid rgba(185, 127, 31, 0.28)', borderRadius: 'var(--radius-md)', padding: '1.125rem 1.375rem' }}>
                <p style={{ fontWeight: 600, color: 'var(--amber-strong)', fontSize: '0.9rem', margin: '0 0 0.4rem' }}>If your matter may be time-sensitive</p>
                <p style={{ color: 'var(--amber-strong)', fontSize: '0.825rem', lineHeight: 1.6, margin: 0 }}>
                  Ontario accident claims can involve deadlines for notifying your insurer and filing applications. If you believe a deadline is urgent, please don&rsquo;t wait &mdash; speak with a qualified legal professional promptly.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .oar-thanks-left + aside { order: -1; }
          section > .oar-container-wide { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
