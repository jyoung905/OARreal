function Icon({ name }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true'
  };
  if (name === 'shield')
    return (
      <svg {...common}>
        <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      </svg>
    );
  if (name === 'clock')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  if (name === 'heart')
    return (
      <svg {...common}>
        <path d="M12 20s-7-4.5-9-9a5 5 0 019-3 5 5 0 019 3c-2 4.5-9 9-9 9z" />
      </svg>
    );
  if (name === 'compass')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9l-2 6-4 2 2-6 4-2z" />
      </svg>
    );
  if (name === 'file')
    return (
      <svg {...common}>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4" />
      </svg>
    );
  if (name === 'chat')
    return (
      <svg {...common}>
        <path d="M4 5h16v11H8l-4 4V5z" />
      </svg>
    );
  return null;
}

export function FitSection() {
  const cards = [
    {
      icon: 'shield',
      title: 'Ontario-focused review',
      body: 'We only review accident situations that happened in Ontario — so the process matches the benefits framework you are actually in.'
    },
    {
      icon: 'clock',
      title: 'About 2 minutes to start',
      body: 'A short, plain-language intake that takes most people a couple of minutes — not a long legal-style form.'
    },
    {
      icon: 'heart',
      title: 'Lower-pressure first step',
      body: 'Designed for people who want clarity before deciding whether to contact a lawyer or insurer directly.'
    },
    {
      icon: 'compass',
      title: 'Clarity before next steps',
      body: 'The goal is a simple read on whether your accident may be worth pursuing — so you are not left guessing.'
    },
    {
      icon: 'file',
      title: 'No uploads required',
      body: 'No policy numbers, no photos of IDs, no document uploads at this stage. Only what is needed for a first read.'
    },
    {
      icon: 'chat',
      title: 'Reviewed by a person',
      body: 'A representative from Ontario Accident Review reviews every submission before any follow-up happens.'
    }
  ];

  return (
    <section className="features-v2" id="who-this-is-for">
      <div className="container">
        <div className="features-v2-head">
          <span className="features-v2-eyebrow">
            <span className="dot" aria-hidden="true" />
            Why start here
          </span>
          <h2>
            A straightforward front door to <span className="serif-italic">your review.</span>
          </h2>
          <p>
            Built for people who want to understand their situation before making any decisions.
          </p>
        </div>
        <div className="features-v2-grid">
          {cards.map((card) => (
            <article key={card.title} className="feature-v2-card">
              <span className="feature-v2-icon" aria-hidden="true">
                <Icon name={card.icon} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
