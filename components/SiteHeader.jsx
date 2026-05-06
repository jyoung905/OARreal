'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Analytics } from '@/lib/analytics';

function trackHeaderCta(location) {
  Analytics.ctaClick({ cta_text: 'Start My Free Review', cta_location: location });
  Analytics.intakeStart({ trigger: location });
}

const NAV_LINKS = [
  { href: '/', label: 'Home', match: '/' },
  { href: '/#how-it-works', label: 'How it works', match: '#how-it-works' },
  { href: '/#who-this-is-for', label: 'Who this is for', match: '#who-this-is-for' },
  { href: '/#faq', label: 'FAQ', match: '#faq' },
  { href: '/resources', label: 'Resources', match: '/resources' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="oar-site-header">
      <div className="oar-site-header-inner">
        <Link href="/" className="oar-wordmark" style={{ fontSize: '1.9rem', textDecoration: 'none' }}>
          Ontario Accident Review
        </Link>

        <nav className="oar-nav" aria-label="Primary navigation">
          {NAV_LINKS.map(({ href, label, match }) => (
            <Link key={href} href={href} className={pathname === match ? 'is-active' : ''}>{label}</Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/#intake" className="oar-header-cta" onClick={() => trackHeaderCta('header')}>
            Start My Free Review
          </a>
          <button className="oar-mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
            <span className="material-symbols-outlined" style={{ fontSize: 32 }}>{open ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="oar-mobile-menu" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <a href="/#intake" className="oar-mobile-menu-cta" onClick={() => { setOpen(false); trackHeaderCta('mobile_menu'); }}>
            Start My Free Review
          </a>
        </nav>
      )}
    </header>
  );
}

export function SimpleHeader() {
  return (
    <header className="oar-site-header">
      <div className="oar-site-header-inner">
        <Link href="/" className="oar-wordmark" style={{ fontSize: '1.9rem', textDecoration: 'none' }}>
          Ontario Accident Review
        </Link>
        <Link href="/" className="oar-link-cta">Return home <span className="material-symbols-outlined">arrow_forward</span></Link>
      </div>
    </header>
  );
}
