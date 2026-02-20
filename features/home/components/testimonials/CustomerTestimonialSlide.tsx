import Image from 'next/image';

import type { Review } from '@/types/review';

type CustomerTestimonialSlideProps = {
  review: Review;
  avatarSrc: string;
  avatarAlt: string;
  reviewerName: string;
  reviewerRole: string;
};

export default function CustomerTestimonialSlide({
  review,
  avatarSrc,
  avatarAlt,
  reviewerName,
  reviewerRole,
}: CustomerTestimonialSlideProps) {
  return (
    <div className='testimonials -type-1 pt-10 text-center'>
      <div className='testimonials__image size-100 rounded-full'>
        <div className='size-100 rounded-full overflow-hidden'>
          <Image width={98} height={98} src={avatarSrc} alt={avatarAlt} className='rounded-full object-cover' />
        </div>

        <div className='testimonials__icon'>
          <svg width='16' height='13' viewBox='0 0 16 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M13.3165 0.838867C12.1013 1.81846 10.9367 3.43478 9.77215 5.63887C8.65823 7.84295 8 10.2429 7.8481 12.8389H12.4557C12.4051 8.87152 13.6203 5.24703 16 1.91642L13.3165 0.838867ZM5.51899 0.838867C4.25316 1.81846 3.08861 3.43478 1.92405 5.63887C0.810126 7.84295 0.151899 10.2429 0 12.8389H4.60759C4.55696 8.87152 5.77215 5.19805 8.20253 1.91642L5.51899 0.838867Z'
              fill='white'
            />
          </svg>
        </div>
      </div>

      <div className='text-18 fw-500 text-accent-1 mt-60 md:mt-40'>{review.reviewTitle}</div>

      <div className='text-20 fw-500 mt-20'>{review.reviewText}</div>

      <div className='mt-20 md:mt-40'>
        <div className='lh-16 text-16 fw-500'>{reviewerName}</div>
        <div className='lh-16'>{reviewerRole}</div>
      </div>
    </div>
  );
}
