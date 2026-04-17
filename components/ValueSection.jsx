export function ValueSection() {
  const items = [
    {
      icon: "⚖️",
      label: "Benefits clarity",
      title: "Know every benefit you're entitled to",
      body: "SABS has over a dozen benefit categories. Most claimants only know about one. We flag every applicable benefit for your accident type — income replacement, medical, attendant care, and more."
    },
    {
      icon: "⏰",
      label: "Deadline protection",
      title: "Your deadline clock is already running",
      body: "Some accident benefits expire in as little as 7 days. Our review flags your critical SABS deadlines so you know exactly how much time you have — before it runs out."
    },
    {
      icon: "🛡️",
      label: "Denial defense",
      title: "Second opinion on a denial",
      body: "If your insurer denied a benefit, it may not be the last word. We review denials against the SABS rules and flag whether there's a legitimate path to reconsideration."
    }
  ];

  return (
    <section className="section section-muted" id="what-we-review">
      <div className="container">
        <div className="section-head narrow" style={{marginBottom: "2rem"}}>
          <p className="eyebrow">What we review</p>
          <h2>Every angle of your claim — in plain English.</h2>
          <p>We cross-check your situation against Ontario&apos;s Statutory Accident Benefits Schedule (SABS). Here&apos;s what we look for.</p>
        </div>
        <div className="premium-metrics-grid">
          {items.map(item => (
            <article key={item.title} style={{
              padding: "1.75rem",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(226,232,240,0.9)",
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)"
            }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(55, 48, 163, 0.08)",
                fontSize: "1.3rem",
                marginBottom: "1rem"
              }}>{item.icon}</span>
              <p className="eyebrow" style={{marginBottom: "0.35rem"}}>{item.label}</p>
              <strong style={{display: "block", fontSize: "1.1rem", marginBottom: "0.5rem", letterSpacing: "-0.02em"}}>{item.title}</strong>
              <p style={{color: "var(--muted)", margin: 0, fontSize: "0.93rem"}}>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
