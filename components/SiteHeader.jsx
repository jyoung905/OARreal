'use client';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { site } from '@/lib/site';

function openIntake() {
  window.dispatchEvent(new Event('open-intake'));
}

export function SiteHeader() {
  return (
    <header className="site-header premium-site-header">
      <div className="container nav">
        <Logo />
        <div className="nav-actions desktop-only">
          {site.navLinks.map((link) => (
            <a key={link.href} className="text-link" href={link.href}>
              {link.label}
            </a>
          ))}
          <button className="button button-secondary nav-cta" onClick={openIntake}>
            Start Your Review
          </button>
        </div>
        <button className="button button-secondary nav-cta mobile-only" onClick={openIntake}>
          Start Your Review
        </button>
      </div>
    </header>
  );
}

export function SimpleHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Logo />
        <Link className="text-link" href="/">
          Back to home
        </Link>
      </div>
    </header>
  );
}
