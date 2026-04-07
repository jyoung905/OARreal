'use client';

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-grid">
        <div className="hero-left">
          <p className="hero-eyebrow">Free Accident Benefits Review</p>
          <h1 className="hero-h1">
            Your Ontario accident claim has a deadline.{' '}
            <span className="hero-h1-accent">Get a free review before it&apos;s too late.</span>
          </h1>
          <p className="hero-lead">
            In about 2 minutes, tell us what happened. A licensed Ontario professional reviews your submission and may contact you with plain-language guidance on possible benefits, deadlines, and next steps — before you rely only on the insurer.
          </p>
          <div className="hero-stats">
            <div className="hero-stat"><span>Ontario accident claims only</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span>Secure encrypted form</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span>No documents needed to start</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span>Reviewed before next-step referral</span></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-card">
            <span className="hero-card-label">Get My Free Claim Review</span>
            <h2 className="hero-card-title">Tell us the basics of your accident</h2>
            <p className="hero-card-sub">Keep it simple — we only ask what&apos;s needed for an initial review.</p>
            <ul className="hero-card-checklist">
              <li>No insurance details required at this stage</li>
              <li>No documents or uploads needed</li>
              <li>Ontario accident situations only</li>
              <li>No obligation created by submitting</li>
            </ul>
            <a href="#intake" className="hero-card-cta">
              Start My Free Review
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
            <p className="hero-card-note">Free · Confidential · No obligation · Takes ~2 minutes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
