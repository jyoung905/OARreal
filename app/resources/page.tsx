import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-posts';

const BASE_URL = 'https://www.ontarioaccidentreview.ca';

export const metadata: Metadata = {
  title: 'Resources | Ontario Accident Review',
  description: 'Plain-language guides on Ontario accident benefits, deadlines, denials, and next steps. Trusted, calm, conversion-aware.',
  alternates: { canonical: `${BASE_URL}/resources` },
  openGraph: {
    title: 'Resources | Ontario Accident Review',
    description: 'Plain-language guides on benefits, deadlines, and next steps.',
    url: `${BASE_URL}/resources`,
    siteName: 'Ontario Accident Review',
  },
};

const CATEGORY_TO_TONE: Record<string, { label: string; color: string; bg: string; iconColor: string }> = {
  'All resources':       { label: 'All resources',     color: 'var(--accent)',       bg: 'var(--accent-soft)',  iconColor: 'var(--accent)' },
  'Deadlines & Timelines': { label: 'Critical deadlines', color: 'var(--amber-strong)', bg: 'var(--amber-soft)',   iconColor: 'var(--amber-strong)' },
  'Insurance Rights':    { label: 'SABS overview',     color: 'var(--green-strong)', bg: 'var(--green-soft)',   iconColor: 'var(--green-strong)' },
  'Insurer Disputes':    { label: 'Denials & delays',  color: 'var(--amber-strong)', bg: 'var(--amber-soft)',   iconColor: 'var(--amber-strong)' },
  'Medical Benefits':    { label: 'Treatment & rehab', color: 'var(--green-strong)', bg: 'var(--green-soft)',   iconColor: 'var(--green-strong)' },
  'Motor Vehicle':       { label: 'Motor vehicle',     color: 'var(--accent)',       bg: 'var(--accent-soft)',  iconColor: 'var(--accent)' },
  'Settlements':         { label: 'Settlements',       color: 'var(--gold-strong)',  bg: 'var(--gold-soft)',    iconColor: 'var(--gold-strong)' },
  'Slip & Fall':         { label: 'Slip & fall',       color: 'var(--teal)',         bg: 'var(--teal-soft)',    iconColor: 'var(--teal)' },
};

const CATEGORY_ICONS: Record<string, string> = {
  'All resources':         'M3 4h18M3 12h18M3 20h18',
  'Deadlines & Timelines': 'M12 6v6l4 2',
  'Insurance Rights':      'M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z',
  'Insurer Disputes':      'M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  'Medical Benefits':      'M19 14a7 7 0 1 0-14 0c0 1 .25 2 .75 3M12 21V11M9 14l3-3 3 3',
  'Motor Vehicle':         'M5 17h14M3 17V11l2-5h14l2 5v6',
  'Settlements':           'M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5',
  'Slip & Fall':           'M13 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM9 22l2-7 3-3 3 4-3 6',
};

