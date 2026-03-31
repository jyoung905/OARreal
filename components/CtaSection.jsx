export function CtaSection() {
  return (
    <section className="section section-dark">
      <div className="container">
        <div className="cta-block">
          <p className="eyebrow">Take the first step</p>
          <h2>Find out what your claim is actually worth — before your insurer decides for you</h2>
          <p>
            Submit a short review request — no insurance details, no document uploads.
            If your situation qualifies, a licensed Ontario legal professional will follow up
            with a real assessment of your case.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#intake">Start Your Review</a>
            <span className="cta-note">
              Not a law firm. Does not provide legal advice or representation.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
