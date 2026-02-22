'use client';

import Link from 'next/link';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import FadeIn from '@/components/common/motion/FadeIn';
import { homeContent } from '@/content/features/home';
import HomeTourCard from '@/features/home/components/tours/HomeTourCard';
import type { TourBase } from '@/types/tour';

type TrendingToursCarouselClientProps = {
  tours: TourBase[];
};

export default function TrendingToursCarouselClient({ tours }: TrendingToursCarouselClientProps) {
  const { trendingTours } = homeContent;

  return (
    <section className='layout-pt-xl layout-pb-xl relative'>
      <div className='sectionBg -w-1530 rounded-12 bg-light-1'></div>

      <div className='container'>
        <div className='row justify-between items-end y-gap-10'>
          <div className='col-auto'>
            <FadeIn as='h2' className='text-30 md:text-24'>
              {trendingTours.title}
            </FadeIn>
          </div>

          <div className='col-auto'>
            <FadeIn delay={0.1}>
              <Link href='/tours' className='buttonArrow d-flex items-center'>
                <span>{trendingTours.ctaLabel}</span>
                <i className='icon-arrow-top-right text-16 ml-10'></i>
              </Link>
            </FadeIn>
          </div>
        </div>

        <div className='relative pt-40 sm:pt-20'>
          <div className='overflow-hidden pb-30 js-section-slider'>
            <FadeIn className='swiper-wrapper'>
              <Swiper
                spaceBetween={30}
                className='w-100'
                pagination={{
                  el: '.pbutton1',
                  clickable: true,
                }}
                navigation={{
                  prevEl: '.prev1',
                  nextEl: '.next1',
                }}
                modules={[Navigation, Pagination]}
                breakpoints={{
                  500: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1200: { slidesPerView: 4 },
                }}
              >
                {tours.map((tour) => (
                  <SwiperSlide key={tour.id}>
                    <HomeTourCard
                      item={tour}
                      favoriteLabel={trendingTours.favoriteLabel}
                      pricePrefix={trendingTours.pricePrefix}
                      currencySymbol='$'
                      className='tourCard -type-1 py-10 px-10 border-1 rounded-12 bg-white -hover-shadow'
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </FadeIn>
          </div>

          <FadeIn className='navAbsolute' delay={0.1}>
            <button
              type='button'
              className='navAbsolute__button bg-white js-slider1-prev prev1'
              aria-label={trendingTours.navigation.previousLabel}
              title={trendingTours.navigation.previousLabel}
            >
              <i className='icon-arrow-left text-14'></i>
            </button>

            <button
              type='button'
              className='navAbsolute__button bg-white js-slider1-next next1'
              aria-label={trendingTours.navigation.nextLabel}
              title={trendingTours.navigation.nextLabel}
            >
              <i className='icon-arrow-right text-14'></i>
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
