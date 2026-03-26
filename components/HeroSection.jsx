import { HeroInlineForm } from './HeroInlineForm';

export function HeroSection() {
  return (
    <section className="split-hero">
      <div className="split-hero-left">
        <div className="split-hero-left-inner">
          <p className="split-hero-eyebrow">Ontario Accident Review</p>
          <h1 className="split-hero-h1">
            Find out whether your Ontario accident may be worth pursuing
          </h1>
          <p className="split-hero-lead">
            Answer a few simple questions. If your situation appears to fit our criteria,
            a representative will contact you to explain the next steps.
            No insurance details or document uploads required at this stage.
          </p>
          <ul className="split-hero-trust-list">
            <li>No insurance information required initially</li>
            <li>No document uploads in this first stage</li>
            <li>Ontario accident situations only</li>
            <li>No obligation created by submitting</li>
          </ul>
          <div className="split-hero-stats">
            <div className="split-hero-stat">
              <strong>~2 min</strong>
              <span>to complete the review</span>
            </div>
            <div className="split-hero-stat">
              <strong>First step</strong>
              <span>No commitment required</span>
            </div>
            <div className="split-hero-stat">
              <strong>Private</strong>
              <span>Your information is protected</span>
            </div>
          </div>
          <p className="split-hero-disclaimer">
            Ontario Accident Review is not a law firm and does not provide
            legal advice or legal representation.
          </p>
        </div>
      </div>
      <div className="split-hero-right">
        <HeroInlineForm />
      </div>
    </section>
  );
}
