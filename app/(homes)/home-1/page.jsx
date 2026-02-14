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
import Faq from '@/components/tourSingle/Faq';
import { defaultTourContent } from '@/data/tourSingleContent';

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
      <section className='layout-pt-lg layout-pb-xl'>
        <div className='container'>
          <div className='row justify-center text-center'>
            <div className='col-xl-8 col-lg-10'>
              <h2 data-aos='fade-up' className='text-30 md:text-24'>
                Frequently Asked Questions
              </h2>
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
