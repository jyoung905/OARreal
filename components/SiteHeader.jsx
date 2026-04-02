'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/site';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
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
          <a className="stitch-nav-link" href="/resources">Resources</a>
        </nav>
        <a className="stitch-nav-cta" href="#intake">Start Your Review</a>
        <button
          className="stitch-hamburger"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className="stitch-hamburger-line" style={open ? {transform:'translateY(7px) rotate(45deg)'} : {}} />
          <span className="stitch-hamburger-line" style={open ? {opacity:0} : {}} />
          <span className="stitch-hamburger-line" style={open ? {transform:'translateY(-7px) rotate(-45deg)'} : {}} />
        </button>
      </div>
      {open && (
        <nav className="stitch-mobile-nav">
          {site.navLinks.map((link) => (
            <a key={link.href} className="stitch-mobile-link" href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
          ))}
          <a className="stitch-mobile-link" href="/resources" onClick={() => setOpen(false)}>Resources</a>
          <a className="stitch-mobile-cta" href="#intake" onClick={() => setOpen(false)}>Start Your Review</a>
        </nav>
      )}
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
