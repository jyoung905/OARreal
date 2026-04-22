'use client';

export function ShareButtons() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
      <button
        className="share-btn"
        style={{ padding: '0.5rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        title="Share"
        onClick={() => navigator.clipboard?.writeText(window.location.href)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      </button>
      <button
        className="share-btn"
        style={{ padding: '0.5rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        title="Print"
        onClick={() => window.print()}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      </button>
    </div>
  );
}
