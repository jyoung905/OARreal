'use client';
import Link from 'next/link';

/* ─────────────────────────────────────────────────────────────────
   SiteFooter — Rebrand visual port
   Matches: /Desktop/.openclaw/web/src/components/layout.tsx footer
   bg-primary text-white, 4-col grid, serif brand, nav + resource links
   ───────────────────────────────────────────────────────────────── */

export function SiteFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--primary)', color: '#fff',
      padding: 'clamp(3rem,8vw,6rem) 1.5rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem', marginBottom: '4rem',
        }}>
          {/* Brand col — md:col-span-2 */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem', lineHeight: 1 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem', color: '#fff' }}>Ontario</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem', color: 'var(--accent)' }}>Accident Review</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 360, marginBottom: '1.5rem' }}>
              Independent, plain-language guidance on Ontario&apos;s Statutory Accident Benefits Schedule (SABS). We help you understand your rights and options before you make permanent decisions.
            </p>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
              <p>Not a law firm. Not legal advice.</p>
              <p style={{ marginTop: '0.5rem' }}>Email: info@ontarioaccidentreview.ca</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.125rem', color: '#fff', marginBottom: '1rem' }}>Navigation</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: '/',          label: 'Home' },
                { href: '/about',     label: 'About Us' },
                { href: '/resources', label: 'Resources' },
                { href: '/contact',   label: 'Contact' },
                { href: '/#intake',   label: 'Start Review' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="footer-link"
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.125rem', color: '#fff', marginBottom: '1rem' }}>Resources</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: '/resources/sabs-overview',      label: 'SABS Overview' },
                { href: '/resources/critical-deadlines', label: 'Critical Deadlines' },
                { href: '/resources/income-replacement', label: 'Income Replacement' },
                { href: '/resources/first-72-hours',     label: 'First 72 Hours' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="footer-link"
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.125rem', color: '#fff', marginBottom: '1rem' }}>Legal</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: '/privacy',          label: 'Privacy Policy' },
                { href: '/terms-of-service', label: 'Terms of Service' },
                { href: '/disclaimer',       label: 'Disclaimer' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="footer-link"
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          alignItems: 'center', gap: '1rem',
          fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)',
        }}>
          <p>&copy; {new Date().getFullYear()} Ontario Accident Review. All rights reserved.</p>
          <p style={{ maxWidth: 560, textAlign: 'right', lineHeight: 1.6 }}>
            The information provided on this website does not, and is not intended to, constitute legal advice; instead, all information, content, and materials available on this site are for general informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
