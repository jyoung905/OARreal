import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-posts';

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

/* ─────────────────────────────────────────────────────────────────
   Resources page — rebuilt to match rebrand resources.tsx exactly
   Rebrand ref: /Desktop/.openclaw/web/src/pages/resources.tsx
   ───────────────────────────────────────────────────────────────── */

export default function ResourcesPage() {
  return (
    <>
      {/* Header — bg-primary text-primary-foreground py-20 */}
      <section style={{ background: 'var(--primary)', color: '#fff', padding: 'clamp(4rem,8vw,5rem) 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem,5vw,3.25rem)', fontWeight: 400, marginBottom: '1.5rem', lineHeight: 1.15 }}>
            Resources &amp; Insights
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: 560, fontWeight: 300, lineHeight: 1.65 }}>
            Ontario accident benefits explained in plain language. Know before you claim.
          </p>
        </div>
      </section>

      {/* Article grid — py-16 bg-background */}
      <section style={{ padding: 'clamp(3rem,6vw,4rem) 1.5rem', background: 'var(--bg)', minHeight: '60vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {BLOG_POSTS.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {BLOG_POSTS.map(article => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    padding: '2rem', border: '1px solid var(--border)',
                    background: 'var(--surface)', transition: 'border-color 0.2s',
                  }}
                  >
                    {/* Category + read time */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>
                        {article.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {article.readTime}
                      </span>
                    </div>
                    {/* Title */}
                    <h2 className="font-serif" style={{
                      fontSize: '1.375rem', fontWeight: 400, color: 'var(--primary)',
                      marginBottom: '1rem', lineHeight: 1.3,
                    }}>
                      {article.title}
                    </h2>
                    {/* Summary */}
                    <p style={{ color: 'var(--muted)', lineHeight: 1.65, flex: 1, marginBottom: '2rem', fontSize: '0.9rem' }}>
                      {article.description}
                    </p>
                    {/* Read link */}
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary)' }}>
                      Read Article
                      <svg style={{ marginLeft: '0.5rem', transition: 'transform 0.2s' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0', border: '1px dashed var(--border)' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 400 }}>No articles found</h3>
              <p style={{ color: 'var(--muted)' }}>Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
