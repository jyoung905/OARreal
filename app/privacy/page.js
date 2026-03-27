import { ContentPage } from '@/components/ContentPage';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Ontario Accident Review collects, uses, and protects your personal information.'
};

export default function PrivacyPage() {
  return (
    <>
      <ContentPage
        eyebrow="Privacy Policy"
        title="How Ontario Accident Review handles your information"
        intro="This Privacy Policy explains how Ontario Accident Review collects, uses, and protects the personal information you provide through our review form. By submitting the form, you consent to the practices described below."
      >
        <h2>Who we are</h2>
        <p>Ontario Accident Review operates the website at <strong>www.ontarioaccidentreview.ca</strong>. We offer a free, no-obligation first-step review for individuals who have been involved in accidents in Ontario and want to understand whether their situation may be worth pursuing.</p>
        <p>Ontario Accident Review is not a law firm and does not provide legal advice. Our service is an initial intake and triage process only.</p>

        <h2>What information we collect</h2>
        <p>When you complete our review form, we collect the following information:</p>
        <ul>
          <li>Your name, phone number, and email address</li>
          <li>Your preferred contact method and best time to reach you</li>
          <li>Basic details about your accident — type, approximate date, and location (city or area)</li>
          <li>Whether the accident occurred in Ontario</li>
          <li>Whether you were injured and whether you received medical attention</li>
          <li>General information about any impact on your ability to work</li>
          <li>Whether you are currently represented or have spoken with a lawyer</li>
          <li>A brief written summary of what happened, in your own words</li>
        </ul>
        <p>We do not collect insurance policy numbers, government-issued ID, banking or financial details, or document uploads through this initial review form.</p>

        <h2>How we use your information</h2>
        <p>We use the information you provide to:</p>
        <ul>
          <li>Review your submission and assess whether your situation appears to fit our intake criteria</li>
          <li>Contact you to discuss possible next steps, if your situation appears appropriate for follow-up</li>
          <li>Maintain internal records for intake screening and follow-up planning</li>
          <li>Improve the quality and relevance of our review process</li>
        </ul>
        <p>We will only contact you using the method and at the time you specify. Submitting a form does not create a client relationship, legal representation, or any obligation on either side.</p>

        <h2>Sharing your information</h2>
        <p>We do not sell, rent, or trade your personal information. We may share your information in the following limited circumstances:</p>
        <ul>
          <li><strong>Referral partners:</strong> If your situation appears suitable for follow-up with a legal professional or other service provider, we may pass your submission to an appropriate party. We will always tell you before doing so.</li>
          <li><strong>Service providers:</strong> We use trusted third-party tools (such as cloud hosting and email delivery services) to operate our platform. These providers process data on our behalf and are bound by confidentiality obligations.</li>
          <li><strong>Legal requirements:</strong> We may disclose your information if required by law or to protect the rights, safety, or property of Ontario Accident Review or others.</li>
        </ul>

        <h2>Data retention</h2>
        <p>We retain your submission for as long as is reasonably necessary to carry out the purposes described above, or as required by applicable law. If you would like your information deleted, please contact us at the address below.</p>

        <h2>Security</h2>
        <p>We take reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. Our intake form is transmitted over an encrypted (HTTPS) connection. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.</p>

        <h2>Your rights</h2>
        <p>Under Canada’s <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable Ontario law, you have the right to:</p>
        <ul>
          <li>Request access to the personal information we hold about you</li>
          <li>Request a correction if any information is inaccurate or incomplete</li>
          <li>Withdraw your consent and request deletion of your information at any time</li>
        </ul>
        <p>To exercise any of these rights, please contact us using the details on our <a href="/contact">Contact page</a>. We will respond within a reasonable time.</p>

        <h2>Cookies and analytics</h2>
        <p>Our website may use cookies and analytics tools (such as Google Analytics) to understand how visitors use our site. This data is aggregated and does not identify you personally. You can disable cookies in your browser settings at any time.</p>

        <h2>Links to other websites</h2>
        <p>Our site may contain links to external websites. We are not responsible for the privacy practices of those sites and encourage you to review their policies separately.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this Privacy Policy from time to time. When we do, we will revise the date at the bottom of this page. Continued use of our site after any changes constitutes your acceptance of the updated policy.</p>

        <h2>Contact us</h2>
        <p>If you have questions or concerns about this Privacy Policy or how your information is handled, please contact us:</p>
        <ul>
          <li>Website: <a href="/contact">www.ontarioaccidentreview.ca/contact</a></li>
          <li>Email: <a href="mailto:privacy@ontarioaccidentreview.ca">privacy@ontarioaccidentreview.ca</a></li>
        </ul>

        <p style={{ marginTop: '2rem', fontSize: '0.85em', color: '#6b7280' }}>Last updated: March 2026</p>
      </ContentPage>
      <SiteFooter />
    </>
  );
}
