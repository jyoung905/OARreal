import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog-posts';
import { ShareButtons } from '@/components/ShareButtons';

const BASE_URL = 'https://www.ontarioaccidentreview.ca';

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

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const headings = post.sections
    .filter(s => s.heading)
    .map(s => ({ id: slugify(s.heading!), text: s.heading! }));

  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  // Pull a 4-bullet "Key takeaways" from first 4 callout/list sections heading or first paragraphs
  const takeaways = post.sections
    .filter(s => s.heading)
    .slice(0, 5)
    .map(s => s.heading!.replace(/^\d+\.\s*/, ''));

  return (
    <article style={{ background: 'var(--bg)' }}>
      {/* Hero header */}
      <header style={{ background: 'var(--bg)', padding: 'clamp(2rem, 4vw, 3.5rem) 1.5rem clamp(2rem, 3vw, 2.5rem)' }}>
        <div className="oar-container-wide">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </Link>
            <span style={{ color: 'var(--border-strong)' }}>›</span>
            <Link href="/resources" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Resources</Link>
            <span style={{ color: 'var(--border-strong)' }}>›</span>
            <span style={{ color: 'var(--muted)' }}>Articles</span>
            <span style={{ color: 'var(--border-strong)' }}>›</span>
            <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{post.title.length > 60 ? post.title.slice(0, 58) + '…' : post.title}</span>
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 'clamp(2rem, 4vw, 4rem)', alignItems: 'flex-start' }} className="oar-article-hero">
            <div>
              <h1 className="oar-h1" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', marginTop: 0, marginBottom: '1.25rem' }}>
                {post.title}
              </h1>
              <p className="oar-body-lg" style={{ marginTop: 0, marginBottom: '2rem', maxWidth: 600 }}>
                {post.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                  {post.category}
                </span>
                <span style={{ color: 'var(--border-strong)' }}>·</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{post.readTime}</span>
              </div>

              {/* Trust & transparency banner */}
              <div className="oar-disclaimer" style={{ marginTop: '1rem' }}>
                <span className="oar-disclaimer-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/></svg>
                </span>
                <span>
                  <strong>Trust &amp; transparency:</strong> This article is for general information only and is not legal advice. Ontario Accident Review is not a law firm and does not provide legal advice.
                </span>
              </div>
            </div>

            {/* Decorative right rail */}
            <div className="oar-hide-mobile" style={{ position: 'relative', height: 280 }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '100%', height: '100%',
                background: 'linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-soft) 100%)',
                borderRadius: 'var(--radius-xl)', overflow: 'hidden',
              }}>
                <svg width="100%" height="100%" viewBox="0 0 360 280" fill="none" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="hbk" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="rgba(20, 83, 184, 0.06)"/>
                      <stop offset="1" stopColor="rgba(180, 139, 65, 0.04)"/>
                    </linearGradient>
                  </defs>
                  <rect width="360" height="280" fill="url(#hbk)"/>
                  {/* notebook */}
                  <rect x="40" y="120" width="220" height="120" rx="8" fill="#fff" stroke="rgba(10, 29, 63, 0.12)" strokeWidth="1.5"/>
                  <line x1="64" y1="148" x2="240" y2="148" stroke="rgba(10, 29, 63, 0.16)" strokeWidth="1.4" strokeLinecap="round"/>
                  <line x1="64" y1="170" x2="220" y2="170" stroke="rgba(10, 29, 63, 0.12)" strokeWidth="1.4" strokeLinecap="round"/>
                  <line x1="64" y1="192" x2="200" y2="192" stroke="rgba(10, 29, 63, 0.12)" strokeWidth="1.4" strokeLinecap="round"/>
                  <line x1="64" y1="214" x2="180" y2="214" stroke="rgba(10, 29, 63, 0.12)" strokeWidth="1.4" strokeLinecap="round"/>
                  {/* pen */}
                  <rect x="100" y="100" width="120" height="8" rx="3" fill="rgba(10, 29, 63, 0.65)" transform="rotate(-3 160 104)"/>
                  <polygon points="218,98 230,104 218,110" fill="rgba(10, 29, 63, 0.85)" transform="rotate(-3 224 104)"/>
                  {/* mug */}
                  <ellipse cx="290" cy="130" rx="38" ry="10" fill="rgba(15, 110, 110, 0.6)"/>
                  <path d="M252 130 C 252 200, 252 220, 290 220 C 328 220, 328 200, 328 130 Z" fill="rgba(15, 110, 110, 0.55)"/>
                  <path d="M328 150 C 348 150, 348 180, 328 180" stroke="rgba(15, 110, 110, 0.55)" strokeWidth="6" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <section style={{ padding: 'clamp(2rem, 4vw, 3rem) 1.5rem clamp(3rem, 5vw, 5rem)' }}>
        <div className="oar-container-wide" style={{ display: 'grid', gridTemplateColumns: '220px minmax(0, 1fr) 320px', gap: 'clamp(1.5rem, 3vw, 2.5rem)', alignItems: 'start' }} >
          {/* TOC sidebar */}
          <aside className="oar-hide-mobile" style={{ position: 'sticky', top: 92 }}>
            <p style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1rem', fontWeight: 500, marginTop: 0, marginBottom: '0.875rem' }}>On this page</p>
            <nav className="oar-toc">
              {headings.map((h, i) => (
                <a key={h.id} href={`#${h.id}`} className={`oar-toc-link ${i === 0 ? 'is-active' : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  {h.text.replace(/^\d+\.\s*/, '')}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main article body */}
          <main>
            <ShareButtons />

            <div className="oar-article-body" style={{ marginTop: '1rem' }}>
              {post.sections.map((section, i) => (
                <div key={i}>
                  {section.heading && (
                    <h2 id={slugify(section.heading)} style={{
                      fontFamily: 'var(--font-display)', fontWeight: 500,
                      color: 'var(--primary)', fontSize: 'clamp(1.4rem, 2.6vw, 1.875rem)',
                      marginTop: '2.5rem', marginBottom: '1rem',
                      lineHeight: 1.25, letterSpacing: '-0.01em',
                    }}>
                      {section.heading}
                    </h2>
                  )}
                  {section.type === 'callout' ? (
                    <div style={{
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderLeft: '4px solid var(--accent)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem 1.5rem', margin: '1.25rem 0',
                    }}>
                      {section.body.split('\n\n').map((para: string, j: number) => (
                        <p key={j} style={{ margin: j < section.body.split('\n\n').length - 1 ? '0 0 0.625rem' : 0, color: 'var(--text-strong)', lineHeight: 1.7, fontSize: '0.98rem' }}>{para}</p>
                      ))}
                    </div>
                  ) : section.type === 'list' ? (
                    <ul style={{ paddingLeft: '1.5rem', margin: '0 0 1.25rem' }}>
                      {section.body.split('\n').filter(Boolean).map((item: string, j: number) => (
                        <li key={j} style={{ marginBottom: '0.5rem', color: 'var(--text)', lineHeight: 1.7 }}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    section.body.split('\n\n').map((para: string, j: number) => (
                      <p key={j} style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '1.0625rem', marginBottom: '1.25rem' }}>{para}</p>
                    ))
                  )}
                </div>
              ))}
            </div>

            {/* End CTA */}
            <div className="oar-card oar-card-elevated" style={{ marginTop: '3.5rem', background: 'var(--surface)', padding: '2rem 2.25rem' }}>
              <h3 className="oar-h3" style={{ fontSize: '1.4rem', marginTop: 0, marginBottom: '0.625rem' }}>
                Want to know how this applies to your situation?
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.65, marginTop: 0, marginBottom: '1.5rem' }}>
                Get a free, private review &mdash; in plain language, with no obligation. About 2 minutes.
              </p>
              <Link href="/#intake" className="oar-btn oar-btn-primary">
                Start My Free Review
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </main>

          {/* Right rail */}
          <aside className="oar-hide-mobile" style={{ position: 'sticky', top: 92, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="oar-card oar-card-elevated" style={{ background: 'var(--surface)' }}>
              <div className="oar-eyebrow" style={{ marginBottom: '0.875rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/></svg>
                Start a free private review
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Understand your benefits', 'Know your deadlines', 'No obligation'].map(t => (
                  <li key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--text-strong)', fontSize: '0.9rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 16 10"/></svg>
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/#intake" className="oar-btn oar-btn-primary" style={{ width: '100%' }}>
                Start My Free Review
                <span className="oar-btn-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
              </Link>
            </div>

            <div className="oar-disclaimer" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                <span className="oar-disclaimer-icon" style={{ width: 28, height: 28 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/></svg>
                </span>
                <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 500, color: 'var(--primary)', fontSize: '0.95rem' }}>Ontario Accident Review is not a law firm</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.825rem', lineHeight: 1.55 }}>
                We help you understand your options and next steps &mdash; not provide legal advice.
              </p>
            </div>

            {takeaways.length > 0 && (
              <div className="oar-card" style={{ background: 'var(--surface)' }}>
                <p style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 500, marginTop: 0, marginBottom: '0.875rem' }}>Key takeaways</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {takeaways.map(t => (
                    <li key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: 'var(--text)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 16 10"/></svg>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div className="oar-card" style={{ background: 'var(--surface)' }}>
                <p style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 500, marginTop: 0, marginBottom: '0.875rem' }}>Related resources</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {relatedPosts.map(p => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem 0.875rem',
                      borderRadius: 'var(--radius-sm)', background: 'var(--bg)',
                      textDecoration: 'none',
                    }}>
                      <span style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 500, fontSize: '0.85rem', lineHeight: 1.35 }}>{p.title}</p>
                        <p style={{ margin: '0.15rem 0 0', color: 'var(--muted)', fontSize: '0.72rem' }}>Guide · {p.readTime}</p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <style>{`
        @media (max-width: 1080px) {
          article > section > div { grid-template-columns: 1fr !important; }
          article aside.oar-hide-mobile { position: static !important; }
        }
        @media (max-width: 760px) {
          .oar-article-hero { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
}
