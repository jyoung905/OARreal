export function TrustBar() {
  const stats = [
    { value: "Free", label: "Always free for claimants" },
    { value: "48h", label: "Average report turnaround" },
    { value: "2 min", label: "To complete the intake" },
    { value: "Ontario", label: "Accident claims only" },
  ];

  return (
    <section className="trust-strip premium-trust-strip" style={{
      background: "rgba(255,255,255,0.85)",
      borderTop: "1px solid rgba(226,232,240,0.7)",
      borderBottom: "1px solid rgba(226,232,240,0.7)",
      padding: "1.5rem 0"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          textAlign: "center"
        }}>
          {stats.map(s => (
            <div key={s.label}>
              <strong style={{
                display: "block",
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--primary)"
              }}>{s.value}</strong>
              <span style={{fontSize: "0.83rem", color: "var(--muted)"}}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
