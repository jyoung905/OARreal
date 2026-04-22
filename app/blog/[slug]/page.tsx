import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog-posts';
import { ShareButtons } from '@/components/ShareButtons';

const BASE_URL = 'https://www.ontarioaccidentreview.ca';

/* ─────────────────────────────────────────────────────────────────
   Blog/Article page — rebuilt to match rebrand resource-article.tsx
   Rebrand ref: /Desktop/.openclaw/web/src/pages/resource-article.tsx
   Logic preserved: generateStaticParams, generateMetadata, getPostBySlug
   ───────────────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Ontario Accident Review`,
    description: post.description,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      siteName: 'Ontario Accident Review',
      type: 'article',
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <article style={{ background: 'var(--bg)' }}>
      {/* Header — bg-primary text-primary-foreground py-16 md:py-24 */}
      <header style={{ background: 'var(--primary)', color: '#fff', padding: 'clamp(4rem,8vw,6rem) 1.5rem' }}>
        <div style={{ maxWidth: 768, margin: '0 auto' }}>
          <Link
            href="/resources"
            style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.15s' }}
          >
            <svg style={{ marginRight: '0.5rem' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Resources
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>
              {post.category}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
              {post.readTime}
            </span>
          </div>

          <h1 className="font-serif" style={{
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            fontWeight: 400, lineHeight: 1.15,
            marginBottom: '1.5rem', letterSpacing: '-0.01em',
          }}>
            {post.title}
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', fontWeight: 300, lineHeight: 1.65 }}>
            {post.description}
          </p>
        </div>
      </header>

      {/* Article body */}
      <div style={{ maxWidth: 768, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) 1.5rem' }}>
        {/* Share/print bar — client component to handle onClick */}
        <ShareButtons />

        {/* Prose content — matches rebrand: prose prose-lg prose-headings:font-serif */}
        <div className="prose prose-lg">
          {post.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--primary)', fontSize: 'clamp(1.25rem,3vw,1.75rem)', marginTop: '2.5rem', marginBottom: '1rem', lineHeight: 1.25 }}>
                  {section.heading}
                </h2>
              )}
              {section.type === 'callout' ? (
                <div style={{ borderLeft: '3px solid var(--accent)', background: 'rgba(138,90,26,0.05)', padding: '1.25rem 1.5rem', margin: '1.5rem 0' }}>
                  {section.body.split('\n\n').map((para: string, j: number) => (
                    <p key={j} style={{ margin: j < section.body.split('\n\n').length - 1 ? '0 0 0.75rem' : 0, color: 'var(--text-strong)', lineHeight: 1.7 }}>{para}</p>
                  ))}
                </div>
              ) : section.type === 'list' ? (
                <ul style={{ paddingLeft: '1.5rem', margin: '0 0 1.25rem' }}>
                  {section.body.split('\n').filter(Boolean).map((item: string, j: number) => (
                    <li key={j} style={{ marginBottom: '0.4rem', color: 'rgba(0,0,0,0.75)', lineHeight: 1.8 }}>{item}</li>
                  ))}
                </ul>
              ) : (
                section.body.split('\n\n').map((para: string, j: number) => (
                  <p key={j} style={{ color: 'rgba(0,0,0,0.75)', lineHeight: 1.8, fontSize: '1.0625rem', marginBottom: '1.25rem' }}>{para}</p>
                ))
              )}
            </div>
          ))}
        </div>

        {/* End CTA — matches rebrand: mt-20 p-8 bg-muted/50 border */}
        <div style={{ marginTop: '5rem', padding: '2rem', background: 'rgba(214,220,230,0.3)', border: '1px solid var(--border)' }}>
          <h3 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--primary)', marginBottom: '1rem' }}>
            Need personalized clarity?
          </h3>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.65, fontSize: '0.95rem' }}>
            General information can only take you so far. Get a free, confidential review of your specific situation to understand exactly what you are entitled to.
          </p>
          <Link
            href="/#intake"
            style={{
              display: 'inline-flex', height: 48, alignItems: 'center',
              padding: '0 2rem', background: 'var(--primary)',
              color: '#fff', fontSize: '0.875rem', fontWeight: 500,
              textDecoration: 'none', transition: 'background 0.15s',
            }}
          >
            Start Free Review
          </Link>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '1.5rem' }}>More Articles</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {relatedPosts.map(p => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none', gap: '1rem', transition: 'border-color 0.15s' }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.25rem' }}>{p.category}</div>
                    <div className="font-serif" style={{ fontWeight: 400, color: 'var(--primary)', fontSize: '0.95rem', lineHeight: 1.35 }}>{p.title}</div>
                  </div>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
