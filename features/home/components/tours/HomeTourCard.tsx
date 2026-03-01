'use client';

import Image from 'next/image';
import Link from 'next/link';

import Stars from '@/components/common/Stars';
import type { TourBase } from '@/types/tour';
import { formatNumber } from '@/utils/helpers/formatNumber';

type HomeTourCardItem = TourBase & {
  slug?: string | null;
};

type HomeTourCardProps = {
  item: HomeTourCardItem;
  favoriteLabel: string;
  pricePrefix: string;
  className?: string;
  currencySymbol?: string;
};

export default function HomeTourCard({
  item,
  favoriteLabel,
  pricePrefix,
  className,
  currencySymbol = '₱',
}: HomeTourCardProps) {
  const durationLabel = item.duration ?? 'See dates';

  return (
    <Link
      href={`/tour/${item.slug ?? item.id}`}
      className={className ?? '-hover-shadow px-10 py-10 border rounded-12 tourCard -type-1'}
    >
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

        <button
          className='tourCard__favorite'
          aria-label={favoriteLabel}
          title={favoriteLabel}
          type='button'
        >
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
            <i className='mr-5 text-16 icon-clock'></i>
            {durationLabel}
          </div>

          <div>
            {pricePrefix}{' '}
            <span className='text-16 fw-500'>
              {currencySymbol}
              {formatNumber(item.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
