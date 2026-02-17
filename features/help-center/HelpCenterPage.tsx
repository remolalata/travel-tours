import HelpCenterHero from '@/components/help-center/sections/HelpCenterHero';
import HelpFaqSection from '@/components/help-center/sections/HelpFaqSection';
import HelpTopicsSection from '@/components/help-center/sections/HelpTopicsSection';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';

export default function HelpCenterPage() {
  return (
    <main>
      <SiteHeader />
      <HelpCenterHero />
      <HelpTopicsSection />
      <HelpFaqSection />
      <SiteFooter />
    </main>
  );
}
