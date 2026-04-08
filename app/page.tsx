import HomeContent from '@/components/HomeContent';
import { IntakeModal } from '@/components/IntakeModal';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.ontarioaccidentreview.ca/#organization',
      name: 'Ontario Accident Review',
      url: 'https://www.ontarioaccidentreview.ca',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.ontarioaccidentreview.ca/opengraph-image.svg',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        areaServed: 'CA-ON',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.ontarioaccidentreview.ca/#website',
      url: 'https://www.ontarioaccidentreview.ca',
      name: 'Ontario Accident Review',
      publisher: {
        '@id': 'https://www.ontarioaccidentreview.ca/#organization',
      },
    },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does the free review include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our review covers a comprehensive analysis of your accident benefits entitlements under Ontario\'s Statutory Accident Benefits Schedule (SABS), including income replacement, medical and rehabilitation benefits, attendant care, and non-earner benefits.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does the review process take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The initial intake form takes about 2 minutes to complete. A licensed Ontario professional personally reviews your submission — typically within 1–2 business days. If your situation qualifies, a representative will reach out with plain-language guidance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my information kept confidential?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All information you provide is treated with strict confidentiality. We use encrypted communications and never share your details with third parties without your explicit consent.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a lawyer to use this service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Ontario Accident Review is not a law firm. We provide a free, independent assessment to help you understand your situation before deciding on next steps. If legal representation appears appropriate based on your review, we can refer you to qualified Ontario personal injury lawyers — with no obligation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the accident was partly my fault?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fault does not necessarily disqualify you from accident benefits in Ontario. Ontario uses a no-fault accident benefits system, which means you may still be entitled to certain benefits regardless of fault. Submit your review and we will assess your specific situation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of accidents are covered?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We review claims arising from motor vehicle collisions, pedestrian accidents, cycling incidents, rideshare accidents, commercial vehicle collisions, and public transit accidents \u2014 any accident covered under Ontario\u2019s automobile insurance framework.',
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeContent />
      <IntakeModal />
    </>
  );
}
