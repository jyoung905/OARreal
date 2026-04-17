export function ProcessSection() {
  const steps = [
    {
      title: 'Tell us what happened',
      body: 'Complete a short review form with the basic details of your accident and how it has affected you.'
    },
    {
      title: 'We review your situation',
      body: 'A representative from Ontario Accident Review reviews the information to see whether your accident may be worth pursuing.'
    },
    {
      title: 'We may contact you',
      body: 'If your situation appears to fit our review criteria, a representative from Ontario Accident Review may contact you to discuss the next step.'
    }
  ];

  return (
    <section className="section section-muted" id="how-it-works">
      <div className="container process-shell">
        <div className="section-head narrow">
          <p className="eyebrow">How it works</p>
          <h2>A simpler first step after an accident</h2>
          <p>This is built for people who want clarity before deciding what to do next.</p>
        </div>
        <div className="process-grid">
          {steps.map((step, index) => (
            <div key={step.title} className="process-card premium-step">
              <span className="step-number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
