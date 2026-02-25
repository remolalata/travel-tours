import HelpCenterHero from '@/components/help-center/sections/HelpCenterHero';
import HelpFaqSection from '@/components/help-center/sections/HelpFaqSection';
import HelpTopicsSection from '@/components/help-center/sections/HelpTopicsSection';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import type { FaqItem } from '@/types/tourContent';

interface HelpCenterPageProps {
  faqItems: FaqItem[];
}

export default function HelpCenterPage({ faqItems }: HelpCenterPageProps) {
  return (
    <main>
      <SiteHeader />
      <HelpCenterHero />
      <HelpTopicsSection />
      <HelpFaqSection items={faqItems} />
      <SiteFooter />
    </main>
  );
}
