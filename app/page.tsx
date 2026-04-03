import { CtaSection } from '@/components/CtaSection';
import { FaqSection } from '@/components/FaqSection';
import { FitSection } from '@/components/FitSection';
import { IntakeModal } from '@/components/IntakeModal';
import { ProcessSection } from '@/components/ProcessSection';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TrustBar } from '@/components/TrustBar';
import { ValueSection } from '@/components/ValueSection';
import { HeroSection } from '@/components/HeroSection';

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
        email: 'info@ontarioaccidentreview.ca',
        contactType: 'customer support',
        areaServed: 'CA-ON',
        availableLanguage: 'English',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.ontarioaccidentreview.ca/#website',
      url: 'https://www.ontarioaccidentreview.ca',
      name: 'Ontario Accident Review',
      publisher: { '@id': 'https://www.ontarioaccidentreview.ca/#organization' },
    },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Ontario Accident Review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ontario Accident Review is a free service that helps Ontario residents who have been injured in accidents understand whether they may be entitled to accident benefits under their auto insurance policy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this service free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Our accident benefits review is completely free with no obligation. You do not need to provide insurance details or upload any documents to get started.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who can use Ontario Accident Review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This service is for people who have been injured in an accident in Ontario, including car accidents, pedestrian accidents, and cycling accidents. You must be in Ontario and your accident must have occurred in Ontario.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a lawyer to use this service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. You do not need a lawyer to submit a review request. Ontario Accident Review is not a law firm and does not provide legal advice, but we can help you understand if your situation is worth discussing with a licensed Ontario legal professional.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens after I submit a review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After you submit your review request, our team will assess your situation and follow up within one business day to let you know whether your circumstances may qualify for accident benefits and what your next steps could be.',
      },
    },
  ],
};

export default function HomePage() {
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
      <SiteHeader />
      <main>
        <HeroSection />
        <TrustBar />
        <ProcessSection />
        <FitSection />
        <ValueSection />
        <FaqSection />
        <CtaSection />
      </main>
      <SiteFooter />
      <IntakeModal />
    </>
  );
}
