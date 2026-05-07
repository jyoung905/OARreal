/* ContentPage — Rebrand 2026 wrapper for legal/info pages */
export function ContentPage({ eyebrow, title, intro, children }) {
  return (
    <main style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 1.5rem clamp(1.5rem, 3vw, 2.5rem)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="oar-container-narrow">
          <div className="oar-eyebrow" style={{ marginBottom: '1rem' }}>{eyebrow}</div>
          <h1 className="oar-h1" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', marginTop: 0, marginBottom: '1rem' }}>{title}</h1>
          {intro && <p className="oar-body-lg" style={{ marginTop: 0, maxWidth: 720 }}>{intro}</p>}
        </div>
      </section>

      {/* Body */}
      <section style={{ padding: 'clamp(2rem, 5vw, 4rem) 1.5rem' }}>
        <div className="oar-container-narrow">
          <article className="oar-prose" style={{ color: 'var(--text)', lineHeight: 1.75, fontSize: '1.0625rem' }}>
            {children}
          </article>
        </div>
      </section>

      <style>{`
        .oar-prose h2 { font-family: var(--font-display); font-weight: 500; color: var(--primary); font-size: clamp(1.4rem, 2.5vw, 1.875rem); margin: 2.5rem 0 0.875rem; line-height: 1.25; letter-spacing: -0.01em; }
        .oar-prose h3 { font-family: var(--font-display); font-weight: 500; color: var(--primary); font-size: 1.25rem; margin: 2rem 0 0.625rem; }
        .oar-prose p  { margin: 0 0 1.125rem; color: var(--text); }
        .oar-prose strong { color: var(--text-strong); font-weight: 600; }
        .oar-prose a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
        .oar-prose a:hover { color: var(--accent-strong); }
        .oar-prose ul, .oar-prose ol { padding-left: 1.5rem; margin: 0 0 1.25rem; }
        .oar-prose li { margin: 0 0 0.5rem; color: var(--text); }
        .oar-prose blockquote { border-left: 4px solid var(--accent); margin: 1.5rem 0; padding: 0.5rem 1.25rem; background: var(--accent-soft); border-radius: var(--radius-sm); color: var(--text-strong); }
      `}</style>
    </main>
  );
}
