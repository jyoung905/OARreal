import Link from 'next/link';

export function FaqSection() {
  return (
    <section className="section" id="faq">
      <div className="container two-col premium-two-col final-note-grid">
        <div>
          <p className="eyebrow">Common questions</p>
          <h2>FAQ</h2>
          <ul className="bullet-list">
            <li><strong>Is Ontario Accident Review a law firm?</strong> No. Ontario Accident Review is not a law firm and does not provide legal advice or legal representation.</li>
            <li><strong>What happens after I submit my review?</strong> A representative from Ontario Accident Review reviews your information. If your situation appears to fit our review criteria, we may contact you to discuss the next step.</li>
            <li><strong>Do I need to provide insurance information?</strong> No. We do not ask for insurance details in the initial review.</li>
            <li><strong>Do I need to upload documents?</strong> No. We are intentionally keeping the first stage simple and do not require uploads.</li>
            <li><strong>Does submitting a review mean I am starting a legal case?</strong> No. Submitting the form is only a request for an initial review.</li>
          </ul>
        </div>
        <div className="notice-box premium-notice-box quiet-notice-box">
          <p className="eyebrow">Important</p>
          <h3>Keep the first step simple</h3>
          <p>Do not send IDs, health card numbers, insurance policy numbers, banking details, or other highly sensitive information through this first-step intake.</p>
          <div className="notice-links">
            <Link className="text-link" href="/privacy">Privacy Policy</Link>
            <Link className="text-link" href="/disclaimer">Disclaimer</Link>
            <Link className="text-link" href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
