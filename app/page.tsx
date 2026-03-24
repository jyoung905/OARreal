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

export default function HomePage() {
  return (
    <>
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
