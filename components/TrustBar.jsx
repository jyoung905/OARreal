import { site } from '@/lib/site';

export function TrustBar() {
  return (
    <section className="trust-strip premium-trust-strip soft-trust-strip">
      <div className="container trust-items premium-trust-items">
        {site.trustItems.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}
