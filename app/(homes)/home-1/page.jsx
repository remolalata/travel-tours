import FeaturedDealsBanner from '@/components/homes/banners/FeaturedDealsBanner';
import AppPromoBanner from '@/components/homes/banners/AppPromoBanner';
import TrendingDestinations from '@/components/homes/destinations/TrendingDestinations';
import WhyChooseUsFeatures from '@/components/homes/features/WhyChooseUsFeatures';
import HomeSearchHero from '@/components/homes/heros/HomeSearchHero';
import CustomerTestimonials from '@/components/homes/testimonials/CustomerTestimonials';
import TourTypeOne from '@/components/homes/tourTypes/TourTypeOne';
import PopularToursSection from '@/components/homes/tours/PopularToursSection';
import TrendingToursCarousel from '@/components/homes/tours/TrendingToursCarousel';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <HomeSearchHero />
      <WhyChooseUsFeatures />
      <TrendingDestinations />
      <PopularToursSection />
      <FeaturedDealsBanner />
      <TourTypeOne />
      <TrendingToursCarousel />
      <CustomerTestimonials />
      <AppPromoBanner />
      <SiteFooter />
    </main>
  );
}
