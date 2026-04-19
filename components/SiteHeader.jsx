import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { site } from '@/lib/site';

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
          <Link className="button button-secondary" href="/review">
            Start Your Review
          </Link>
        </div>
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
