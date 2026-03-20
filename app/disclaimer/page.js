import { ContentPage } from '@/components/ContentPage';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimers for the Ontario Accident Review launch site and intake form.'
};

export default function DisclaimerPage() {
  return (
    <>
      <ContentPage
        eyebrow="Disclaimer"
        title="Important limits on this website and review form"
        intro="Ontario Accident Review is an initial review service, not a law firm."
      >
        <p>Ontario Accident Review is not a law firm and does not provide legal advice or legal representation.</p>
        <p>Submitting information through this site is only a request for an initial review. It does not create a lawyer-client relationship, paralegal-client relationship, retainer, or any duty to act.</p>
        <p>Not every submission will receive follow-up. A representative may contact you only if your situation appears to fit the review criteria used for this service.</p>
        <p>This site should not be relied on for urgent deadlines, limitation periods, filing deadlines, or emergency decisions. If your matter is urgent, seek appropriate professional help right away.</p>
        <ul>
          <li>No legal advice is provided through this site alone</li>
          <li>No legal representation is created by submitting the form</li>
          <li>No result or follow-up is guaranteed</li>
          <li>Urgent deadlines should never depend on this form</li>
        </ul>
      </ContentPage>
      <SiteFooter />
    </>
  );
}
