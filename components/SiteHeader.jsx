import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="stitch-header">
      <div className="stitch-nav">
        <Link href="/" className="stitch-brand" aria-label={site.name}>
          <Image
            src="/logo-placeholder.svg"
            alt="Ontario Accident Review"
            width={220}
            height={50}
            priority
          />
        </Link>
        <nav className="stitch-nav-links desktop-only">
          {site.navLinks.map((link) => (
            <a key={link.href} className="stitch-nav-link" href={link.href}>{link.label}</a>
          ))}
        </nav>
        <a className="stitch-nav-cta" href="#intake">Start Your Review</a>
      </div>
    </header>
  );
}

export function SimpleHeader() {
  return (
    <header className="stitch-header">
      <div className="stitch-nav">
        <Link href="/" className="stitch-brand" aria-label={site.name}>
          <Image
            src="/logo-placeholder.svg"
            alt="Ontario Accident Review"
            width={220}
            height={50}
            priority
          />
        </Link>
        <Link className="stitch-nav-link" href="/">Back to home</Link>
      </div>
    </header>
  );
}
