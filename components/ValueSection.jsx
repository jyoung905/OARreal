export function ValueSection() {
  const items = [
    {
      label: 'Less pressure',
      title: 'An easier place to start',
      body: 'Many people feel anxious about contacting a lawyer right away. This gives you a simpler way to begin.'
    },
    {
      label: 'More clarity',
      title: 'Review first, then next steps',
      body: 'The goal is to understand whether your accident may be worth pursuing so you are not left guessing.'
    },
    {
      label: 'Simple review',
      title: 'Only the basics at first',
      body: 'We only ask for the basic information needed for an initial review and possible callback.'
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
