import Image from 'next/image';

import Stars from '@/components/common/Stars';
import type { ReviewItem, TourContent } from '@/data/tourSingleContent';
import { defaultTourContent } from '@/data/tourSingleContent';

interface ReviewsProps {
  tourContent?: TourContent;
}

export default function Reviews({ tourContent }: ReviewsProps) {
  const reviewItems = tourContent?.reviewItems || defaultTourContent.reviewItems;
  return (
    <>
      {reviewItems.map((elm: ReviewItem, i) => (
        <div key={i} className='pt-30'>
          <div className='justify-between row'>
            <div className='col-auto'>
              <div className='d-flex items-center'>
                <div className='rounded-full size-40'>
                  <Image
                    width={40}
                    height={40}
                    src={elm.avatar}
                    alt='image'
                    className='img-cover'
                  />
                </div>

                <div className='ml-20 text-16 fw-500'>{elm.name}</div>
              </div>
            </div>

            <div className='col-auto'>
              <div className='text-14 text-light-2'>{elm.date}</div>
            </div>
          </div>

          <div className='d-flex items-center mt-15'>
            <div className='d-flex x-gap-5'>
              <Stars star={elm.stars} />
            </div>
            <div className='ml-10 text-16 fw-500'>{elm.reviewText}</div>
          </div>

          <p className='mt-10'>{elm.desc}</p>

          <div className='x-gap-20 y-gap-20 pt-20 row'>
            {elm.images.map((imagePath, i2) => (
              <div key={i2} className='col-auto'>
                <div className='size-130'>
                  <Image
                    width={195}
                    height={195}
                    src={imagePath}
                    alt='image'
                    className='rounded-12 img-cover'
                  />
                </div>
              </div>
            ))}
          </div>

          <div className='d-flex items-center x-gap-30 mt-20'>
            <div>
              <a href='#' className='d-flex items-center'>
                <i className='mr-10 text-16 icon-like'></i>
                Helpful
              </a>
            </div>
            <div>
              <a href='#' className='d-flex items-center'>
                <i className='mr-10 text-16 icon-dislike'></i>
                Not helpful
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
