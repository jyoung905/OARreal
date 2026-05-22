'use client';
import Link from 'next/link';

/* ─────────────────────────────────────────────────────────────────
   SiteFooter — Rebrand 2026
   Top: "You're in good hands" trust band (matches mockup #8)
   Mid: "Not a law firm" disclaimer card with gold shield
   Btm: Navigate / Resources / Company links + Questions card
   ───────────────────────────────────────────────────────────────── */

const TRUST_CARDS = [
  {
    icon: 'shield',
    title: 'Private & confidential',
    body: 'Your information is submitted through a secure form. We do not sell it, and we only share it with a qualified professional or relevant provider with your consent or as described in our Privacy Policy.',
    color: 'blue',
  },
  {
    icon: 'ontario',
    title: 'Ontario-focused',
    body: "We understand Ontario's accident benefits system and deadlines.",
    color: 'green',
  },
  {
    icon: 'chat',
    title: 'Clear plain-language guidance',
    body: 'We break things down simply so you can make confident decisions.',
    color: 'blue',
  },
  {
    icon: 'person',
    title: 'No obligation',
    body: "Get straight answers. There's no pressure to proceed.",
    color: 'green',
  },
];

const FAQ_TEASERS = [
  { q: 'Is this free?',                a: 'Yes — the review is free and there is no obligation to proceed.' },
  { q: 'Do I need my policy number?',  a: 'No. You can start without a policy number, claim number, or any uploads.' },
  { q: 'Will my insurer be notified?', a: 'No. Ontario Accident Review is not connected to your insurer.' },
];

function TrustIcon({ name, color }) {
  const stroke = color === 'green' ? 'var(--green-strong)' : 'var(--accent)';
  const bg = color === 'green' ? 'var(--green-soft)' : 'var(--accent-soft)';
  const common = { width: 22, height: 22, fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <span style={{
      width: 48, height: 48, borderRadius: 'var(--radius-md)',
      background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 24 24" {...common}>
        {name === 'shield' && <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/>}
        {name === 'chat' && <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>}
        {name === 'person' && (
          <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
          </>
        )}
        {name === 'ontario' && (
          <path d="M5 8c1-2 2-3 4-3l3 1 3-1c2 0 3 1 4 3l1 4c0 2-1 4-2 5l-3 2-3 2-3-2-3-2c-1-1-2-3-2-5z" />
        )}
      </svg>
    </span>
  );
}

function FAQRow({ q, a, idx }) {
  return (
    <details style={{
      borderBottom: idx < 2 ? '1px solid var(--border-soft)' : 'none',
      padding: '1rem 0',
    }}>
      <summary style={{
        listStyle: 'none', cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: '1rem', fontWeight: 500, color: 'var(--primary)', fontSize: '0.95rem',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{
            width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-soft)',
            color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700,
          }}>?</span>
          {q}
        </span>
        <span style={{ color: 'var(--accent)', fontSize: '1.25rem', lineHeight: 1, fontWeight: 300 }}>+</span>
      </summary>
      <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.65, marginTop: '0.625rem', marginBottom: 0 }}>{a}</p>
    </details>
  );
}

