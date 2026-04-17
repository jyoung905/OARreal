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
          <a className="button button-secondary" href="#intake" style={{
            background: "linear-gradient(135deg, #3730A3, #5B4FE1)",
            border: "none",
            padding: "0.55rem 1rem",
            fontSize: "0.88rem"
          }}>
            Start my free review →
          </a>
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
