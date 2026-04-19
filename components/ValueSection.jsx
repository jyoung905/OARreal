export function ValueSection() {
  const stats = [
    {
      number: '2 min',
      label: 'Typical intake time',
      body: 'Short, plain-language questions — no legal jargon and no policy numbers to look up.'
    },
    {
      number: '100%',
      label: 'Reviewed by a person',
      body: 'Every submission is read by a representative from Ontario Accident Review before any follow-up.'
    },
    {
      number: 'Free',
      label: 'Initial review',
      body: 'The first-step review costs nothing. You only continue if you want to, on your own terms.'
    }
  ];

  return (
    <section className="stats-v2" aria-label="At a glance">
      <div className="container stats-v2-inner">
        <div className="stats-v2-head">
          <span className="stats-v2-eyebrow">
            <span className="dot" aria-hidden="true" />
            At a glance
          </span>
          <h2>
            A review process built around <span className="serif-italic">clarity.</span>
          </h2>
        </div>
        <div className="stats-v2-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="stats-v2-card">
              <span className="stats-v2-number">{stat.number}</span>
              <strong className="stats-v2-label">{stat.label}</strong>
              <p>{stat.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
