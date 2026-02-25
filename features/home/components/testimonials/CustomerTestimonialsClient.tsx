'use client';

import Image from 'next/image';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import FadeIn from '@/components/common/motion/FadeIn';
import { homeContent } from '@/content/features/home';
import CustomerTestimonialSlide from '@/features/home/components/testimonials/CustomerTestimonialSlide';
import type { Review } from '@/types/review';

type CustomerTestimonialsClientProps = {
  reviews: Review[];
};

export default function CustomerTestimonialsClient({ reviews }: CustomerTestimonialsClientProps) {
  const { testimonials } = homeContent;
  const shouldLoop = reviews.length > 1;

  return (
    <section className='relative layout-pt-xl layout-pb-xl'>
      <div className='sectionBg md:d-none'>
        <Image
          width={1920}
          height={871}
          src='/img/testimonials/1/1.png'
          alt={testimonials.backgroundImageAlt}
        />
      </div>

      <div className='container'>
        <div className='row justify-center text-center'>
          <div className='col-auto'>
            <FadeIn as='h2' className='text-30 md:text-24'>
              {testimonials.title}
            </FadeIn>
          </div>
        </div>

        <div className='row justify-center pt-60 md:pt-20'>
          <div className='col-xl-6 col-md-8 col-sm-10'>
            <div className='overflow-hidden js-section-slider'>
              <FadeIn className='swiper-wrapper'>
                <Swiper
                  key={`reviews-${reviews.length}-ready`}
                  spaceBetween={30}
                  className='w-100'
                  loop={shouldLoop}
                  pagination={{
                    el: '.pbutton2',
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  breakpoints={{
                    500: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 1,
                    },
                    1024: {
                      slidesPerView: 1,
                    },
                    1200: {
                      slidesPerView: 1,
                    },
                  }}
                >
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <SwiperSlide key={review.id}>
                        <CustomerTestimonialSlide
                          review={review}
                          avatarSrc={review.reviewerAvatarUrl ?? testimonials.avatarImageSrc}
                          avatarAlt={testimonials.avatarImageAlt}
                          reviewerName={review.reviewerName ?? testimonials.reviewerNameFallback}
                          reviewerRole={testimonials.reviewerRoleLabel}
                        />
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <div className='testimonials -type-1 pt-10 text-center'>
                        <div className='text-20 fw-500 mt-20'>{testimonials.emptyLabel}</div>
                      </div>
                    </SwiperSlide>
                  )}
                </Swiper>
              </FadeIn>

              <div className='pagination -type-1 justify-center pt-60 md:pt-40 js-testimonials-pagination swiperPagination1'>
                <div className='pagination__button pbutton2'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
