import { ContentPage } from '@/components/ContentPage';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Ontario Accident Review handles basic intake information in this launch version.'
};

export default function PrivacyPage() {
  return (
    <>
      <ContentPage
        eyebrow="Privacy Policy"
        title="How Ontario Accident Review handles your information"
        intro="This page explains the basic privacy approach for this initial review form. It should be updated with final business contact details before public launch."
      >
        <p>Ontario Accident Review collects the information you enter in the review form so a representative can review your accident and decide whether follow-up may be appropriate.</p>
        <p>We intentionally keep the first stage limited. We do not ask for insurance details, government ID numbers, banking information, or document uploads in this v1 intake.</p>
        <p>Information you submit may be stored and reviewed internally for intake screening, follow-up planning, record-keeping, and possible onward handoff if your request appears worth pursuing.</p>
        <p>You should not send highly sensitive information through this first-step form. If more information is needed later, it should be requested separately through an appropriate follow-up process.</p>
        <p>Before public launch, this page should be finalized with the correct operating entity, contact details, retention practices, and any legal or regulatory wording that applies.</p>
        <ul>
          <li>Purpose: initial review and possible follow-up</li>
          <li>Data minimization: basic first-step intake only</li>
          <li>No uploads in v1</li>
          <li>No insurance-detail collection in v1</li>
          <li>Final entity/contact details still need to be inserted before launch</li>
        </ul>
      </ContentPage>
      <SiteFooter />
    </>
  );
}
