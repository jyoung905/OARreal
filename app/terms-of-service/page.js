import { ContentPage } from '@/components/ContentPage';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Terms of Service | Ontario Accident Review',
  description: 'Terms governing your use of the Ontario Accident Review website and free accident benefits review service.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <ContentPage
        eyebrow="Legal"
        title="Terms of Service"
        intro="Please read these terms carefully before using this website or submitting the review form."
      >
        <p><strong>Important:</strong> Ontario Accident Review is not a law firm and does not provide legal advice, legal representation, or any form of legal services. Use of this website does not create a lawyer-client relationship or any professional relationship of any kind.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using the Ontario Accident Review website or submitting the review intake form, you agree to be bound by these Terms of Service. If you do not agree to these Terms, please do not use this site. We may update these Terms from time to time. Continued use of the site after any changes constitutes your acceptance of the updated Terms.</p>

        <h2>2. Nature of the Service</h2>
        <p>Ontario Accident Review provides a free, preliminary, non-binding assessment service. We review information you submit to help you understand, in general terms, whether your situation may be worth exploring further with a licensed legal professional. Submitting the review form does not start a legal case, create any professional relationship, or create any obligation on your part or ours.</p>

        <h2>3. Eligibility</h2>
        <p>This service is intended for individuals who have been involved in accidents in Ontario, Canada. By using the site, you confirm that you are at least 18 years of age, or that you are accessing the site on behalf of a minor with appropriate authority.</p>

        <h2>4. Information You Provide</h2>
        <p>You agree to provide accurate and truthful information. The quality of any assessment depends entirely on the accuracy of what you submit. You should not submit insurance policy numbers, health card numbers, banking details, or other sensitive personal identifiers through the intake form. By submitting information, you grant Ontario Accident Review permission to use that information to conduct the requested review and, where consented, to refer your information to a licensed Ontario legal professional.</p>

        <h2>5. No Guarantee of Contact or Response</h2>
        <p>Submission of the review intake form does not guarantee a response or any specific outcome. Ontario Accident Review reviews all submissions and may contact you if your situation appears to meet our intake criteria, but we do not guarantee that every submission will result in follow-up contact.</p>

        <h2>6. Referrals</h2>
        <p>In some cases, with your consent, Ontario Accident Review may refer your information to a licensed Ontario legal professional. Any such referral requires your explicit consent, does not imply endorsement of the referred professional, creates a relationship solely between you and that professional, and does not create any financial obligation to Ontario Accident Review.</p>

        <h2>7. Intellectual Property</h2>
        <p>All content on this site — including text, design, graphics, logos, and code — is the property of Ontario Accident Review and is protected by applicable Canadian intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written permission.</p>

        <h2>8. Disclaimer of Warranties</h2>
        <p>This site and all content, services, and materials are provided on an "as is" and "as available" basis, without warranties of any kind, express or implied. Ontario Accident Review makes no representations regarding the accuracy, completeness, or suitability of any content or assessment provided.</p>

        <h2>9. Limitation of Liability</h2>
        <p>To the fullest extent permitted by applicable law, Ontario Accident Review, its owners, employees, contractors, and agents shall not be liable for any loss, damage, injury, or expense of any kind arising from your use of this site or reliance on any information or assessment provided, including any direct, indirect, incidental, consequential, or punitive damages.</p>

        <h2>10. Privacy</h2>
        <p>Your use of this site is also governed by our <a href="/privacy">Privacy Policy</a>, which is incorporated into these Terms by reference.</p>

        <h2>11. Governing Law</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario and the applicable laws of Canada.</p>

        <h2>12. Changes to These Terms</h2>
        <p>Ontario Accident Review reserves the right to modify these Terms at any time. Material changes will be reflected by updating the "Last updated" date. Your continued use of the site after any such change constitutes your acceptance of the updated Terms.</p>

        <h2>13. Contact</h2>
        <p>If you have questions about these Terms, please <a href="/contact">contact us</a>.</p>

        <p style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.35)',marginTop:'2rem'}}>Last updated: April 7, 2026</p>
      </ContentPage>
      <SiteFooter />
    </>
  );
}
