import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS, getPostBySlug } from '@/lib/blog-posts';

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

  return (
    <>
      <style>{`
        .blog-body { font-family: Inter, system-ui, sans-serif; background: #f8f9fb; min-height: 100vh; }
        .blog-callout { border-left: 3px solid #cba72f; background: #fffdf0; padding: 1.25rem 1.5rem; border-radius: 0 0.5rem 0.5rem 0; margin: 1.5rem 0; }
        .blog-callout p { margin: 0; color: #3a3200; font-size: 0.9rem; line-height: 1.7; }
        article p { color: #44474f; line-height: 1.8; font-size: 0.9375rem; margin-bottom: 1.25rem; }
        article h3 { color: #001b44; font-family: Manrope, sans-serif; font-weight: 700; font-size: 1.15rem; margin-top: 2.25rem; margin-bottom: 0.75rem; }
        article ul { color: #44474f; line-height: 1.8; font-size: 0.9375rem; margin-bottom: 1.25rem; padding-left: 1.5rem; }
        article ul li { margin-bottom: 0.4rem; list-style: disc; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, width: '100%', zIndex: 50, background: 'rgba(6,11,22,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', maxWidth: '80rem', margin: '0 auto' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 100" fill="none" height={40} style={{ width: 'auto' }}>
              <path d="M 72 64 A 28 28 0 1 1 48 22" stroke="#e8f0ff" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M 48 22 A 28 28 0 0 1 72 64" stroke="#3a82c8" strokeWidth="7" strokeLinecap="round" fill="none" />
              <line x1="48" y1="30" x2="48" y2="42" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round" />
              <line x1="48" y1="42" x2="48" y2="58" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round" />
              <polyline points="38,50 48,62 58,50" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <text x="92" y="44" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="25" fill="#e8f0ff">Ontario</text>
              <text x="92" y="74" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="25" fill="#e8f0ff">Accident Review</text>
            </svg>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/#how-it-works" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none', fontFamily: 'Inter,sans-serif' }}>How it works</Link>
            <Link href="/resources" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none', fontFamily: 'Inter,sans-serif' }}>Resources</Link>
            <Link href="/#faq" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none', fontFamily: 'Inter,sans-serif' }}>FAQ</Link>
          </nav>
          <a href="/#intake" style={{ background: '#cba72f', color: '#1a0f00', fontWeight: 700, padding: '0.625rem 1.5rem', borderRadius: '0.375rem', fontSize: '0.875rem', textDecoration: 'none', fontFamily: 'Inter,sans-serif' }}>
            Get My Free Claim Review
          </a>
        </div>
      </header>

      <div className="blog-body" style={{ paddingTop: '5rem' }}>

        {/* HERO */}
        <section style={{ background: 'linear-gradient(145deg, #04090f 0%, #001b44 55%, #050d1a 100%)', padding: '4rem 1.5rem 3rem' }}>
          <div style={{ maxWidth: '52rem', margin: '0 auto' }}>
            <Link href="/resources" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#cba72f', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', marginBottom: '1.5rem', fontFamily: 'Inter,sans-serif' }}>
              ← All Articles
            </Link>
            <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', background: 'rgba(203,167,47,0.12)', color: '#cba72f', border: '1px solid rgba(203,167,47,0.2)', marginBottom: '1rem' }}>
              {post.category}
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1rem', fontFamily: 'Manrope,sans-serif' }}>
              {post.title}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '1.5rem', fontFamily: 'Inter,sans-serif' }}>
              {post.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: 'Inter,sans-serif' }}>
              <span>{post.readTime}</span>
              <span>Ontario Accident Review</span>
            </div>
          </div>
        </section>

        {/* ARTICLE BODY */}
        <section style={{ background: '#f8f9fb', padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '52rem', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <article>
                {post.sections.map((section, i) => (
                  <div key={i}>
                    {section.heading && <h3>{section.heading}</h3>}
                    {section.type === 'callout' ? (
                      <div className="blog-callout">
                        {section.body.split('\n\n').map((para, j) => (
                          <p key={j} style={{ marginBottom: j < section.body.split('\n\n').length - 1 ? '0.75rem' : 0 }}>{para}</p>
                        ))}
                      </div>
                    ) : section.type === 'list' ? (
                      <ul>
                        {section.body.split('\n').map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      section.body.split('\n\n').map((para, j) => (
                        <p key={j}>{para}</p>
                      ))
                    )}
                  </div>
                ))}
              </article>

              {/* INLINE CTA */}
              <div style={{ background: '#001b44', borderRadius: '0.75rem', padding: '2rem', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#cba72f', fontFamily: 'Inter,sans-serif' }}>Free Review</div>
                <h3 style={{ color: '#fff', fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.25, margin: 0 }}>
                  Not sure how this applies to your situation?
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, fontFamily: 'Inter,sans-serif' }}>
                  Get a plain-language review of your claim — free, with no obligation. Takes about 2 minutes.
                </p>
                <div>
                  <a href="/#intake" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#cba72f', color: '#1a0f00', fontWeight: 700, padding: '0.875rem 1.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', textDecoration: 'none', fontFamily: 'Inter,sans-serif' }}>
                    Start My Free Review →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED POSTS */}
        {relatedPosts.length > 0 && (
          <section style={{ background: '#f3f4f6', padding: '3rem 1.5rem', borderTop: '1px solid #e1e2e4' }}>
            <div style={{ maxWidth: '52rem', margin: '0 auto' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#735c00', fontFamily: 'Inter,sans-serif', marginBottom: '1.25rem' }}>More Articles</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {relatedPosts.map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: '#fff', borderRadius: '0.5rem', border: '1px solid #e1e2e4', textDecoration: 'none', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#735c00', marginBottom: '0.25rem', fontFamily: 'Inter,sans-serif' }}>{p.category}</div>
                      <div style={{ fontWeight: 600, color: '#001b44', fontSize: '0.9rem', fontFamily: 'Manrope,sans-serif' }}>{p.title}</div>
                    </div>
                    <span style={{ color: '#cba72f', flexShrink: 0, fontSize: '0.875rem' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer style={{ background: '#0e1c30', padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '52rem', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontFamily: 'Inter,sans-serif' }}>
              Ontario Accident Review is not a law firm and does not provide legal advice or legal representation. This service is for assessment purposes only.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem' }}>
              <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', fontFamily: 'Inter,sans-serif' }}>Privacy Policy</Link>
              <Link href="/disclaimer" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', fontFamily: 'Inter,sans-serif' }}>Disclaimer</Link>
              <Link href="/contact" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', fontFamily: 'Inter,sans-serif' }}>Contact</Link>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter,sans-serif' }}>© 2026 Ontario Accident Review. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </>
  );
}
