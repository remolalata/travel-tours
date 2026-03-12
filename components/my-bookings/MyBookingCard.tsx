import Image from 'next/image';
import Link from 'next/link';

import Stars from '@/components/common/Stars';
import type { MyBookingCardData, MyBookingCardLabels } from '@/types/myBookings';
import { formatNumber } from '@/utils/helpers/formatNumber';

type MyBookingCardProps = {
  booking: MyBookingCardData;
  labels: MyBookingCardLabels;
};

function getStatusBadgeClassName(status: string): string {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'completed') {
    return 'bg-green-1 text-green-2';
  }

  if (normalizedStatus === 'cancelled') {
    return 'bg-red-4 text-red-2';
  }

  return 'bg-accent-1-05 text-accent-1';
}

export default function MyBookingCard({ booking, labels }: MyBookingCardProps) {
  return (
    <div className='tourCard -type-2 toursPageTourCard'>
      <div className='tourCard__image'>
        {booking.imageSrc ? (
          <Image width={420} height={390} src={booking.imageSrc} alt={booking.title} />
        ) : (
          <div className='ratio ratio-1:1 rounded-12 bg-light-1 flex-center'>
            <div className='text-14 text-light-2'>{labels.imageUnavailableLabel}</div>
          </div>
        )}
      </div>

      <div className='tourCard__content'>
        <div className='d-flex items-center text-13 text-light-2 tourCard__location'>
          <i className='d-flex mr-5 text-16 text-light-2 icon-pin'></i>
          {booking.location}
        </div>

        <h3 className='mt-5 tourCard__title'>
          <span>{booking.title}</span>
        </h3>

        <div className='d-flex items-center mt-5 text-13 tourCard__rating'>
          <div className='d-flex x-gap-5'>
            <Stars star={booking.rating} />
          </div>

          <span className='ml-10 text-dark-1'>
            {booking.rating} ({booking.ratingCount} {labels.reviewCountLabel})
          </span>
        </div>

        <div className='row x-gap-20 y-gap-10 mt-20'>
          <div className='col-md-6'>
            <div className='text-13 text-light-2'>{labels.checkInLabel}</div>
            <div className='text-14 fw-500 text-dark-1 mt-5'>{booking.checkIn}</div>
          </div>

          <div className='col-md-6'>
            <div className='text-13 text-light-2'>{labels.checkOutLabel}</div>
            <div className='text-14 fw-500 text-dark-1 mt-5'>{booking.checkOut}</div>
          </div>

          <div className='col-md-6'>
            <div className='text-13 text-light-2'>{labels.guestsLabel}</div>
            <div className='text-14 fw-500 text-dark-1 mt-5'>{booking.guests}</div>
          </div>

          <div className='col-md-6'>
            <div className='text-13 text-light-2'>{labels.bookingReferenceLabel}</div>
            <div className='text-14 fw-500 text-dark-1 mt-5'>{booking.bookingReference}</div>
          </div>
        </div>

        <div className='mt-25 pt-20 border-top'>
          <div className='text-13 text-light-2'>{labels.totalAmountLabel}</div>
          <div className='mt-5 text-18 fw-600 text-accent-1'>
            ₱{formatNumber(booking.totalAmount)}
          </div>
        </div>
      </div>

      <div className='tourCard__info'>
        <div>
          <div className='d-flex justify-end'>
            <div
              className={`px-15 py-10 rounded-200 text-13 fw-500 lh-1 ${getStatusBadgeClassName(
                booking.status,
              )}`}
            >
              {booking.status}
            </div>
          </div>
        </div>

        <Link href={booking.receiptHref} className='-outline-accent-1 text-accent-1 button'>
          {labels.receiptCtaLabel}
          <i className='icon-arrow-top-right ml-10'></i>
        </Link>
      </div>
    </div>
  );
}
