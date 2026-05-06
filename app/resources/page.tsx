import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-posts';

const BASE_URL = 'https://www.ontarioaccidentreview.ca';

export const metadata: Metadata = {
  title: 'Ontario Accident Benefits Resources | Ontario Accident Review',
  description: "Plain-language Ontario accident benefits resources on SABS, deadlines, income replacement, treatment, denials, delays, and next steps.",
  alternates: { canonical: `${BASE_URL}/resources` },
  openGraph: {
    title: 'Ontario Accident Benefits Resources | Ontario Accident Review',
    description: 'Plain-language Ontario accident benefits guides without law-firm hype or settlement promises.',
    url: `${BASE_URL}/resources`,
    siteName: 'Ontario Accident Review',
  },
};

const FILTERS = ['All resources', 'SABS overview', 'Critical deadlines', 'Treatment & rehab', 'Income replacement', 'Denials & delays', 'Next steps'];

function categoryTone(category: string) {
  const lower = category.toLowerCase();
  if (lower.includes('deadline') || lower.includes('denial')) return 'orange';
  if (lower.includes('income')) return 'green';
  return '';
}

export default function ResourcesPage() {
  const featured = BLOG_POSTS[0];

  return (
    <main style={{ background: 'linear-gradient(180deg, #fffdf9 0%, var(--cream) 42%, #fff 100%)' }}>
      <section className="oar-section-tight">
        <div className="oar-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, .85fr) minmax(360px, .75fr)', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'center' }}>
          <div>
            <div className="oar-section-kicker"><span className="material-symbols-outlined">verified_user</span> Helpful guides and information</div>
            <h1 className="oar-display oar-h2" style={{ marginTop: '1.2rem' }}>Resources</h1>
            <p className="oar-blue-copy" style={{ fontSize: 'clamp(1.35rem,2.3vw,2rem)', marginTop: '1rem' }}>Plain-language guides on benefits, deadlines, and next steps.</p>
            <p className="oar-lede" style={{ marginTop: '1rem' }}>Browse Ontario-focused information to better understand accident benefits, insurer communication, treatment issues, and common next steps.</p>
          </div>

          {featured && (
            <Link href={`/blog/${featured.slug}`} className="oar-card" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 180px', gap: '1.5rem', padding: '1.45rem', textDecoration: 'none', alignItems: 'center' }}>
              <div>
                <span className="oar-resource-tag">Featured resource</span>
                <h2 style={{ fontFamily: 'Georgia, serif', color: 'var(--navy)', fontSize: '1.75rem', lineHeight: 1.08, letterSpacing: '-.04em', margin: '.9rem 0 .7rem' }}>{featured.title}</h2>
                <p style={{ color: 'var(--muted)', lineHeight: 1.55 }}>{featured.description}</p>
                <span className="oar-link-cta" style={{ marginTop: '1.1rem' }}>Read the guide <span className="material-symbols-outlined">arrow_forward</span></span>
              </div>
              <div className="oar-resource-visual" aria-hidden="true">Ontario<br />Accident<br />Benefits</div>
            </Link>
          )}
        </div>
      </section>

      <section className="oar-section-tight" style={{ paddingTop: 0 }}>
        <div className="oar-container">
          <div className="oar-card" style={{ padding: '1rem', marginBottom: '1.4rem', display: 'flex', flexWrap: 'wrap', gap: '.75rem', alignItems: 'center' }}>
            {FILTERS.map((filter, index) => <span key={filter} className={`oar-filter-chip${index === 0 ? ' active' : ''}`}>{filter}</span>)}
            <div style={{ marginLeft: 'auto', minWidth: 230, border: '1px solid var(--line)', borderRadius: 12, minHeight: 46, display: 'flex', alignItems: 'center', gap: '.5rem', padding: '0 .9rem', color: 'var(--muted)' }}><span className="material-symbols-outlined">search</span> Search resources...</div>
          </div>

          {BLOG_POSTS.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {BLOG_POSTS.map(article => (
                <Link key={article.slug} href={`/blog/${article.slug}`} className="oar-resource-card">
                  <div className="oar-resource-image">{article.category}<br />Guide</div>
                  <div className="oar-resource-body">
                    <span className={`oar-resource-tag ${categoryTone(article.category)}`}>{article.category}</span>
                    <h2>{article.title}</h2>
                    <p>{article.description}</p>
                    <span className="oar-read-link">Read article <span className="material-symbols-outlined">arrow_forward</span></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="oar-card" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', color: 'var(--navy)', marginBottom: '.5rem' }}>No articles found</h2>
              <p>Check back soon.</p>
            </div>
          )}

          <div className="oar-card" style={{ marginTop: '1.5rem', padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span className="oar-icon"><span className="material-symbols-outlined">support_agent</span></span><div><strong style={{ color: 'var(--navy)' }}>Still have questions?</strong><p>Get a free, private review of your situation with no obligation.</p></div></div>
            <Link href="/#intake" className="oar-button">Start My Free Review <span className="oar-button-arrow"><span className="material-symbols-outlined">arrow_forward</span></span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
