'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import useCreateSimulatedBookingMutation from '@/api/bookings/hooks/useCreateSimulatedBookingMutation';
import Calender from '@/components/common/dropdownSearch/Calender';
import Location from '@/components/common/dropdownSearch/Location';
import TourType from '@/components/common/dropdownSearch/TourType';
import AppToast from '@/components/common/feedback/AppToast';
import { tourSingleContent } from '@/content/features/tourSingle';
import type { Tour } from '@/data/tours';
import type { TourContent } from '@/data/tourSingleContent';
import TourBookingPaymentModal from '@/features/tour-single/components/sections/TourBookingPaymentModal';
import useTourSingleBookingPaymentFlow from '@/features/tour-single/hooks/useTourSingleBookingPaymentFlow';
import { formatNumber } from '@/utils/helpers/formatNumber';

interface TourSingleSidebarProps {
  tour?: Tour & { tourTypeName?: string | null };
  tourContent?: TourContent;
  destinationId?: number;
}

const getTourDestinationName = (tour?: Tour): string => {
  if (!tour?.location) return '';

  return tour.location.split(',')[0]?.trim() ?? '';
};

const inferTourType = (tour?: Tour): string => {
  if (!tour) return '';

  const title = tour.title.toLowerCase();
  const location = tour.location.toLowerCase();

  if (title.includes('island hopping')) return 'Island Hopping';
  if (title.includes('beach')) return 'Beach Getaway';
  if (title.includes('city')) return 'City Tour';
  if (title.includes('heritage') || title.includes('cultural')) return 'Cultural & Heritage';
  if (title.includes('family')) return 'Family Package';
  if (title.includes('honeymoon') || title.includes('romantic')) return 'Honeymoon Package';
  if (title.includes('adventure') || title.includes('surf') || title.includes('snorkel')) {
    return 'Adventure Tour';
  }
  if (!location.includes('philippines')) return 'International Tour';

  return '';
};

const getTourTypeForQuote = (tour?: Tour & { tourTypeName?: string | null }): string => {
  const mappedTourType = tour?.tourTypeName?.trim();

  if (mappedTourType) {
    return mappedTourType;
  }

  return inferTourType(tour);
};

