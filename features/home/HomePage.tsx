import FadeIn from '@/components/common/motion/FadeIn';
import AppPromoBanner from '@/components/home/banners/AppPromoBanner';
import FeaturedDealsBanner from '@/components/home/banners/FeaturedDealsBanner';
import TrendingDestinations from '@/components/home/destinations/TrendingDestinations';
import WhyChooseUsFeatures from '@/components/home/features/WhyChooseUsFeatures';
import HomeSearchHero from '@/components/home/heroes/HomeSearchHero';
import CustomerTestimonials from '@/components/home/testimonials/CustomerTestimonials';
import PopularToursSection from '@/components/home/tours/PopularToursSection';
import TrendingToursCarousel from '@/components/home/tours/TrendingToursCarousel';
import PopularThingsToDoSection from '@/components/home/tourTypes/PopularThingsToDoSection';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import Faq from '@/components/tour-single/sections/Faq';
import { homeContent } from '@/content/features/home';
import type { FaqItem } from '@/types/tourContent';

type HomePageProps = {
  faqItems: FaqItem[];
};

export default function HomePage({ faqItems }: HomePageProps) {
  return (
    <main>
      <SiteHeader />
      <HomeSearchHero />
      <WhyChooseUsFeatures />
      <TrendingDestinations />
      <PopularToursSection />
      <FeaturedDealsBanner />
      <PopularThingsToDoSection />
      <TrendingToursCarousel />
      <CustomerTestimonials />
      <AppPromoBanner />
      <section className='layout-pt-lg layout-pb-xl'>
        <div className='container'>
          <div className='justify-center text-center row'>
            <div className='col-xl-8 col-lg-10'>
              <FadeIn as='h2' className='text-30 md:text-24'>
                {homeContent.faq.title}
              </FadeIn>
            </div>
          </div>

          <div className='justify-center pt-40 sm:pt-20 row'>
            <div className='col-xl-8 col-lg-10'>
              <div className='y-gap-20 mt-30 accordion -simple row js-accordion'>
                <Faq items={faqItems} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
