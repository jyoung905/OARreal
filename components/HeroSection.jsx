'use client';
import { IntakeModal } from './IntakeModal';

export function HeroSection() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-inner">
          <p className="hero-eyebrow">Ontario Accident Review</p>
          <h1 className="hero-h1">
            Find out whether your Ontario accident may be worth pursuing
          </h1>
          <p className="hero-lead">
            Answer a few simple questions. If your situation appears to fit our
            criteria, a representative will contact you to explain the next steps.
            No insurance details or document uploads required at this stage.
          </p>
          <ul className="hero-trust-list">
            <li>No insurance information required initially</li>
            <li>No document uploads in this first stage</li>
            <li>Ontario accident situations only</li>
            <li>No obligation created by submitting</li>
          </ul>
          <div className="hero-cta-row">
            <a
              href="#intake"
              className="button button-primary hero-cta-btn"
            >
              Start Your Free Review
            </a>
            <span className="hero-cta-note">~2 min · No documents required</span>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>~2 min</strong>
              <span>to complete</span>
            </div>
            <div className="hero-stat">
              <strong>First step</strong>
              <span>No commitment required</span>
            </div>
            <div className="hero-stat">
              <strong>Private</strong>
              <span>Your information is protected</span>
            </div>
          </div>
          <p className="hero-disclaimer">
            Ontario Accident Review is not a law firm and does not provide legal
            advice or legal representation.
          </p>
        </div>
      </section>
      <IntakeModal />
    </>
  );
}