export default function TourSingleSidebar({ tour, destinationId }: TourSingleSidebarProps) {
  const { sidebar } = tourSingleContent;
  const dropDownContainer = useRef<HTMLDivElement | null>(null);
  const createBookingMutation = useCreateSimulatedBookingMutation();
  const [currentActiveDD, setCurrentActiveDD] = useState('');
  const [location, setLocation] = useState(() => getTourDestinationName(tour));
  const [when, setWhen] = useState('');
  const [tourType, setTourType] = useState(() => getTourTypeForQuote(tour));
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const bookingFlow = useTourSingleBookingPaymentFlow({
    baseTourPrice: tour?.price ?? 0,
    when,
  });
  const paymentOptionLabel = useMemo(
    () =>
      sidebar.paymentFlow.paymentOptions.find((option) => option.value === bookingFlow.formState.paymentOption)
        ?.label ?? bookingFlow.formState.paymentOption,
    [bookingFlow.formState.paymentOption, sidebar.paymentFlow.paymentOptions],
  );

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const eventTarget = event.target;

      if (
        dropDownContainer.current &&
        eventTarget instanceof Node &&
        !dropDownContainer.current.contains(eventTarget)
      ) {
        setCurrentActiveDD('');
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <div className='tourSingleSidebar'>
        <div className='d-flex items-center'>
          <div>{sidebar.pricePrefix}</div>
          <div className='ml-10 text-20 fw-500'>₱{formatNumber(tour?.price ?? 1200)}</div>
        </div>

        <div ref={dropDownContainer} className='mt-20 searchForm -type-1 -sidebar'>
          <div className='searchForm__form'>
            <div className='js-select-control searchFormItem js-form-dd'>
              <div
                className='searchFormItem__button'
                onClick={() =>
                  setCurrentActiveDD((previousValue) =>
                    previousValue === 'location' ? '' : 'location',
                  )
                }
              >
                <div className='flex-center bg-light-1 rounded-12 size-50 searchFormItem__icon'>
                  <i className='text-20 icon-pin'></i>
                </div>
                <div className='searchFormItem__content'>
                  <h5>{sidebar.fields.whereLabel}</h5>
                  <div className='js-select-control-chosen'>
                    {location ? location : sidebar.fields.wherePlaceholder}
                  </div>
                </div>
              </div>

              <Location setLocation={setLocation} active={currentActiveDD === 'location'} />
            </div>

            <div className='js-select-control searchFormItem js-form-dd js-calendar'>
              <div
                className='searchFormItem__button'
                onClick={() =>
                  setCurrentActiveDD((previousValue) =>
                    previousValue === 'calender' ? '' : 'calender',
                  )
                }
              >
                <div className='flex-center bg-light-1 rounded-12 size-50 searchFormItem__icon'>
                  <i className='text-20 icon-calendar'></i>
                </div>
                <div className='searchFormItem__content'>
                  <h5>{sidebar.fields.whenLabel}</h5>
                  <div>
                    <span className='js-first-date'>
                      <Calender
                        active={currentActiveDD === 'calender'}
                        onValueChange={(displayValue) => setWhen(displayValue)}
                      />
                    </span>
                    <span className='js-last-date'></span>
                  </div>
                </div>
                <div className='searchFormItem__icon_chevron'>
                  <i className='d-flex text-18 icon-chevron-down'></i>
                </div>
              </div>
            </div>

            <div className='js-select-control searchFormItem js-form-dd'>
              <div
                className='searchFormItem__button'
                onClick={() =>
                  setCurrentActiveDD((previousValue) =>
                    previousValue === 'tourType' ? '' : 'tourType',
                  )
                }
              >
                <div className='flex-center bg-light-1 rounded-12 size-50 searchFormItem__icon'>
                  <i className='text-20 icon-flag'></i>
                </div>
                <div className='searchFormItem__content'>
                  <h5>{sidebar.fields.tourTypeLabel}</h5>
                  <div className='js-select-control-chosen'>
                    {tourType ? tourType : sidebar.fields.tourTypePlaceholder}
                  </div>
                </div>
                <div className='searchFormItem__icon_chevron'>
                  <i className='d-flex text-18 icon-chevron-down'></i>
                </div>
              </div>

              <TourType setTourType={setTourType} active={currentActiveDD === 'tourType'} />
            </div>
          </div>
        </div>

        <button
          type='button'
          className='mt-20 text-white bg-accent-1 button -md -dark-1 col-12'
          onClick={() => {
            if (!when) {
              setToastState({
                open: true,
                severity: 'error',
                message: sidebar.paymentFlow.toasts.missingDates,
              });
              return;
            }
            bookingFlow.open();
          }}
        >
          {sidebar.ctaLabel}
          <i className='icon-arrow-top-right ml-10'></i>
        </button>
      </div>

      <TourBookingPaymentModal
        open={bookingFlow.isOpen}
        onClose={bookingFlow.close}
        onConfirm={async () => {
          const { isValid } = bookingFlow.validate();
          if (!isValid || createBookingMutation.isPending || !tour || typeof destinationId !== 'number') {
            return;
          }

          try {
            const result = await createBookingMutation.mutateAsync({
              destinationId,
              packageTitle: tour.title,
              travelDateRange: when,
              numberOfTravelers: bookingFlow.totals.travelers,
              totalAmount: bookingFlow.totals.totalAmount,
              amountToChargeNow: bookingFlow.totals.amountToChargeNow,
              paymentOption: bookingFlow.formState.paymentOption,
              notes: [
                bookingFlow.formState.notes.trim(),
                `Location: ${location || '-'}`,
                `Tour Type: ${tourType || '-'}`,
                `Simulation Payment Option: ${paymentOptionLabel}`,
              ]
                .filter(Boolean)
                .join(' | '),
            });

            bookingFlow.close();
            bookingFlow.reset();
            setToastState({
              open: true,
              severity: 'success',
              message: `${sidebar.paymentFlow.toasts.successPrefix} ${result.bookingReference}.`,
            });
          } catch {
            setToastState({
              open: true,
              severity: 'error',
              message: sidebar.paymentFlow.toasts.error,
            });
          }
        }}
        isSubmitting={createBookingMutation.isPending}
        location={location}
        when={when}
        tourType={tourType}
        formState={bookingFlow.formState}
        fieldErrors={bookingFlow.fieldErrors}
        totals={bookingFlow.totals}
        onFieldChange={bookingFlow.updateField}
      />

      <AppToast
        open={toastState.open}
        message={toastState.message}
        severity={toastState.severity}
        onClose={() => setToastState((previousValue) => ({ ...previousValue, open: false }))}
      />
    </>
  );
}
