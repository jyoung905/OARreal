import SettlementCheckerContent from '@/components/SettlementCheckerContent';
import { IntakeModal } from '@/components/IntakeModal';

export const metadata = {
  title: 'Ontario Accident Settlement Checker | Free Private Review',
  description: 'Got an Ontario accident settlement offer? Use this free private checker to spot common warning signs before accepting less than you may be entitled to.',
  alternates: {
    canonical: '/settlement-checker',
  },
  openGraph: {
    title: 'Ontario Accident Settlement Checker',
    description: 'Check common warning signs before accepting an Ontario accident settlement offer. Free, private, no obligation.',
    url: 'https://www.ontarioaccidentreview.ca/settlement-checker',
    type: 'website',
  },
};

const settlementCheckerJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Ontario Accident Settlement Checker',
  description: 'A free private pre-check for Ontario accident settlement offers, treatment delays, income impact, and common claim warning signs.',
  url: 'https://www.ontarioaccidentreview.ca/settlement-checker',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Ontario Accident Review',
    url: 'https://www.ontarioaccidentreview.ca',
  },
};

export default function SettlementCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(settlementCheckerJsonLd) }}
      />
      <SettlementCheckerContent />
      <IntakeModal />
    </>
  );
}
