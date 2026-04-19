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
      body: 'If your situation appears to fit our review criteria, a representative will contact you to discuss the next step.'
    }
  ];

  return (
    <section className="process-v2" id="how-it-works">
      <div className="container process-v2-inner">
        <div className="process-v2-head">
          <span className="process-v2-eyebrow">
            <span className="dot" aria-hidden="true" />
            How it works
          </span>
          <h2>
            Three steps, no <span className="serif-italic">pressure.</span>
          </h2>
          <p>This is built for people who want clarity before deciding what to do next.</p>
        </div>
        <ol className="process-v2-grid">
          {steps.map((step, index) => (
            <li key={step.title} className="process-v2-step">
              <span className="process-v2-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
