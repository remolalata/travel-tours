import AboutBanner from '@/components/about/sections/AboutBanner';
import AboutHero from '@/components/about/sections/AboutHero';
import AboutIntro from '@/components/about/sections/AboutIntro';
import AboutTeam from '@/components/about/sections/AboutTeam';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import AppPromoBanner from '@/features/home/components/banners/AppPromoBanner';
import WhyChooseUsFeatures from '@/features/home/components/features/WhyChooseUsFeatures';
import CustomerTestimonials from '@/features/home/components/testimonials/CustomerTestimonials';

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <AboutHero />
      <AboutIntro />
      <AboutBanner />
      <WhyChooseUsFeatures />
      <CustomerTestimonials />
      <AppPromoBanner />
      <AboutTeam />
      <SiteFooter />
    </main>
  );
}
