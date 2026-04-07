import { SimpleHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Ontario Accident Review. We\'re here to help with your initial accident review inquiry.'
};

export default function ContactPage() {
  return (
    <>
      <SimpleHeader />
      <main className="page-section">
        <div className="container">
          <div className="page-head">
            <p className="eyebrow">Contact</p>
            <h1>Contact Ontario Accident Review</h1>
            <p className="page-copy">Have a question before starting your review? Reach out using any of the options below. For the fastest response, use our online review form — it takes about two minutes and lets us assess your situation right away.</p>
          </div>
          <div className="contact-grid">
            <section className="contact-card">
              <h3>Get in touch</h3>
              <p>Email: <a href="mailto:info@ontarioaccidentreview.ca">info@ontarioaccidentreview.ca</a></p>
              <p>Online review form available 24/7</p>
            </section>
            <section className="contact-card">
              <h3>Start your free review</h3>
              <p>The fastest way to get a response is to complete our short online review form. It takes about two minutes and helps us understand your situation before we reach out.</p>
              <a className="button" href="/#intake" style={{ display: 'inline-block', marginTop: '0.75rem' }}>Begin Free Review</a>
            </section>
            <section className="contact-card">
              <h3>Important notice</h3>
              <p>Ontario Accident Review is not a law firm and does not provide legal advice. If you have an urgent legal deadline or limitation period concern, please contact a licensed Ontario lawyer directly.</p>
              <p>Do not send sensitive personal, financial, or insurance details by email — our review form is the appropriate channel for submitting your information securely.</p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
