import type { RatingItem, TourContent } from '@/data/tourSingleContent';
import { defaultTourContent } from '@/data/tourSingleContent';

interface RatingProps {
  tourContent?: TourContent;
}

export default function Rating({ tourContent }: RatingProps) {
  const ratingItems = tourContent?.ratingItems || defaultTourContent.ratingItems;
  return (
    <div className='overallRating'>
      <div className='overallRating__list'>
        {ratingItems.map((elm: RatingItem, i) => (
          <div key={i} className='overallRating__item'>
            <div className='overallRating__content'>
              <div className='overallRating__icon'>
                <i className={`${elm.icon} text-30 text-accent-1`}></i>
              </div>

              <div className='overallRating__info'>
                <h5 className='text-16 fw-500'>{elm.category}</h5>
                <div className='lh-15'>{elm.comment}</div>
              </div>
            </div>

            <div className='d-flex items-center overallRating__rating'>
              <i className='text-16 text-yellow-2 icon-star'></i>
              <div className='ml-10 text-16 fw-500'>{elm.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
