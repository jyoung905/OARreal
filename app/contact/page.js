import { SimpleHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Contact',
  description: 'Placeholder contact details for the Ontario Accident Review launch site.'
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
            <p className="page-copy">Before launch, replace the placeholders below with the approved contact details for the Ontario Accident Review intake operation.</p>
          </div>
          <div className="contact-grid">
            <section className="contact-card">
              <h3>General inquiry</h3>
              <p>Email: intake@example.com</p>
              <p>Phone: 416-555-0100</p>
              <p>Hours: Monday to Friday, 9:00 AM to 5:00 PM</p>
            </section>
            <section className="contact-card">
              <h3>Important note</h3>
              <p>The homepage review form is the preferred first step for new accident situations.</p>
              <p>Do not send urgent deadlines, limitation-period issues, or highly sensitive information through unapproved channels.</p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
