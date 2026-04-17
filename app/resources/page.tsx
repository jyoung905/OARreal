import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Resources & Insights',
  description:
    "Plain-language guides to Ontario's accident benefits system: deadlines, rights, settlements, disputes, and what claimants need to know before they decide.",
  alternates: { canonical: '/resources' }
};

type Article = {
  slug: string;
  category: string;
  categorySlug: string;
  title: string;
  summary: string;
  readTime: string;
};

const featured = {
  kicker: 'Featured read',
  title: 'The 5 Deadlines Ontario Accident Victims Miss — And What Happens When They Do',
  summary:
    "Missing a single deadline can permanently eliminate benefits you're legally entitled to under Ontario's accident framework. Here's the short list of what to watch.",
  readTime: '8 min read',
  href: '/resources/5-deadlines-ontario-accident-victims-miss'
};

const articles: Article[] = [
  {
    slug: 'what-sabs-actually-covers',
    category: 'Insurance Rights',
    categorySlug: 'insurance-rights',
    title: "What Ontario's SABS Actually Covers: A Plain-Language Breakdown",
    summary:
      'The Statutory Accident Benefits Schedule is dense. This is the plain-language version, organized by the benefits most people actually ask about.',
    readTime: '6 min read'
  },
  {
    slug: 'first-offer-settlements',
    category: 'Settlements',
    categorySlug: 'settlements',
    title: "Should You Accept the First Offer? What Most Claimants Don't Know",
    summary:
      'First-offer settlements often look fair because they arrive fast. Here is what the number usually leaves out — and how to read one before you sign.',
    readTime: '7 min read'
  },
  {
    slug: 'income-replacement-rehab-benefits',
    category: 'Medical Benefits',
    categorySlug: 'medical-benefits',
    title: "Income Replacement & Rehab Benefits: What You're Entitled To After an Ontario Accident",
    summary:
      'IRB, NEB, rehab, attendant care — what each covers, who qualifies, and how the numbers are actually calculated for real Ontario claims.',
    readTime: '7 min read'
  },
  {
    slug: 'when-your-insurer-denies-your-claim',
    category: 'Insurer Disputes',
    categorySlug: 'insurer-disputes',
    title: 'When Your Insurer Denies Your Claim: The Ontario Dispute Process Explained',
    summary:
      'LAT, OCF forms, timelines, representation — the dispute process step by step, with the deadlines and decisions that matter most.',
    readTime: '8 min read'
  },
  {
    slug: 'at-fault-vs-not-at-fault',
    category: 'Motor Vehicle',
    categorySlug: 'motor-vehicle',
    title: 'At-Fault vs. Not-At-Fault: How Fault Affects Your Accident Benefits in Ontario',
    summary:
      "Ontario is a no-fault province, but fault still shapes outcomes. Here's how fault determinations change what you can recover and from whom.",
    readTime: '6 min read'
  },
  {
    slug: 'slip-and-fall-occupiers-liability',
    category: 'Slip & Fall',
    categorySlug: 'slip-fall',
    title: "Slip and Fall in Ontario: How the Occupiers' Liability Act Affects Your Claim",
    summary:
      'The Occupiers\' Liability Act, municipal notice rules, winter-maintenance standards — the basics every slip-and-fall claimant in Ontario should know.',
    readTime: '7 min read'
  }
];

const filterChips = [
  'All topics',
  'Insurance Rights',
  'Settlements',
  'Medical Benefits',
  'Insurer Disputes',
  'Motor Vehicle',
  'Slip & Fall'
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ResourcesPage() {
  return (
    <div className="resources-page">
      <SiteHeader />

      <main>
        <section className="resources-hero">
          <div className="container resources-hero-inner">
            <span className="resources-eyebrow">
              <span className="dot" />
              Resources &amp; insights
            </span>
            <h1>
              Know before
              <br />
              <span className="serif-italic">you claim.</span>
            </h1>
            <p>
              Ontario&rsquo;s accident benefits system is complex. These articles are written to
              help claimants understand their rights, timelines, and options &mdash; before
              making any decisions.
            </p>
          </div>
        </section>

        <section className="resources-featured-section">
          <div className="container">
            <div className="resources-featured">
              <div>
                <span className="resources-featured-kicker">
                  <span
                    style={{
                      width: '0.45rem',
                      height: '0.45rem',
                      borderRadius: '999px',
                      background: '#38bdf8',
                      boxShadow: '0 0 0 3px rgba(56,189,248,0.3)'
                    }}
                  />
                  {featured.kicker}
                </span>
                <h2>{featured.title}</h2>
                <p>{featured.summary}</p>
                <div className="resources-featured-meta">
                  <ClockIcon />
                  <span>{featured.readTime}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>Insurance Rights</span>
                </div>
                <Link className="resources-featured-link" href={featured.href}>
                  Read the article <ArrowIcon />
                </Link>
              </div>
              <div className="resources-featured-visual">
                <div className="resources-featured-card">
                  <div className="resources-featured-card-title">Ontario deadline tracker</div>
                  <div className="resources-featured-timeline">
                    <div className="resources-featured-timeline-row">
                      <span className="resources-featured-dot" />
                      <span>Report the accident to your insurer</span>
                      <small>Day 7</small>
                    </div>
                    <div className="resources-featured-timeline-row">
                      <span className="resources-featured-dot" />
                      <span>Submit completed OCF-1 application</span>
                      <small>Day 30</small>
                    </div>
                    <div className="resources-featured-timeline-row warn">
                      <span className="resources-featured-dot" />
                      <span>Dispute denial via LAT</span>
                      <small>2 years</small>
                    </div>
                    <div className="resources-featured-timeline-row">
                      <span className="resources-featured-dot" />
                      <span>Tort claim limitation period</span>
                      <small>2 years</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="resources-section">
          <div className="container">
            <div className="resources-section-head">
              <div>
                <h2>All articles</h2>
                <p>Written in plain language. Reviewed for Ontario-specific accuracy.</p>
              </div>
              <div className="resources-filter-row" aria-label="Filter by topic">
                {filterChips.map((chip, index) => (
                  <span
                    key={chip}
                    className={`resources-chip ${index === 0 ? 'is-active' : ''}`}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="resources-grid">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="resource-card"
                >
                  <div className="resource-card-header">
                    <span
                      className={`resource-category cat-${article.categorySlug}`}
                    >
                      <span className="resource-category-dot" />
                      {article.category}
                    </span>
                    <span className="resource-read-time">
                      <ClockIcon /> {article.readTime}
                    </span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <span className="resource-card-footer">
                    Read article <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="resources-cta-section">
          <div className="container">
            <div className="resources-cta">
              <div>
                <h3>
                  Ready to understand <span className="serif-italic">your situation?</span>
                </h3>
                <p>
                  Get a free, plain-language review of your claim. No obligation, no lawyers,
                  no pressure.
                </p>
              </div>
              <Link className="resources-cta-btn" href="/#intake">
                Start your review <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
