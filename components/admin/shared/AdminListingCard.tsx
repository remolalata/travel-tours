import Box from '@mui/material/Box';
import Image from 'next/image';

import Stars from '@/components/common/Stars';
import type { AdminListingContent, AdminListingItem } from '@/types/admin';
import { formatNumber } from '@/utils/helpers/formatNumber';

type AdminListingCardProps = {
  item: AdminListingItem;
  compact?: boolean;
  actionLabels: AdminListingContent['actions'];
  pricePrefix: string;
  availabilityDateLabels: AdminListingContent['availabilityDateLabels'];
  onEditClick?: (item: AdminListingItem) => void;
  onDeleteClick?: (item: AdminListingItem) => void;
};

export default function AdminListingCard({
  item,
  compact = false,
  actionLabels,
  pricePrefix,
  availabilityDateLabels,
  onEditClick,
  onDeleteClick,
}: AdminListingCardProps) {
  const currentPrice = item.price;
  const originalPrice = item.fromPrice;
  const hasCurrentPrice = typeof currentPrice === 'number';
  const hasOriginalPrice = typeof originalPrice === 'number';
  const primaryPrice = currentPrice ?? originalPrice;
  const departureLabel =
    item.departureCount === 1 ? availabilityDateLabels.singular : availabilityDateLabels.plural;
  const departureSummary = `${item.departureCount} ${departureLabel}`;

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
              {departureSummary}
            </div>

            <div>
              {hasCurrentPrice && hasOriginalPrice ? (
                <>
                  <div className='lh-14'>${formatNumber(currentPrice)}</div>
                  {pricePrefix}{' '}
                  <span className='text-16 fw-500'>${formatNumber(originalPrice)}</span>
                </>
              ) : primaryPrice !== null ? (
                <>
                  {pricePrefix}{' '}
                  <span className='text-16 fw-500'>${formatNumber(primaryPrice)}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        border: '1px solid rgba(229, 231, 235, 1)',
        borderRadius: '12px',
        px: '20px',
        py: '20px',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          borderColor: 'rgba(235, 102, 43, 0.28)',
          boxShadow: '0 14px 32px rgba(5, 7, 60, 0.08)',
        },
        '&:hover .adminListingCard__actions': {
          opacity: 1,
          transform: 'translateY(0)',
          pointerEvents: 'auto',
        },
      }}
    >
      <Box
        className='adminListingCard__actions'
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          gap: 1,
          opacity: 0,
          transform: 'translateY(-4px)',
          pointerEvents: 'none',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          zIndex: 2,
        }}
      >
        <button
          type='button'
          aria-label={actionLabels.editLabel}
          title={actionLabels.editLabel}
          onClick={() => onEditClick?.(item)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 10,
            border: '1px solid rgba(5, 7, 60, 0.08)',
            background: '#fff',
            color: '#05073c',
            boxShadow: '0 10px 24px rgba(5, 7, 60, 0.08)',
          }}
        >
          <i className='icon-pencil text-14' aria-hidden='true'></i>
        </button>

        <button
          type='button'
          aria-label={actionLabels.deleteLabel}
          title={actionLabels.deleteLabel}
          onClick={() => onDeleteClick?.(item)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 10,
            border: '1px solid rgba(179, 38, 30, 0.12)',
            background: '#fff',
            color: '#b3261e',
            boxShadow: '0 10px 24px rgba(5, 7, 60, 0.08)',
          }}
        >
          <i className='icon-delete text-14' aria-hidden='true'></i>
        </button>
      </Box>

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
                <div className='text-14'>{departureSummary}</div>
              </div>
            </div>

            <div className='col-auto'>
              <div className='md:text-left text-right'>
                {hasCurrentPrice && hasOriginalPrice ? (
                  <>
                    <div className='lh-14'>${formatNumber(currentPrice)}</div>
                    {pricePrefix}{' '}
                    <span className='text-20 fw-500'>${formatNumber(originalPrice)}</span>
                  </>
                ) : primaryPrice !== null ? (
                  <>
                    {pricePrefix}{' '}
                    <span className='text-20 fw-500'>${formatNumber(primaryPrice)}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}
