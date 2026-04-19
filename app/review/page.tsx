import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { QualificationForm } from '@/components/QualificationForm';

export const metadata: Metadata = {
  title: 'Start your free review | Ontario Accident Review',
  description:
    'A short, plain-language review of your Ontario accident situation. Takes about 2 minutes. No insurance details required.'
};

export default function ReviewPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <QualificationForm />
      </main>
      <SiteFooter />
    </>
  );
}
