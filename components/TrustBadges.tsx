import { FitSection } from '@/components/FitSection';
import { ProcessSection } from '@/components/ProcessSection';
import { TrustBar } from '@/components/TrustBar';
import { ValueSection } from '@/components/ValueSection';

export function TrustBadges() {
  return (
    <>
      <TrustBar />
      <ProcessSection />
      <FitSection />
      <ValueSection />
    </>
  );
}
