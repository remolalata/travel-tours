'use client';

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { HomePopularTourItem } from '@/services/tours/mutations/tourApi';
import FadeIn from '@/components/common/motion/FadeIn';
import HomeTourCard from '@/features/home/components/tours/HomeTourCard';

type TourSliderClientProps = {
  tours: (HomePopularTourItem & { slug?: string | null })[];
  heading: string;
  favoriteLabel: string;
  pricePrefix: string;
  previousLabel: string;
  nextLabel: string;
};

export default function TourSliderClient({
  tours,
  heading,
  favoriteLabel,
  pricePrefix,
  previousLabel,
  nextLabel,
}: TourSliderClientProps) {
  if (tours.length === 0) {
    return null;
  }

  const previousButtonClass = 'js-related-tours-prev';
  const nextButtonClass = 'js-related-tours-next';
  const paginationClass = 'js-related-tours-pagination';

  return (
    <section className='layout-pt-xl layout-pb-xl'>
      <div className='container'>
        <div className='row'>
          <div className='col-auto'>
            <h2 className='text-30'>{heading}</h2>
          </div>
        </div>

        <div className='relative pt-20'>
          <div
            className='pb-5 overflow-hidden js-section-slider'
            data-gap='30'
            data-slider-cols='xl-4 lg-3 md-2 sm-1 base-1'
            data-nav-prev={previousButtonClass}
            data-nav-next={nextButtonClass}
          >
            <Swiper
              spaceBetween={30}
              className='w-100'
              pagination={{
                el: `.${paginationClass}`,
                clickable: true,
              }}
              navigation={{
                prevEl: `.${previousButtonClass}`,
                nextEl: `.${nextButtonClass}`,
              }}
              modules={[Navigation, Pagination]}
              breakpoints={{
                500: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1200: {
                  slidesPerView: 4,
                },
              }}
            >
              {tours.map((tour) => (
                <SwiperSlide key={`${tour.slug ?? tour.id}`}>
                  <HomeTourCard
                    item={tour}
                    favoriteLabel={favoriteLabel}
                    pricePrefix={pricePrefix}
                    className='bg-white -hover-shadow px-10 py-10 border rounded-12 tourCard -type-1'
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className={`mt-20 d-flex justify-center ${paginationClass}`}></div>
          </div>

          <FadeIn className='navAbsolute' delay={0.1}>
            <button
              className={`navAbsolute__button bg-white ${previousButtonClass}`}
              type='button'
              aria-label={previousLabel}
              title={previousLabel}
            >
              <i className='icon-arrow-left text-14'></i>
            </button>

            <button
              className={`navAbsolute__button bg-white ${nextButtonClass}`}
              type='button'
              aria-label={nextLabel}
              title={nextLabel}
            >
              <i className='icon-arrow-right text-14'></i>
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
