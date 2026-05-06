'use client';
import Link from 'next/link';

const TRUST = [
  { icon: 'admin_panel_settings', title: 'Private & confidential', body: 'Your information is used for your review request.' },
  { icon: 'map', title: 'Ontario-focused', body: 'Built around Ontario accident benefits and deadlines.' },
  { icon: 'chat_bubble', title: 'Clear plain-language guidance', body: 'We break things down simply.' },
  { icon: 'person', title: 'No obligation', body: 'There is no pressure to proceed.' },
];

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#who-this-is-for', label: 'Who this is for' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#intake', label: 'Start My Free Review' },
];

const RESOURCES = [
  { href: '/resources', label: 'Helpful resources' },
  { href: '/blog/ontario-sabs-explained', label: 'Accident benefits overview' },
  { href: '/blog/ontario-accident-deadlines', label: 'Important deadlines' },
  { href: '/blog/income-replacement-rehab-benefits-ontario', label: 'Types of benefits' },
  { href: '/income-replacement-denied', label: 'Denials and delays' },
];

export function SiteFooter() {
  return (
    <footer className="oar-site-footer">
      <div className="oar-container oar-footer-trust-band">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(340px, .55fr)', gap: '2rem', alignItems: 'start', marginBottom: '2rem' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 900, letterSpacing: '.14em', fontSize: '.78rem', textTransform: 'uppercase', marginBottom: '1rem' }}>You’re in good hands</div>
            <h2 className="oar-display oar-h3">Built on trust. Focused on you.</h2>
            <div className="oar-grid-4" style={{ marginTop: '1.6rem' }}>
              {TRUST.map(item => (
                <div className="oar-feature-card oar-card" style={{ minHeight: 190 }} key={item.title}>
                  <span className="oar-icon blue"><span className="material-symbols-outlined">{item.icon}</span></span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="oar-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.25rem' }}>Frequently asked questions</h3>
              <Link href="/#faq" className="oar-link-cta" style={{ minHeight: 36 }}>View FAQ <span className="material-symbols-outlined">arrow_forward</span></Link>
            </div>
            {['Is this free?', 'Do I need my policy number?', 'Will my insurer be notified?'].map((q, i) => (
              <div key={q} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1.1rem 0', borderTop: i ? '1px solid var(--border)' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem' }}><span className="oar-icon blue"><span className="material-symbols-outlined">{['attach_money','article','notifications'][i]}</span></span><strong style={{ color: 'var(--primary)' }}>{q}</strong></div>
                <span className="material-symbols-outlined" style={{ color: 'var(--blue)' }}>add</span>
              </div>
            ))}
          </div>
        </div>

        <div className="oar-disclaimer-panel">
          <span className="oar-icon gold" style={{ width: 58, height: 58, borderRadius: 18 }}><span className="material-symbols-outlined" style={{ fontSize: 32 }}>shield</span></span>
          <div>
            <strong style={{ display: 'block', fontSize: '1.08rem', marginBottom: '.35rem' }}>Ontario Accident Review is not a law firm and does not provide legal advice.</strong>
            <span style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Our website provides general informational and claim-navigation content only. It is not legal advice and should not be relied on as a substitute for advice from a qualified legal professional. Every claim is unique and outcomes can vary.</span>
          </div>
          <div style={{ borderLeft: '1px solid rgba(182,135,69,.25)', paddingLeft: '1.25rem' }}>
            <strong style={{ display: 'block', marginBottom: '.35rem' }}>Need legal advice?</strong>
            <span style={{ color: 'var(--muted)' }}>Speak with a licensed professional.</span>
          </div>
        </div>
      </div>

      <div className="oar-container oar-footer-main">
        <div>
          <h3 className="oar-wordmark" style={{ fontSize: '2rem' }}>Ontario Accident Review</h3>
          <p style={{ lineHeight: 1.65, maxWidth: 420 }}>Helping Ontario residents understand accident benefits, deadlines, and next steps with clear, confidential guidance.</p>
          <p style={{ marginTop: '1rem', color: 'var(--blue)', fontWeight: 800 }}>hello@ontarioaccidentreview.ca</p>
        </div>
        <div><h4>Navigate</h4><div className="oar-footer-links">{NAV.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div></div>
        <div><h4>Resources</h4><div className="oar-footer-links">{RESOURCES.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div></div>
        <div>
          <h4>Company</h4>
          <div className="oar-footer-links"><Link href="/contact">Contact us</Link><Link href="/privacy">Privacy Policy</Link><Link href="/terms-of-service">Terms of Service</Link><Link href="/disclaimer">Disclaimer</Link></div>
          <div className="oar-help-card" style={{ marginTop: '1.25rem' }}><strong style={{ color: 'var(--primary)' }}>Questions?</strong><p style={{ margin: '.3rem 0 0' }}>We’re here to help.</p></div>
        </div>
      </div>

      <div className="oar-container oar-footer-bottom">
        <span>© {new Date().getFullYear()} Ontario Accident Review. All rights reserved.</span>
        <span>Ontario-focused • Secure • Private</span>
      </div>
    </footer>
  );
}
