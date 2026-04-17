export function HeroSection() {
  return (
    <section className="hero premium-hero hero-shell" style={{
      background: "radial-gradient(circle at top left, rgba(55,48,163,0.09), transparent 40%), radial-gradient(circle at top right, rgba(56,189,248,0.07), transparent 35%), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)"
    }}>
      <div className="container hero-grid">
        <div className="hero-copy-column">
          <p className="eyebrow">Ontario Accident Review</p>
          <h1>
            Injured in Ontario?{" "}
            <em style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              background: "linear-gradient(135deg, #3730A3 0%, #5B4FE1 50%, #38BDF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Know what you&apos;re owed.
            </em>
          </h1>
          <p className="hero-copy hero-lead">
            A free, 2-minute claim review by licensed Ontario specialists. Get a plain-language
            report on your benefits, deadlines, and options — before you sign anything with anyone.
          </p>
          <div className="hero-actions">
            <a className="button" href="#intake" style={{
              background: "linear-gradient(135deg, #3730A3, #5B4FE1)",
              border: "none",
              boxShadow: "0 12px 32px rgba(55, 48, 163, 0.3)"
            }}>
              Start my free review →
            </a>
            <a className="button button-secondary" href="#how-it-works">
              How it works
            </a>
          </div>
          <div className="hero-trust-badges" style={{marginTop: "0.5rem"}}>
            <span className="hero-badge" style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              color: "#065f46"
            }}>✓ No cost, ever</span>
            <span className="hero-badge" style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              color: "#065f46"
            }}>✓ Confidential</span>
            <span className="hero-badge" style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              color: "#065f46"
            }}>✓ Report in 48h</span>
          </div>
          <p className="hero-note" style={{marginTop: "1rem"}}>
            Ontario Accident Review is not a law firm and does not provide legal advice or legal representation.
          </p>
        </div>

        <aside className="hero-panel premium-hero-panel" style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(226,232,240,0.9)",
          borderRadius: "24px",
          boxShadow: "0 32px 80px rgba(15,23,42,0.10)"
        }}>
          <p className="eyebrow" style={{color: "var(--primary)"}}>Free 2-minute review</p>
          <h2 style={{fontSize: "1.4rem", marginBottom: "0.75rem"}}>See if your claim has been missed</h2>
          <ol style={{listStyle: "none", padding: 0, margin: "0 0 1.25rem", display: "grid", gap: "0.75rem"}}>
            {[
              {n: "1", label: "Tell us what happened", sub: "Accident type, date, how it affected you"},
              {n: "2", label: "We review your claim", sub: "Licensed Ontario specialist reads your intake"},
              {n: "3", label: "Get your plain-English report", sub: "Benefits, deadlines, options — in 48 hours"}
            ].map(step => (
              <li key={step.n} style={{display: "flex", gap: "0.75rem", alignItems: "flex-start"}}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3730A3, #38BDF8)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  flexShrink: 0
                }}>{step.n}</span>
                <div>
                  <strong style={{display: "block", fontSize: "0.95rem"}}>{step.label}</strong>
                  <span style={{color: "var(--muted)", fontSize: "0.85rem"}}>{step.sub}</span>
                </div>
              </li>
            ))}
          </ol>
          <a className="button" href="#intake" style={{
            width: "100%",
            justifyContent: "center",
            background: "linear-gradient(135deg, #3730A3, #5B4FE1)",
            border: "none",
            boxShadow: "0 8px 24px rgba(55, 48, 163, 0.25)"
          }}>
            Start my free review →
          </a>
          <p style={{textAlign: "center", color: "var(--muted)", fontSize: "0.83rem", marginTop: "0.75rem"}}>
            No insurance details required. No obligation.
          </p>
        </aside>
      </div>
    </section>
  );
}
