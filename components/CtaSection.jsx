import Link from 'next/link';

function Arrow() {
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

export function CtaSection() {
  return (
    <section className="cta-v2-section" aria-label="Start your review">
      <div className="container">
        <div className="cta-v2-card">
          <div className="cta-v2-copy">
            <span className="cta-v2-eyebrow">
              <span className="dot" aria-hidden="true" />
              Ready when you are
            </span>
            <h2>
              A simpler first step <span className="serif-italic">after an accident.</span>
            </h2>
            <p>
              Start with a short, plain-language review. No insurance details, no uploads, no
              pressure. A representative will review your situation and only reach out if it
              appears to fit.
            </p>
          </div>
          <div className="cta-v2-actions">
            <Link className="button cta-v2-primary" href="#intake">
              Start my free review <Arrow />
            </Link>
            <Link className="button button-secondary cta-v2-secondary" href="/resources">
              Read the resources
            </Link>
          </div>
          <p className="cta-v2-note">
            Ontario Accident Review is not a law firm and does not provide legal advice or
            representation.
          </p>
        </div>
      </div>
    </section>
  );
}
