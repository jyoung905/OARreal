function Dot() {
  return <span className="press-logo-dot" aria-hidden="true" />;
}

export function TrustBar() {
  const points = [
    'Ontario-focused',
    'Plain-language intake',
    'No insurance details at first',
    'Reviewed by a person',
    'Free initial review'
  ];

  return (
    <section className="press-strip" aria-label="What to expect">
      <div className="container press-strip-inner">
        <span className="press-strip-label">What to expect</span>
        <ul className="press-strip-logos">
          {points.map((name) => (
            <li key={name}>
              <Dot />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
