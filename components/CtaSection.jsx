export function CtaSection() {
  return (
    <section style={{padding: "4.5rem 0"}}>
      <div className="container">
        <div style={{
          borderRadius: "24px",
          padding: "3.5rem 3rem",
          background: "linear-gradient(135deg, #3730A3 0%, #5B4FE1 50%, #38BDF8 100%)",
          color: "#fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-40%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "200%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.08), transparent 60%)",
            pointerEvents: "none"
          }} />
          <p className="eyebrow" style={{color: "rgba(255,255,255,0.8)", position: "relative"}}>
            Don&apos;t wait
          </p>
          <h2 style={{color: "#fff", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", position: "relative"}}>
            Your deadline clock is already running.
          </h2>
          <p style={{color: "rgba(255,255,255,0.85)", maxWidth: "540px", margin: "0 auto 2rem", position: "relative", fontSize: "1.05rem"}}>
            Some accident benefits expire in as little as 7 days. Start a free review now to see which deadlines apply to you.
          </p>
          <a className="button" href="#intake" style={{
            background: "#fff",
            color: "#3730A3",
            border: "none",
            fontWeight: 800,
            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
            position: "relative"
          }}>
            Start my free review →
          </a>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginTop: "2rem",
            flexWrap: "wrap",
            position: "relative"
          }}>
            {["🔒 256-bit TLS", "🍁 PIPEDA compliant", "🎯 Ontario-only"].map(badge => (
              <span key={badge} style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 600
              }}>{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
