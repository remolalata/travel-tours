'use client';

import Image from 'next/image';
import Link from 'next/link';

import FadeIn from '@/components/common/motion/FadeIn';
import Stars from '@/components/common/Stars';
import { homeContent } from '@/content/features/home';
import { tourData } from '@/data/tours';
import { formatNumber } from '@/utils/helpers/formatNumber';

export default function PopularToursSection() {
  const { popularTours } = homeContent;

  return (
    <section className='layout-pt-xl layout-pb-xl'>
      <div className='container'>
        <div className='justify-between items-end y-gap-10 row'>
          <div className='col-auto'>
            <FadeIn as='h2' className='text-30 md:text-24'>
              {popularTours.title}
            </FadeIn>
          </div>

          <div className='col-auto'>
            <FadeIn delay={0.1}>
              <Link href='/tours' className='d-flex items-center buttonArrow'>
                <span>{popularTours.ctaLabel}</span>
                <i className='icon-arrow-top-right ml-10 text-16'></i>
              </Link>
            </FadeIn>
          </div>
        </div>

        <FadeIn
          className='justify-between y-gap-30 pt-40 sm:pt-20 -w-300 row mobile-css-slider'
          amount={0.08}
          margin='0px'
        >
          {tourData.map((elm, i) => (
            <div key={i} className='col-lg-3 col-md-6'>
              <Link
                href={`/tour/${elm.id}`}
                className='-hover-shadow px-10 py-10 border-1 rounded-12 tourCard -type-1'
              >
                <div className='tourCard__header'>
                  <div className='tourCard__image ratio ratio-28:20'>
                    <Image
                      width={421}
                      height={301}
                      src={elm.imageSrc}
                      alt='image'
                      className='rounded-12 img-ratio'
                    />
                  </div>

                  <button
                    className='tourCard__favorite'
                    aria-label={popularTours.favoriteLabel}
                    title={popularTours.favoriteLabel}
                  >
                    <i className='icon-heart'></i>
                  </button>
                </div>

                <div className='px-10 pt-10 tourCard__content'>
                  <div className='d-flex items-center text-13 text-light-2 tourCard__location'>
                    <i className='d-flex mr-5 text-16 text-light-2 icon-pin'></i>
                    {elm.location}
                  </div>

                  <h3 className='mt-5 text-16 tourCard__title fw-500'>
                    <span>{elm.title}</span>
                  </h3>

                  <div className='d-flex items-center mt-5 text-13 tourCard__rating'>
                    <div className='d-flex x-gap-5'>
                      <Stars star={elm.rating} />
                    </div>

                    <span className='ml-10 text-dark-1'>
                      {elm.rating} ({elm.ratingCount})
                    </span>
                  </div>

                  <div className='d-flex justify-between items-center mt-10 pt-10 border-1-top text-13 text-dark-1'>
                    <div className='d-flex items-center'>
                      <i className='mr-5 text-16 icon-clock'></i>
                      {elm.duration}
                    </div>

                    <div>
                      {popularTours.pricePrefix}{' '}
                      <span className='text-16 fw-500'>₱{formatNumber(elm.price)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
