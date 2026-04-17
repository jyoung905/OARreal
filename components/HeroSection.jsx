export function HeroSection() {
  return (
    <section className="hero premium-hero hero-shell">
      <div className="container hero-grid premium-hero-grid editorial-hero-grid">
        <div className="hero-copy-column">
          <div className="hero-trust-badges">
            <span className="hero-badge">Ontario-focused</span>
            <span className="hero-badge">Simple first step</span>
            <span className="hero-badge">Reviewed before follow-up</span>
          </div>
          <p className="eyebrow">Initial accident review request</p>
          <h1>Find out whether your Ontario accident may be worth pursuing</h1>
          <p className="hero-copy hero-lead">
            Answer a few simple questions and a representative from Ontario Accident Review
            will review your situation. If it appears to fit our review criteria, we may
            contact you to explain the next step.
          </p>
          <div className="hero-actions">
            <a className="button" href="#intake">
              Start Your Review
            </a>
            <a className="button button-secondary" href="#how-it-works">
              How It Works
            </a>
          </div>
          <div className="editorial-note-row">
            <div className="editorial-note-card">
              <strong>A simple, low-pressure first step.</strong>
              <span>
                You do not need to contact a lawyer directly just to find out whether your
                situation may be worth pursuing.
              </span>
            </div>
            <div className="editorial-note-card">
              <strong>Kept intentionally simple.</strong>
              <span>No insurance details and no document uploads in this first stage.</span>
            </div>
          </div>
          <p className="hero-note">
            Ontario Accident Review is not a law firm and does not provide legal advice or
            legal representation.
          </p>
        </div>

        <aside className="hero-panel compact-panel premium-hero-panel hero-evidence-panel">
          <span className="mini-kicker">Not ready to contact a lawyer directly?</span>
          <h2>That is exactly why this review exists.</h2>
          <ul className="editorial-list">
            <li>Tell us the basics of what happened</li>
            <li>Share how the accident has affected you</li>
            <li>We review whether the situation may be worth pursuing</li>
            <li>If it appears to fit our review criteria, we may contact you</li>
          </ul>
          <div className="panel-callout premium-callout">
            <strong>Usually about 2 minutes to complete.</strong>
            <span>
              This is a review request only. It does not create a lawyer-client
              relationship.
            </span>
          </div>
          <div className="hero-panel-footer split-footer">
            <div>
              <span className="result-label">Initial review</span>
              <strong>No uploads required</strong>
            </div>
            <div>
              <span className="result-label">Follow-up</span>
              <strong>Ontario Accident Review rep</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
