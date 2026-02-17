import Image from 'next/image';

import Stars from '@/components/common/Stars';
import type { AdminListingItem } from '@/types/admin';

type AdminListingCardProps = {
  item: AdminListingItem;
  compact?: boolean;
  pricePrefix: string;
};

export default function AdminListingCard({
  item,
  compact = false,
  pricePrefix,
}: AdminListingCardProps) {
  if (compact) {
    return (
      <div className='tourCard -type-1 py-10 px-10 border-1 rounded-12 -hover-shadow'>
        <div className='tourCard__header'>
          <div className='tourCard__image ratio ratio-28:20'>
            <Image width={421} height={301} src={item.imageSrc} alt={item.title} className='img-ratio rounded-12' />
          </div>

          <button className='tourCard__favorite' type='button'>
            <i className='icon-heart'></i>
          </button>
        </div>

        <div className='tourCard__content px-10 pt-10'>
          <div className='tourCard__location d-flex items-center text-13 text-light-2'>
            <i className='icon-pin d-flex text-16 text-light-2 mr-5'></i>
            {item.location}
          </div>

          <h3 className='tourCard__title text-16 fw-500 mt-5'>
            <span>{item.title}</span>
          </h3>

          <div className='tourCard__rating d-flex items-center text-13 mt-5'>
            <div className='d-flex x-gap-5'>
              <Stars star={item.rating} />
            </div>

            <span className='text-dark-1 ml-10'>
              {item.rating} ({item.ratingCount})
            </span>
          </div>

          <div className='d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10'>
            <div className='d-flex items-center'>
              <i className='icon-clock text-16 mr-5'></i>
              {item.duration}
            </div>

            <div>
              {pricePrefix} <span className='text-16 fw-500'>${item.price}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='border-1 rounded-12 px-20 py-20'>
      <div className='row x-gap-20 y-gap-20 items-center'>
        <div className='col-xxl-auto'>
          <Image
            width={421}
            height={301}
            src={item.imageSrc}
            alt={item.title}
            className='size-200 w-1/1 object-cover rounded-12'
          />
        </div>

        <div className='col'>
          <div className='d-flex items-center'>
            <i className='icon-pin mr-5'></i>
            {item.location}
          </div>

          <div className='text-18 lh-15 fw-500 mt-5'>{item.title}</div>

          <div className='d-flex items-center mt-5'>
            <div className='d-flex x-gap-5 text-yellow-2 mr-10'>
              <Stars star={item.rating} />
            </div>
            <div>
              {item.rating} ({item.ratingCount})
            </div>
          </div>

          <div className='row y-gap-15 justify-between items-end pt-5'>
            <div className='col-auto'>
              <div className='d-flex items-center'>
                <i className='icon-clock mr-5'></i>
                <div className='text-14'>{item.duration}</div>
              </div>
            </div>

            <div className='col-auto'>
              <div className='text-right md:text-left'>
                <div className='lh-14'>${item.price}</div>
                {pricePrefix} <span className='text-20 fw-500'>${item.fromPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
