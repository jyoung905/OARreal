export function ValueSection() {
  const items = [
    {
      label: 'Know your rights',
      title: 'Insurance companies count on you not knowing',
      body: 'Most accident victims don\'t know what they\'re entitled to under Ontario law. Insurers count on that. A review helps level the playing field before you accept anything.'
    },
    {
      label: 'Real advice',
      title: 'A licensed professional reviews your case',
      body: 'If your situation qualifies, a licensed Ontario legal professional — not a call centre — will reach out with a genuine assessment of what your case may be worth.'
    },
    {
      label: 'No commitment',
      title: 'Understand your options first',
      body: 'You may be owed far more than your insurer has offered. Find out before you decide — no documents, no insurance details, no obligation at this stage.'
    }
  ];

  return (
    <section className="section section-muted">
      <div className="container premium-metrics-grid calm-metrics-grid">
        {items.map((item) => (
          <article key={item.title} className="metric-card quiet-card">
            <span className="metric-label">{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
