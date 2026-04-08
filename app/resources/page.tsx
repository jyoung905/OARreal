import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { ResourcesHeader } from '@/components/ResourcesHeader';

const BASE_URL = 'https://www.ontarioaccidentreview.ca';

export const metadata: Metadata = {
  title: 'Resources & Insights | Ontario Accident Review',
  description: "Ontario accident benefits explained in plain language. Articles on SABS, deadlines, settlements, income replacement, and your rights after an accident.",
  alternates: { canonical: `${BASE_URL}/resources` },
  openGraph: {
    title: 'Resources & Insights | Ontario Accident Review',
    description: "Know before you claim. Ontario accident benefits explained in plain language.",
    url: `${BASE_URL}/resources`,
    siteName: 'Ontario Accident Review',
  },
};

const FEATURED_SLUG = 'ontario-accident-deadlines';

export default function ResourcesPage() {
  const featured = BLOG_POSTS.find(p => p.slug === FEATURED_SLUG);
  const rest = BLOG_POSTS.filter(p => p.slug !== FEATURED_SLUG);

  return (
    <>
      <ResourcesHeader />

      <div style={{ background: '#060b16', minHeight: '100vh', paddingTop: '4rem', fontFamily: 'Inter,sans-serif' }}>

        {/* HERO */}
        <section style={{ padding: '4rem 1.5rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#cba72f', marginBottom: '1rem' }}>Resources & Insights</div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', lineHeight: 1.12, marginBottom: '1rem', fontFamily: 'Manrope,sans-serif' }}>
              Know Before You Claim.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.0625rem', lineHeight: 1.8, maxWidth: '40rem', margin: '0 auto' }}>
              Ontario's accident benefits system is complex. These articles are written to help claimants understand their rights, timelines, and options — before making any decisions.
            </p>
          </div>
        </section>

        {/* FEATURED */}
        {featured && (
          <section style={{ padding: '3rem 1.5rem 0' }}>
            <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#cba72f', marginBottom: '1.25rem' }}>Featured</div>
              <Link href={`/blog/${featured.slug}`} style={{ display: 'block', background: '#0e1c30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', padding: '2rem', textDecoration: 'none', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(203,167,47,0.12)', color: '#cba72f', border: '1px solid rgba(203,167,47,0.2)', marginBottom: '1rem' }}>
                  {featured.category}
                </div>
                <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '0.75rem', fontFamily: 'Manrope,sans-serif' }}>
                  {featured.title}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  {featured.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cba72f', fontSize: '0.875rem', fontWeight: 700 }}>
                  <span>{featured.readTime}</span>
                  <span>·</span>
                  <span>Read article →</span>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ALL ARTICLES */}
        <section style={{ padding: '3rem 1.5rem 5rem' }}>
          <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#cba72f', marginBottom: '1.25rem' }}>All Articles</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {rest.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#0e1c30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', padding: '1.5rem', textDecoration: 'none' }}>
                  <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(203,167,47,0.12)', color: '#cba72f', border: '1px solid rgba(203,167,47,0.2)', alignSelf: 'flex-start' }}>
                    {post.category}
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '0.9375rem', lineHeight: 1.4, margin: 0, fontFamily: 'Manrope,sans-serif' }}>{post.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.825rem', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>{post.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                    <span>{post.readTime}</span>
                    <span style={{ color: '#cba72f', fontWeight: 700 }}>Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BAND */}
        <section style={{ background: '#001b44', padding: '4rem 1.5rem', borderTop: '1px solid rgba(203,167,47,0.15)' }}>
          <div style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', fontFamily: 'Manrope,sans-serif' }}>Ready to understand your situation?</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>Get a free, plain-language review of your claim. No obligation, no lawyers, no pressure.</p>
            <a href="/#intake" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#cba72f', color: '#1a0f00', fontWeight: 700, padding: '1rem 2.25rem', borderRadius: '0.375rem', fontSize: '0.9375rem', textDecoration: 'none', fontFamily: 'Inter,sans-serif' }}>
              Get My Free Claim Review →
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#0e1c30', padding: '2rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '64rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>© 2026 Ontario Accident Review. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem' }}>
              <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}>Privacy</Link>
              <Link href="/disclaimer" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}>Disclaimer</Link>
              <Link href="/contact" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}>Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
