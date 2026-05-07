'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Analytics } from '@/lib/analytics';

/* ─────────────────────────────────────────────────────────────────
   SiteHeader — Rebrand 2026
   Matches mockup #1/#2/#3: serif inline brand, light cream nav,
   underlined active link, blue pill CTA "Start My Free Review".
   ───────────────────────────────────────────────────────────────── */

function trackHeaderCta(location) {
  Analytics.ctaClick({ cta_text: 'Start My Free Review', cta_location: location });
  Analytics.intakeStart({ trigger: location });
}

const NAV_LINKS = [
  { href: '/',                 label: 'Home', match: '/' },
  { href: '/#how-it-works',    label: 'How it works', match: '#how-it-works' },
  { href: '/#who-this-is-for', label: 'Who this is for', match: '#who-this-is-for' },
  { href: '/#faq',             label: 'FAQ', match: '#faq' },
  { href: '/resources',        label: 'Resources', match: '/resources' },
];

const headerStyle = {
  position: 'sticky', top: 0, zIndex: 50, width: '100%',
  borderBottom: '1px solid var(--border-soft)',
  background: 'rgba(250, 246, 239, 0.92)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
};

const innerStyle = {
  maxWidth: 1320, margin: '0 auto',
  padding: '0 1.5rem',
  height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: '1.5rem',
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const updateHash = () => setHash(typeof window !== 'undefined' ? window.location.hash : '');
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  const isActive = (link) => {
    if (link.href === '/' && pathname === '/' && !hash) return true;
    if (link.href.startsWith('/#') && pathname === '/' && hash === link.match) return true;
    if (link.href === '/resources' && pathname?.startsWith('/resources')) return true;
    if (link.href === pathname) return true;
    return false;
  };

  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        {/* Brand — serif single line "Ontario Accident Review" */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 'clamp(1.15rem, 1.6vw, 1.45rem)',
            color: 'var(--primary)',
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}>
            Ontario Accident Review
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2.25rem', fontSize: '0.9rem', fontWeight: 500 }}>
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: 'none',
                  color: active ? 'var(--accent)' : 'var(--text-strong)',
                  fontWeight: active ? 600 : 500,
                  paddingBottom: 4,
                  borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseOver={e => { if (!active) e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseOut={e => { if (!active) e.currentTarget.style.color = 'var(--text-strong)'; }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + mobile burger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="/#intake"
            className="desktop-only oar-btn oar-btn-primary oar-btn-sm"
            onClick={() => trackHeaderCta('header')}
            style={{ height: 44, padding: '0 1.25rem' }}
          >
            Start My Free Review
          </a>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="mobile-only"
            style={{
              background: 'none', border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              width: 44, height: 44, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="mobile-only" style={{
          background: 'var(--surface)', borderTop: '1px solid var(--border)',
          padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem',
        }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ color: 'var(--text-strong)', fontWeight: 500, textDecoration: 'none', padding: '0.5rem 0' }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/#intake"
            onClick={() => { setOpen(false); trackHeaderCta('mobile_menu'); }}
            className="oar-btn oar-btn-primary"
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            Start My Free Review
          </a>
        </nav>
      )}
    </header>
  );
}

export function SimpleHeader() {
  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.35rem', color: 'var(--primary)', letterSpacing: '-0.01em' }}>
            Ontario Accident Review
          </span>
        </Link>
        <Link href="/" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}>← Back to home</Link>
      </div>
    </header>
  );
}
