import Link from 'next/link';

function DotIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: '0.45rem',
        height: '0.45rem',
        borderRadius: '999px',
        background: 'linear-gradient(135deg, #3730a3, #38bdf8)'
      }}
    />
  );
}

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

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="hero-v2">
      <div className="container hero-v2-grid">
        <div className="hero-v2-copy">
          <span className="hero-v2-eyebrow">
            <DotIcon />
            Ontario-focused accident review
          </span>
          <h1>
            A simpler first step
            <br />
            <span className="serif-italic">after an accident.</span>
          </h1>
          <p className="hero-v2-lead">
            Answer a few plain-language questions and a representative from Ontario Accident
            Review will review your situation. If it appears to fit our review criteria, we may
            reach out to explain the next step &mdash; no pressure, no law-firm intake.
          </p>
          <div className="hero-v2-actions">
            <Link className="button hero-v2-cta" href="#intake">
              Start my free review <Arrow />
            </Link>
            <Link className="button button-secondary" href="#how-it-works">
              How it works
            </Link>
          </div>
          <ul className="hero-v2-trust">
            <li><Check /> Takes about 2 minutes</li>
            <li><Check /> No insurance details in the first stage</li>
            <li><Check /> Reviewed before any follow-up</li>
          </ul>
          <p className="hero-v2-note">
            Ontario Accident Review is not a law firm and does not provide legal advice or
            legal representation.
          </p>
        </div>

        <aside className="hero-v2-preview" aria-label="Form preview">
          <div className="hero-v2-preview-head">
            <span className="hero-v2-preview-kicker">
              <DotIcon /> Live preview
            </span>
            <span className="hero-v2-preview-step">Step 1 of 5</span>
          </div>
          <div className="hero-v2-preview-progress">
            <span />
          </div>
          <h3>Tell us what happened.</h3>
          <div className="hero-v2-preview-field">
            <label>Type of accident</label>
            <div className="hero-v2-select">
              <span>Car accident</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="hero-v2-preview-field">
            <label>City or area in Ontario</label>
            <div className="hero-v2-input">Toronto</div>
          </div>
          <div className="hero-v2-preview-field">
            <label>Did this happen in Ontario?</label>
            <div className="hero-v2-chip-row">
              <span className="is-selected">Yes</span>
              <span>No</span>
            </div>
          </div>
          <div className="hero-v2-preview-cta">
            <span>Continue</span>
            <Arrow />
          </div>
          <div className="hero-v2-preview-foot">
            <DotIcon />
            <span>No insurance details needed in this stage.</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
