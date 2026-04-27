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
        text: 'The free review looks at common Ontario accident benefits issues such as treatment and rehabilitation benefits, income replacement possibility, attendant care or caregiver-related issues if applicable, delays, denials, and practical next steps.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does the review process take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The initial intake form takes about 2 minutes to complete. Your submission is reviewed and, if your situation appears to fit the intake criteria, a representative may reach out with practical next-step information.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my information kept confidential?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your information is used only to review your accident-benefits situation and follow up about possible next steps. Ontario Accident Review is not connected to your insurer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a lawyer to use this service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Ontario Accident Review is not a law firm and does not provide legal advice. Where appropriate, users may be connected with a legal professional or relevant service provider, with no obligation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the accident was partly my fault?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fault does not necessarily disqualify someone from accident benefits in Ontario. The free review is a general claim-navigation step and does not provide legal advice about fault or entitlement.',
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
