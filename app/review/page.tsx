'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ReviewRedirectPage() {
  useEffect(() => {
    window.location.replace('/#intake');
  }, []);

  return (
    <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 560, textAlign: 'center', background: '#fff', border: '1px solid var(--border)', padding: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '2rem', fontWeight: 400, marginBottom: '1rem' }}>Start your free accident review</h1>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>If you are not redirected automatically, use the button below to open the review form.</p>
        <Link href="/#intake" style={{ display: 'inline-flex', minHeight: 48, alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', background: 'var(--accent)', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
          Start My Free Accident Review
        </Link>
      </div>
    </main>
  );
}
