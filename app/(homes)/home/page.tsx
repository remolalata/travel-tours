import FadeIn from '@/components/common/motion/FadeIn';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import { homeContent } from '@/content/features/home';
import { defaultTourContent } from '@/data/tourSingleContent';
import AppPromoBanner from '@/features/home/components/banners/AppPromoBanner';
import FeaturedDealsBanner from '@/features/home/components/banners/FeaturedDealsBanner';
import TrendingDestinations from '@/features/home/components/destinations/TrendingDestinations';
import WhyChooseUsFeatures from '@/features/home/components/features/WhyChooseUsFeatures';
import HomeSearchHero from '@/features/home/components/heroes/HomeSearchHero';
import CustomerTestimonials from '@/features/home/components/testimonials/CustomerTestimonials';
import PopularToursSection from '@/features/home/components/tours/PopularToursSection';
import TrendingToursCarousel from '@/features/home/components/tours/TrendingToursCarousel';
import PopularThingsToDoSection from '@/features/home/components/tourTypes/PopularThingsToDoSection';
import Faq from '@/features/tour-single/components/sections/Faq';

export default function Home() {
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
      <section className='layout-pt-lg layout-pb-xl'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-xl-8 col-lg-10'>
              <FadeIn as='h2' className='text-30 md:text-24'>
                {homeContent.faq.title}
              </FadeIn>
            </div>
          </div>

          <div className='row justify-center pt-40 sm:pt-20'>
            <div className='col-xl-8 col-lg-10'>
              <div className='accordion -simple row y-gap-20 mt-30 js-accordion'>
                <Faq tourContent={defaultTourContent} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppPromoBanner />
      <SiteFooter />
    </main>
  );
}
