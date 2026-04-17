import Link from "next/link";
import { Logo } from "@/components/Logo";

export function SiteFooter() {
  return (
    <footer className="site-footer" style={{
      background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
      color: "#e2e8f0",
      padding: "3rem 0"
    }}>
      <div className="container">
        <div style={{
          padding: "1.25rem 1.5rem",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: "2.5rem",
          textAlign: "center"
        }}>
          <strong style={{color: "#f8fafc", display: "block", marginBottom: "0.35rem"}}>
            © 2026 Ontario Accident Review. Not a law firm. Not legal advice.
          </strong>
          <span style={{color: "rgba(226,232,240,0.65)", fontSize: "0.88rem"}}>
            Ontario Accident Review does not provide legal advice or legal representation.
            Submitting a review does not create a lawyer-client relationship.
          </span>
        </div>
        <div className="footer-grid">
          <div>
            <Logo showTagline={false} className="footer-logo" />
            <p style={{color: "rgba(226,232,240,0.7)", marginTop: "0.75rem", fontSize: "0.9rem"}}>
              A free, independent review service for Ontario accident claimants.
              Helping you understand your SABS benefits before you sign anything with anyone.
            </p>
            <div style={{display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem"}}>
              {["🔒 256-bit TLS", "🍁 PIPEDA", "🎯 Ontario-only"].map(b => (
                <span key={b} style={{
                  padding: "0.35rem 0.7rem",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: "0.78rem",
                  color: "rgba(226,232,240,0.7)",
                  fontWeight: 600
                }}>{b}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="footer-heading" style={{color: "rgba(226,232,240,0.5)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "0.75rem"}}>Pages</p>
            <ul style={{listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem"}}>
              <li><Link href="/privacy" style={{color: "rgba(226,232,240,0.75)", fontSize: "0.9rem"}}>Privacy Policy</Link></li>
              <li><Link href="/disclaimer" style={{color: "rgba(226,232,240,0.75)", fontSize: "0.9rem"}}>Disclaimer</Link></li>
              <li><Link href="/contact" style={{color: "rgba(226,232,240,0.75)", fontSize: "0.9rem"}}>Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
