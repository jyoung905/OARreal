export function FitSection() {
  const types = [
    {
      icon: "🚗",
      title: "Car Accident",
      sub: "MVA, rear-end, intersection — any motor vehicle collision"
    },
    {
      icon: "🚶",
      title: "Pedestrian or Cyclist",
      sub: "Hit by a vehicle — including hit-and-run (MVACF may apply)"
    },
    {
      icon: "🏍️",
      title: "Motorcycle",
      sub: "Riders and passengers on any two-wheeled vehicle"
    },
    {
      icon: "🚛",
      title: "Commercial Vehicle",
      sub: "Trucks, buses, rideshare, delivery vehicles"
    },
    {
      icon: "🏠",
      title: "Slip and Fall",
      sub: "On someone else's property — occupier's liability"
    }
  ];

  return (
    <section className="section" id="who-we-help">
      <div className="container">
        <div className="section-head narrow" style={{marginBottom: "2rem"}}>
          <p className="eyebrow">Who we help</p>
          <h2>Every kind of Ontario accident — one place.</h2>
          <p>See yourself here? The review is free and takes 2 minutes.</p>
        </div>
        <div className="accident-type-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1rem"
        }}>
          {types.map(t => (
            <a key={t.title} href="#intake" style={{
              display: "block",
              padding: "1.5rem 1rem",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(226,232,240,0.9)",
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
              textAlign: "center",
              textDecoration: "none",
              color: "inherit",
              transition: "all 160ms ease"
            }}>
              <span style={{fontSize: "2rem", display: "block", marginBottom: "0.5rem"}}>{t.icon}</span>
              <strong style={{display: "block", fontSize: "0.95rem", marginBottom: "0.35rem"}}>{t.title}</strong>
              <span style={{fontSize: "0.78rem", color: "var(--muted)"}}>{t.sub}</span>
            </a>
          ))}
        </div>
        <p style={{textAlign: "center", marginTop: "1.5rem", color: "var(--muted)", fontSize: "0.9rem"}}>
          Not sure? Submit anyway — we&apos;ll review and let you know if we can help.
        </p>
      </div>
    </section>
  );
}
