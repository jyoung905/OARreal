import { ContentPage } from '@/components/ContentPage';
import TrackPageView from '@/components/TrackPageView';

export const metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimers for the Ontario Accident Review launch site and intake form.'
};

export default function DisclaimerPage() {
  return (
    <>
      <TrackPageView view="legal_disclaimer" />
      <ContentPage
        eyebrow="Disclaimer"
        title="Important limits on this website and review form"
        intro="Ontario Accident Review is an initial review service, not a law firm."
      >
        <p>Ontario Accident Review is not a law firm and does not provide legal advice or legal representation of any kind.</p>
        <p>Submitting information through this site is only a request for an initial review. It does not create a lawyer-client relationship, paralegal-client relationship, retainer, or any duty to act. No professional relationship of any kind is formed by submitting the intake form.</p>
        <p>Not every submission will receive follow-up. A representative may contact you only if your situation appears to fit the intake criteria used for this service. Ontario Accident Review makes no representation that any submission will be reviewed, that follow-up will occur, or that any particular outcome will result.</p>
        <p>Any information provided through this site about benefits, deadlines, or claim processes reflects general information about how accident claims typically work in Ontario and does not constitute legal advice about your specific situation. It should not be relied upon for urgent deadlines, limitation periods, filing dates, or time-sensitive legal decisions.</p>
        <p><strong>If you believe a legal deadline applies to your matter, seek qualified legal advice immediately. Do not rely on this website or this review service for time-sensitive decisions.</strong></p>
        <ul>
          <li>No legal advice is provided through this site</li>
          <li>No legal representation is created by submitting the form</li>
          <li>No result, follow-up, or outcome is guaranteed</li>
          <li>General information on this site does not apply to your specific legal situation</li>
          <li>Urgent deadlines must never depend on this form or this service</li>
          <li>This service does not assess tort thresholds, limitation periods, or specific legal eligibility</li>
        </ul>
        <p>References to &ldquo;benefits,&rdquo; &ldquo;deadlines,&rdquo; or &ldquo;claim processes&rdquo; on this site are general in nature. The circumstances of every accident claim differ. Only a qualified legal professional reviewing your specific facts can advise you on your legal rights and options.</p>
      </ContentPage>
      
    </>
  );
}
