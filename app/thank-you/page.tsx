import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { SimpleHeader } from '@/components/SiteHeader';

export const metadata = {
  title: 'Thank You | Ontario Accident Review',
  description:
    'Your Ontario Accident Review request has been received. A representative may follow up after the submission is reviewed.',
  robots: {
    index: false,
    follow: false
  }
};

export default function ThankYouPage() {
  return (
    <>
      <SimpleHeader />
      <main className="page-section">
        <div className="container">
          <div className="page-shell thank-you-shell">
            <div className="page-head">
              <p className="eyebrow">Thank you</p>
              <h1>Your review request has been received</h1>
              <p className="page-copy">
                A representative from Ontario Accident Review will review your submission. If
                your situation appears to fit the review criteria, someone may contact you
                using the information you provided.
              </p>
            </div>
            <div className="result-grid">
              <section className="result-panel">
                <span className="result-label">What happens next</span>
                <h3>Reviewed before any follow-up</h3>
                <p>
                  This is an initial review request only. It does not create a lawyer-client
                  relationship, and Ontario Accident Review is not a law firm.
                </p>
              </section>
              <section className="result-panel">
                <span className="result-label">Important reminder</span>
                <h3>Keep sensitive details out of first-step intake</h3>
                <p>
                  Please do not send insurance policy details, banking information, government
                  IDs, or uploads unless you are asked through an approved follow-up process.
                </p>
              </section>
            </div>
            <div className="hero-actions top-gap">
              <Link href="/" className="button">Back to home</Link>
              <Link href="/privacy" className="button button-secondary">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