function PostCard({ post, featured = false }: { post: typeof BLOG_POSTS[number]; featured?: boolean }) {
  const tone = CATEGORY_TO_TONE[post.category] ?? CATEGORY_TO_TONE['All resources'];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="oar-card oar-card-hoverable"
      style={{
        textDecoration: 'none',
        display: 'flex', flexDirection: 'column',
        background: 'var(--surface)', padding: 0, overflow: 'hidden',
      }}
    >
      <div style={{
        height: featured ? 200 : 168,
        background: `linear-gradient(135deg, ${tone.bg} 0%, var(--bg-soft) 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={tone.iconColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.65 }}>
          <path d={CATEGORY_ICONS[post.category] ?? CATEGORY_ICONS['All resources']} />
        </svg>
      </div>
      <div style={{ padding: '1.5rem 1.625rem 1.625rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.7rem', borderRadius: 'var(--radius-full)',
            background: tone.bg, color: tone.color,
            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={CATEGORY_ICONS[post.category] ?? CATEGORY_ICONS['All resources']} /></svg>
            {tone.label}
          </span>
        </div>
        <h3 className="oar-h3" style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '0.625rem' }}>
          {post.title}
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6, flex: 1, margin: 0 }}>
          {post.description}
        </p>
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            Read article
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
          <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ResourcesPage() {
  const [featured, ...rest] = BLOG_POSTS;
  const featuredTone = CATEGORY_TO_TONE[featured.category] ?? CATEGORY_TO_TONE['All resources'];

  // Unique categories present in posts (preserve display order)
  const categoryOrder = ['All resources', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))];

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg)', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem clamp(2rem, 4vw, 3.5rem)' }}>
        <div className="oar-container-wide oar-resources-hero" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'center' }}>
          <div>
            <div className="oar-eyebrow" style={{ marginBottom: '1rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/></svg>
              Helpful guides &amp; information
            </div>
            <h1 className="oar-h1" style={{ marginTop: 0, marginBottom: '1.25rem' }}>Resources</h1>
            <p className="oar-lead" style={{ marginTop: 0, marginBottom: '1rem' }}>
              Plain-language guides on benefits, deadlines, and next steps.
            </p>
            <p className="oar-body" style={{ maxWidth: 460 }}>
              Browse trusted information to better understand your rights and make informed decisions about your recovery.
            </p>
          </div>

          {/* Featured resource card */}
          <Link
            href={`/blog/${featured.slug}`}
            className="oar-card oar-card-elevated oar-card-hoverable"
            style={{
              textDecoration: 'none',
              background: 'var(--surface)', padding: 'clamp(1.5rem, 3vw, 2rem)',
              display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '1.5rem', alignItems: 'center',
            }}
          >
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)',
                background: 'var(--green-soft)', color: 'var(--green-strong)',
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                marginBottom: '0.875rem',
              }}>
                Featured resource
              </span>
              <h2 className="oar-h3" style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '0.625rem' }}>
                {featured.title}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65, marginTop: 0, marginBottom: '1.25rem' }}>
                {featured.description}
              </p>
              <span className="oar-btn oar-btn-secondary oar-btn-sm">
                Read the guide
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </div>
            <div style={{
              width: 160, height: 200, borderRadius: 'var(--radius-md)',
              background: `linear-gradient(135deg, ${featuredTone.bg}, var(--bg-soft))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }} className="oar-hide-mobile">
              <svg width="64" height="80" viewBox="0 0 64 80" fill="none">
                <rect x="6" y="4" width="52" height="72" rx="4" fill="#fff" stroke={featuredTone.iconColor} strokeWidth="1.4"/>
                <line x1="14" y1="20" x2="50" y2="20" stroke={featuredTone.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="14" y1="32" x2="46" y2="32" stroke={featuredTone.iconColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
                <line x1="14" y1="42" x2="40" y2="42" stroke={featuredTone.iconColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
                <line x1="14" y1="52" x2="44" y2="52" stroke={featuredTone.iconColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
                <circle cx="20" cy="64" r="3" stroke={featuredTone.iconColor} strokeWidth="1.4" fill="none" />
                <circle cx="32" cy="64" r="3" stroke={featuredTone.iconColor} strokeWidth="1.4" fill="none" />
                <circle cx="44" cy="64" r="3" stroke={featuredTone.iconColor} strokeWidth="1.4" fill="none" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* Filter chips */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)', padding: '1rem 1.5rem' }}>
        <div className="oar-container-wide" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', overflowX: 'auto' }}>
          {categoryOrder.map((cat, i) => {
            const tone = CATEGORY_TO_TONE[cat] ?? CATEGORY_TO_TONE['All resources'];
            const active = i === 0;
            return (
              <span
                key={cat}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.55rem 0.95rem', borderRadius: 'var(--radius-full)',
                  border: `1px solid ${active ? tone.color : 'var(--border)'}`,
                  background: active ? tone.bg : 'var(--surface)',
                  color: active ? tone.color : 'var(--muted)',
                  fontSize: '0.85rem', fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={CATEGORY_ICONS[cat] ?? CATEGORY_ICONS['All resources']} /></svg>
                {tone.label}
              </span>
            );
          })}
        </div>
      </section>

      {/* Article grid */}
      <section style={{ background: 'var(--bg)', padding: 'clamp(3rem, 5vw, 4.5rem) 1.5rem' }}>
        <div className="oar-container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {rest.map(post => <PostCard key={post.slug} post={post} />)}
          </div>

          {/* Bottom prompt */}
          <div className="oar-card" style={{
            marginTop: '2.5rem', background: 'var(--surface)',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
            gap: '1.25rem', padding: '1.5rem 1.875rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <span style={{
                width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-soft)', color: 'var(--accent)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
              </span>
              <div>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--primary)' }}>
                  Still have questions?
                </p>
                <p style={{ margin: '0.15rem 0 0', color: 'var(--muted)', fontSize: '0.875rem' }}>
                  Get a free, private review of your situation with no obligation.
                </p>
              </div>
            </div>
            <a href="/#intake" className="oar-btn oar-btn-primary">
              Start My Free Review
              <span className="oar-btn-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) {
          .oar-resources-hero { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
