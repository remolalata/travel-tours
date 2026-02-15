'use client';

import { homepageTrendingDestinations } from '@/data/destinations';
import type { TrendingDestination } from '@/data/destinations';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

interface DestinationSliderProps {
  destinations: TrendingDestination[];
  paginationClass: string;
}

function DestinationSlider({ destinations, paginationClass }: DestinationSliderProps) {
  return (
    <div
      data-aos='fade-up'
      data-aos-delay='100'
      className='pt-40 sm:pt-20 overflow-hidden js-section-slider'
    >
      <div className='swiper-wrapper'>
        <Swiper
          spaceBetween={30}
          className='w-100'
          pagination={{
            el: `.${paginationClass}`,
            clickable: true,
          }}
          modules={[Navigation, Pagination]}
          breakpoints={{
            500: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 6,
            },
            1200: {
              slidesPerView: 8,
            },
          }}
        >
          {destinations.map((destination, i) => (
            <SwiperSlide key={destination.id}>
              <a
                href='#'
                data-aos='fade-up'
                data-aos-delay={Math.min(i * 50, 300)}
                className='text-center featureImage -type-1 -hover-image-scale'
              >
                <div className='mx-auto rounded-full featureImage__image -hover-image-scale__image'>
                  <Image
                    width={260}
                    height={260}
                    src={destination.imageSrc}
                    alt={destination.name}
                    className='rounded-full size-130 object-cover'
                  />
                </div>

                <h3 className='mt-20 text-16 featureImage__title fw-500'>{destination.name}</h3>
                <p className='text-14 featureImage__text'>{destination.tourCount}+ Tours</p>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className='justify-center pt-40 md:pt-30 pagination -type-1 js-dest-pagination swiperPagination1'>
        <div className={`pagination__button ${paginationClass}`}></div>
      </div>
    </div>
  );
}

export default function TrendingDestinations() {
  return (
    <section className='layout-pt-xl'>
      <div className='container'>
        <div className='justify-between items-end y-gap-10 row'>
          <div className='col-auto'>
            <h2 data-aos='fade-up' className='text-30 md:text-24'>
              Trending Locations
            </h2>
          </div>

          <div className='col-auto'>
            <Link
              href='/tours'
              data-aos='fade-up'
              data-aos-delay='100'
              className='buttonArrow d-flex items-center'
            >
              <span>See all</span>
              <i className='icon-arrow-top-right text-16 ml-10'></i>
            </Link>
          </div>
        </div>

        <DestinationSlider
          destinations={homepageTrendingDestinations}
          paginationClass='pbutton-trending-locations'
        />
      </div>
    </section>
  );
}
