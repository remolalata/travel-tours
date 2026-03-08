import Image from 'next/image';

import Stars from '@/components/common/Stars';
import type { Review } from '@/types/review';

interface ReviewsProps {
  reviews?: Review[];
}

function formatReviewDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default function Reviews({ reviews }: ReviewsProps) {
  const dbReviews = (reviews ?? []).slice(0, 3);
  return (
    <>
      {dbReviews.map((review) => (
        <div key={review.id} className={review.id === dbReviews[0]?.id ? 'pt-0' : 'pt-30'}>
          <div className='justify-between row'>
            <div className='col-auto'>
              <div className='d-flex items-center'>
                <div className='overflow-hidden rounded-full size-40'>
                  <Image
                    width={40}
                    height={40}
                    src={review.reviewerAvatarUrl || '/img/reviews/avatars/1.png'}
                    alt={review.reviewerName || 'Reviewer avatar'}
                    className='rounded-full img-cover'
                  />
                </div>

                <div className='ml-20 text-16 fw-500'>{review.reviewerName || 'Guest'}</div>
              </div>
            </div>

            <div className='col-auto'>
              <div className='text-14 text-light-2'>{formatReviewDate(review.createdAt)}</div>
            </div>
          </div>

          <div className='d-flex items-center mt-15'>
            <div className='d-flex x-gap-5'>
              <Stars star={review.rating} />
            </div>
            <div className='ml-10 text-16 fw-500'>{review.reviewTitle}</div>
          </div>

          <p className='mt-10'>{review.reviewText}</p>
        </div>
      ))}
    </>
  );
}
