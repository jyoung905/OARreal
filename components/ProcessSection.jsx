export function ProcessSection() {
  const steps = [
    {
      n: "01",
      title: "Tell us what happened",
      body: "Complete the 2-minute intake: accident type, date, how it affected your work and daily life.",
      pill: "~2 min"
    },
    {
      n: "02",
      title: "We review your claim",
      body: "Not an algorithm. A real licensed Ontario professional reads your intake, cross-checks the SABS rules, and flags any gaps or deadlines.",
      pill: "Human review"
    },
    {
      n: "03",
      title: "Get your plain-English report",
      body: "A clear breakdown of your benefits, deadlines, and options — within 48 hours. Before you sign anything with anyone.",
      pill: "48h turnaround"
    }
  ];

  return (
    <section id="how-it-works" style={{
      padding: "4.5rem 0",
      background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
      color: "#e2e8f0"
    }}>
      <div className="container">
        <div className="section-head narrow" style={{marginBottom: "2.5rem"}}>
          <p className="eyebrow" style={{color: "#38BDF8"}}>How it works</p>
          <h2 style={{color: "#f8fafc"}}>From confused to clear in 48 hours.</h2>
          <p style={{color: "rgba(226,232,240,0.75)"}}>Three steps. No obligation. No insurance details required up front.</p>
        </div>
        <div className="process-grid">
          {steps.map(step => (
            <div key={step.n} style={{
              padding: "1.75rem",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)"
            }}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem"}}>
                <span style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  background: "linear-gradient(135deg, #3730A3, #38BDF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>{step.n}</span>
                <span style={{
                  padding: "0.3rem 0.7rem",
                  borderRadius: "999px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#6ee7b7",
                  fontSize: "0.78rem",
                  fontWeight: 700
                }}>{step.pill}</span>
              </div>
              <h3 style={{color: "#f8fafc", marginBottom: "0.5rem"}}>{step.title}</h3>
              <p style={{color: "rgba(226,232,240,0.75)", margin: 0}}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
