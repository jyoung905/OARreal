import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { QualificationForm } from '@/components/QualificationForm';
import { TrustBadges } from '@/components/TrustBadges';

export default function HomePage() {
  return (
    <>
      <Hero />
      <main>
        <TrustBadges />
        <QualificationForm />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
