import { FaqSection } from '@/components/FaqSection';
import { FitSection } from '@/components/FitSection';
import { ProcessSection } from '@/components/ProcessSection';
import { QualificationForm } from '@/components/QualificationForm';
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
        <QualificationForm />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
