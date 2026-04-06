'use client';

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-grid">
        <div className="hero-left">
          <p className="hero-eyebrow">Free Accident Benefits Review</p>
          <h1 className="hero-h1">
            Most Ontario accident victims don&apos;t know what they&apos;re actually entitled to.{' '}
            <span className="hero-h1-accent">Find out.</span>
          </h1>
          <p className="hero-lead">
            It takes 2 minutes. A licensed Ontario legal professional reviews your situation and tells you exactly where you stand — no cost, no obligation.
          </p>
          <div className="hero-stats">
            <div className="hero-stat"><strong>$0</strong><span>to start</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>~2 min</strong><span>to complete</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>Private</strong><span>your info is protected</span></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-card">
            <span className="hero-card-label">Start Your Review</span>
            <h2 className="hero-card-title">Tell us the basics of your accident</h2>
            <p className="hero-card-sub">Keep it simple — we only ask what&apos;s needed for an initial review.</p>
            <ul className="hero-card-checklist">
              <li>No insurance details required at this stage</li>
              <li>No documents or uploads needed</li>
              <li>Ontario accident situations only</li>
              <li>No obligation created by submitting</li>
            </ul>
            <a href="#intake" className="hero-card-cta">
              Start Your Free Review
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
            <p className="hero-card-note">~2 minutes · Free · No obligation</p>
          </div>
        </div>
      </div>
    </section>
  );
}
