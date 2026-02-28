import Image from 'next/image';

import Stars from '@/components/common/Stars';
import type { AdminListingItem } from '@/types/admin';
import { formatNumber } from '@/utils/helpers/formatNumber';

const FALLBACK_SLOTS_AVAILABLE = [
  ['2026-03-28', '2026-03-29'],
  ['2026-04-11', '2026-04-12', '2026-04-13'],
];

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
  const slotsAvailableCount = FALLBACK_SLOTS_AVAILABLE.length;
  const slotsAvailableLabel = `${slotsAvailableCount} slot${slotsAvailableCount === 1 ? '' : 's'} available`;

  if (compact) {
    return (
      <div className='-hover-shadow px-10 py-10 border rounded-12 tourCard -type-1'>
        <div className='tourCard__header'>
          <div className='tourCard__image ratio ratio-28:20'>
            <Image
              width={421}
              height={301}
              src={item.imageSrc}
              alt={item.title}
              className='rounded-12 img-ratio'
            />
          </div>

          <button className='tourCard__favorite' type='button'>
            <i className='icon-heart'></i>
          </button>
        </div>

        <div className='px-10 pt-10 tourCard__content'>
          <div className='d-flex items-center text-13 text-light-2 tourCard__location'>
            <i className='d-flex mr-5 text-16 text-light-2 icon-pin'></i>
            {item.location}
          </div>

          <h3 className='mt-5 text-16 tourCard__title fw-500'>
            <span>{item.title}</span>
          </h3>

          <div className='d-flex items-center mt-5 text-13 tourCard__rating'>
            <div className='d-flex x-gap-5'>
              <Stars star={item.rating} />
            </div>

            <span className='ml-10 text-dark-1'>
              {item.rating} ({item.ratingCount})
            </span>
          </div>

          <div className='d-flex justify-between items-center mt-10 pt-10 border-top text-13 text-dark-1'>
            <div className='d-flex items-center'>
              <i className='mr-5 text-16 icon-calendar'></i>
              {slotsAvailableLabel}
            </div>

            <div>
              {pricePrefix} <span className='text-16 fw-500'>${formatNumber(item.price)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='px-20 py-20 border rounded-12'>
      <div className='items-center x-gap-20 y-gap-20 row'>
        <div className='col-12 col-xl-auto'>
          <Image
            width={421}
            height={301}
            src={item.imageSrc}
            alt={item.title}
            className='rounded-12 object-cover admin-listing-image'
          />
        </div>

        <div className='col'>
          <div className='d-flex items-center'>
            <i className='mr-5 icon-pin'></i>
            {item.location}
          </div>

          <div className='mt-5 text-18 lh-15 fw-500'>{item.title}</div>

          <div className='d-flex items-center mt-5'>
            <div className='d-flex x-gap-5 mr-10 text-yellow-2'>
              <Stars star={item.rating} />
            </div>
            <div>
              {item.rating} ({item.ratingCount})
            </div>
          </div>

          <div className='justify-between items-end y-gap-15 pt-5 row'>
            <div className='col-auto'>
              <div className='d-flex items-center'>
                <i className='mr-5 icon-calendar'></i>
                <div className='text-14'>{slotsAvailableLabel}</div>
              </div>
            </div>

            <div className='col-auto'>
              <div className='md:text-left text-right'>
                <div className='lh-14'>${formatNumber(item.price)}</div>
                {pricePrefix}{' '}
                <span className='text-20 fw-500'>${formatNumber(item.fromPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
