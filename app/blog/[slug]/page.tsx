import { Metadata } from 'next';
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

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);
  const pageLinks = post.sections.filter(s => s.heading).slice(0, 6);

  return (
    <main style={{ background: 'linear-gradient(180deg, #fffdf9 0%, var(--cream) 34%, #fff 100%)' }}>
      <header className="oar-section-tight" style={{ paddingBottom: '2rem' }}>
        <div className="oar-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, .42fr)', gap: '2.5rem', alignItems: 'end' }}>
            <div>
              <Link href="/resources" style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', color: 'var(--muted)', fontWeight: 800, marginBottom: '1.4rem', textDecoration: 'none' }}><span className="material-symbols-outlined">home</span> Resources › Articles</Link>
              <h1 className="oar-display oar-h2" style={{ maxWidth: 920 }}>{post.title}</h1>
              <p className="oar-lede" style={{ marginTop: '1rem' }}>{post.description}</p>
              <div className="oar-disclaimer-strip" style={{ marginTop: '1.4rem' }}><span className="oar-icon gold"><span className="material-symbols-outlined">shield</span></span><span><strong>Trust & transparency:</strong> This article is for general information only and is not legal advice. Ontario Accident Review is not a law firm.</span></div>
            </div>
            <div className="oar-card" style={{ padding: '1.35rem' }}>
              <h2 style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--navy)', margin: 0 }}>Start a free private review</h2>
              <div className="oar-check-list">
                {['Understand possible benefits', 'Organize dates and claim issues', 'No obligation'].map(item => <div className="oar-check-row" key={item}><span className="oar-check-dot">✓</span>{item}</div>)}
              </div>
              <Link href="/#intake" className="oar-button" style={{ width: '100%', marginTop: '1rem' }}>Start My Free Review <span className="oar-button-arrow"><span className="material-symbols-outlined">arrow_forward</span></span></Link>
            </div>
          </div>
        </div>
      </header>

      <div className="oar-container" style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr) 310px', gap: '30px', alignItems: 'start', paddingBottom: 'clamp(4rem,8vw,6rem)' }}>
        <aside className="oar-article-toc">
          <strong>On this page</strong>
          {pageLinks.map((section, i) => <a key={`${section.heading}-${i}`} href={`#section-${i}`} className={i === 0 ? 'active' : ''}>{section.heading}</a>)}
          <a href="#related">Related resources</a>
        </aside>

        <article>
          <ShareButtons />
          {post.sections.map((section, i) => (
            <section key={i} id={section.heading ? `section-${pageLinks.findIndex(s => s.heading === section.heading)}` : undefined} className={section.type === 'callout' ? 'oar-article-callout' : 'oar-article-card'}>
              {section.heading && <h2>{section.heading}</h2>}
              {section.type === 'list' ? (
                <ul>{section.body.split('\n').filter(Boolean).map((item: string, j: number) => <li key={j}>{item}</li>)}</ul>
              ) : (
                section.body.split('\n\n').map((para: string, j: number) => <p key={j}>{para}</p>)
              )}
            </section>
          ))}
        </article>

        <aside className="oar-article-sidebar">
          <div className="oar-card" style={{ padding: '1.35rem' }}>
            <h3>Key reminders</h3>
            <div className="oar-check-list">
              {['Act early and keep records.', 'Save insurer letters and forms.', 'Do not rely on this article as legal advice.'].map(item => <div className="oar-check-row" key={item}><span className="oar-check-dot">✓</span>{item}</div>)}
            </div>
          </div>
          {relatedPosts.length > 0 && (
            <div id="related" className="oar-card" style={{ padding: '1.35rem' }}>
              <h3>Related resources</h3>
              <div style={{ display: 'grid', gap: '.7rem', marginTop: '1rem' }}>
                {relatedPosts.map(p => <Link key={p.slug} href={`/blog/${p.slug}`} className="oar-related-link"><span>{p.title}</span><span className="material-symbols-outlined">chevron_right</span></Link>)}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
