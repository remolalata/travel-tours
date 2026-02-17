import DestinationInformationSection from '@/components/destinations/sections/DestinationInformationSection';
import DestinationsHero from '@/components/destinations/sections/DestinationsHero';
import PopularToursSection from '@/components/destinations/sections/PopularToursSection';
import TrendingDestinationsSection from '@/components/destinations/sections/TrendingDestinationsSection';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';

export default function DestinationsPage() {
  return (
    <main>
      <SiteHeader />
      <DestinationsHero />
      <TrendingDestinationsSection />
      <PopularToursSection />
      <DestinationInformationSection />
      <SiteFooter />
    </main>
  );
}
