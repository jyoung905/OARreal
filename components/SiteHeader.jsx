'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

/* ─────────────────────────────────────────────────────────────────
   SiteHeader — Rebrand visual port
   Matches: /Desktop/.openclaw/web/src/components/layout.tsx header
   h-20, sticky, backdrop-blur, serif brand name, nav links, CTA
   ───────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/about',      label: 'About Us' },
  { href: '/resources',  label: 'Resources' },
  { href: '/contact',    label: 'Contact' },
];

const headerStyle = {
  position: 'sticky', top: 0, zIndex: 50, width: '100%',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
  background: 'rgba(247,246,243,0.95)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
};

const innerStyle = {
  maxWidth: 1200, margin: '0 auto',
  padding: '0 1.5rem',
  height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        {/* Brand name — matches rebrand: font-serif two-line Ontario / Accident Review */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', color: 'var(--primary)', letterSpacing: '-0.01em' }}>Ontario</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', color: 'var(--accent)', letterSpacing: '-0.01em' }}>Accident Review</span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.875rem', fontWeight: 500 }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                textDecoration: 'none',
                color: pathname === href ? 'var(--primary)' : 'var(--muted)',
                transition: 'color 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseOut={e => e.currentTarget.style.color = pathname === href ? 'var(--primary)' : 'var(--muted)'}
              className="desktop-only"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile burger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="#intake"
            className="desktop-only"
            style={{
              display: 'inline-flex', height: 40, alignItems: 'center',
              padding: '0 1.5rem', background: 'var(--primary)',
              color: '#fff', fontSize: '0.875rem', fontWeight: 500,
              textDecoration: 'none', transition: 'background 0.15s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--primary-strong)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--primary)'}
          >
            Start Free Review
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: 5 }}
            className="mobile-only"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2, background: 'var(--primary)',
                borderRadius: 2, transition: 'all 0.2s',
                transform: open ? (i === 0 ? 'translateY(7px) rotate(45deg)' : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none') : 'none',
                opacity: open && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav style={{
          background: 'var(--surface)', borderTop: '1px solid var(--border)',
          padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{ color: 'var(--text-strong)', fontWeight: 500, textDecoration: 'none' }}>{label}</Link>
          ))}
          <a
            href="#intake"
            onClick={() => setOpen(false)}
            style={{
              display: 'inline-flex', height: 44, alignItems: 'center', justifyContent: 'center',
              background: 'var(--primary)', color: '#fff', fontWeight: 500,
              textDecoration: 'none', marginTop: '0.5rem',
            }}
          >
            Start Free Review
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
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', color: 'var(--primary)' }}>Ontario</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', color: 'var(--accent)' }}>Accident Review</span>
        </Link>
        <Link href="/" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}>← Back to home</Link>
      </div>
    </header>
  );
}
