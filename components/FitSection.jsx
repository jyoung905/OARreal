export function FitSection() {
  const cards = [
    {
      title: 'You were injured in an accident in Ontario',
      body: 'Car accidents, truck accidents, motorcycle accidents, pedestrian accidents, bicycle accidents, slip and falls, and other injury-related situations.'
    },
    {
      title: 'You are not sure whether it is serious enough to pursue',
      body: 'You want someone to review the basics before you decide whether to go further.'
    },
    {
      title: 'You want clarity before contacting a lawyer',
      body: 'This gives you a softer first step if reaching out to a lawyer directly feels intimidating.'
    },
    {
      title: 'You want a simple first review',
      body: 'No insurance details. No uploads. No complicated legal intake in the first stage.'
    }
  ];

  return (
    <section className="section" id="who-this-is-for">
      <div className="container">
        <div className="section-head narrow">
          <p className="eyebrow">Who this is for</p>
          <h2>
            Ontario Accident Review is for people who want a straightforward,
            low-pressure way to start
          </h2>
          <p>You may be a good fit if:</p>
        </div>
        <div className="matter-grid">
          {cards.map((card, index) => (
            <article key={card.title} className="matter-card premium-card">
              <span className="matter-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
