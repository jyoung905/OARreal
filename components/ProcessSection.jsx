export function ProcessSection() {
  const steps = [
    {
      title: 'Tell us what happened',
      body: 'Complete a short review form with the basic details of your accident and how it has affected you. Takes about 2 minutes.'
    },
    {
      title: 'We review your situation',
      body: 'A representative reviews the information to determine whether your accident may be worth pursuing further.'
    },
    {
      title: 'We may contact you',
      body: 'If your situation fits our review criteria, someone from Ontario Accident Review may reach out to discuss the next step.'
    }
  ];

  return (
    <section className="section section-muted" id="how-it-works">
      <div className="container process-shell">
        <div className="section-head narrow left">
          <p className="eyebrow">How it works</p>
          <h2>Three steps. No pressure.</h2>
          <p>Built for people who want clarity before deciding what to do next.</p>
        </div>
        <div className="process-grid process-grid-connected">
          {steps.map((step, index) => (
            <div key={step.title} className="process-card premium-step">
              <div className="step-number-circle">
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3>{step.title}</h3>
              <p className="process-card p">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