export function SiteFooter() {
  return (
    <>
      {/* ── "You're in good hands" trust band ── */}
      <section style={{ background: 'var(--bg)', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem', borderTop: '1px solid var(--border-soft)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.8fr)', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'start' }} className="oar-trust-grid">
            <div>
              <div className="oar-eyebrow" style={{ marginBottom: '1rem' }}>You&rsquo;re in good hands</div>
              <h2 className="oar-h2" style={{ marginBottom: '2rem' }}>
                Built on trust. Focused on you.
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {TRUST_CARDS.map(card => (
                  <div key={card.title} className="oar-card oar-card-tight" style={{ background: 'var(--surface)' }}>
                    <TrustIcon name={card.icon} color={card.color} />
                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 500, margin: '0.875rem 0 0.4rem' }}>
                      {card.title}
                    </h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ teaser */}
            <div className="oar-card oar-card-elevated" style={{ background: 'var(--surface)', padding: '1.75rem 1.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 500, margin: 0 }}>
                  Frequently asked questions
                </h3>
                <Link href="/#faq" style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  View all FAQ →
                </Link>
              </div>
              {FAQ_TEASERS.map((row, i) => <FAQRow key={i} q={row.q} a={row.a} idx={i} />)}
            </div>
          </div>

          {/* Disclaimer band */}
          <div style={{
            marginTop: 'clamp(2rem, 4vw, 3rem)',
            background: 'var(--gold-soft)',
            border: '1px solid rgba(180, 139, 65, 0.28)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.25rem)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2.4fr) minmax(0, 1fr)',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
            alignItems: 'center',
          }} className="oar-disclaimer-grid">
            <div style={{ display: 'flex', gap: '1.125rem', alignItems: 'flex-start' }}>
              <span style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: 'rgba(180, 139, 65, 0.22)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-strong)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/>
                </svg>
              </span>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.125rem', fontWeight: 500, margin: '0 0 0.5rem' }}>
                  Ontario Accident Review is not a law firm and does not provide legal advice.
                </p>
                <p style={{ color: 'var(--gold-strong)', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>
                  Our website provides general informational and claim-navigation content only. It is not legal advice and should not be relied on as a substitute for advice from a qualified legal professional. Every claim is unique and outcomes can vary.
                </p>
              </div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(180, 139, 65, 0.32)', paddingLeft: 'clamp(1.25rem, 3vw, 2rem)' }}>
              <p style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem', marginTop: 0, marginBottom: '0.5rem' }}>Need legal advice?</p>
              <p style={{ color: 'var(--gold-strong)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: 0, marginBottom: '0.75rem' }}>
                If you require legal advice, we may help connect you with a licensed professional after you consent to that referral.
              </p>
              <Link href="/contact" style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                Learn more about your options →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer proper ── */}
      <footer style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--border-soft)', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) repeat(3, minmax(0, 1fr)) minmax(0, 1.2fr)', gap: '2.5rem', marginBottom: '3rem' }} className="oar-footer-cols">
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.4rem', color: 'var(--primary)', letterSpacing: '-0.01em', display: 'block', marginBottom: '1rem' }}>
                Ontario Accident Review
              </span>
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.7, marginTop: 0, marginBottom: '1.25rem', maxWidth: 320 }}>
                Helping Ontario residents understand their accident benefits, deadlines, and next steps with clear, confidential guidance.
              </p>
              <a href="mailto:hello@ontarioaccidentreview.ca" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                hello@ontarioaccidentreview.ca
              </a>
              <div style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/></svg>
                Secure. Private. Ontario-focused.
              </div>
            </div>

            <FooterCol title="Navigate" links={[
              { href: '/',                   label: 'Home' },
              { href: '/#how-it-works',      label: 'How it works' },
              { href: '/#who-this-is-for',   label: 'Who this is for' },
              { href: '/#faq',               label: 'FAQ' },
              { href: '/#intake',            label: 'Start a private review' },
            ]} />

            <FooterCol title="Resources" links={[
              { href: '/resources',                                          label: 'All resources' },
              { href: '/blog/ontario-sabs-explained',                        label: 'Accident benefits overview' },
              { href: '/blog/ontario-accident-deadlines',                    label: 'Important deadlines' },
              { href: '/blog/income-replacement-rehab-benefits-ontario',     label: 'Types of benefits' },
              { href: '/blog/should-you-accept-first-settlement-offer',     label: 'Helpful guides' },
            ]} />

            <FooterCol title="Company" links={[
              { href: '/about',   label: 'About us' },
              { href: '/contact', label: 'Contact us' },
              { href: '/privacy', label: 'Privacy' },
            ]} />

            {/* Questions card */}
            <div className="oar-card" style={{ background: 'var(--surface)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <span style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4h-1l-3 3v-3H7a4 4 0 0 1-4-4v-3z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/></svg>
                </span>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 500, margin: 0 }}>
                    Questions?
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0.15rem 0 0' }}>
                    We&rsquo;re here to help.
                  </p>
                </div>
              </div>
              <Link href="/contact" className="oar-btn oar-btn-secondary oar-btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
                Contact us
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            paddingTop: '1.5rem', borderTop: '1px solid var(--border)',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
            alignItems: 'center', gap: '1rem 1.5rem',
            fontSize: '0.8rem', color: 'var(--muted)',
          }}>
            <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Ontario Accident Review. All rights reserved.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
              <Link href="/privacy" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Privacy Policy</Link>
              <span style={{ color: 'var(--border-strong)' }}>|</span>
              <Link href="/terms-of-service" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Terms of Service</Link>
              <span style={{ color: 'var(--border-strong)' }}>|</span>
              <Link href="/disclaimer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Disclaimer</Link>
              <span style={{ color: 'var(--border-strong)' }}>|</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8c1-2 2-3 4-3l3 1 3-1c2 0 3 1 4 3l1 4c0 2-1 4-2 5l-3 2-3 2-3-2-3-2c-1-1-2-3-2-5z"/></svg>
                Ontario-focused
              </span>
              <span style={{ color: 'var(--border-strong)' }}>|</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secure form
              </span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 920px) {
          .oar-trust-grid { grid-template-columns: 1fr !important; }
          .oar-disclaimer-grid { grid-template-columns: 1fr !important; }
          .oar-disclaimer-grid > div:last-child { border-left: none !important; padding-left: 0 !important; border-top: 1px solid rgba(180, 139, 65, 0.32); padding-top: 1.25rem !important; }
        }
        @media (max-width: 1080px) {
          .oar-footer-cols { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 540px) {
          .oar-footer-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1rem', color: 'var(--primary)', marginTop: 0, marginBottom: '1rem' }}>
        {title}
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} style={{ color: 'var(--muted)', fontSize: '0.875rem', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
