'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Calender from '@/components/common/dropdownSearch/Calender';
import Location from '@/components/common/dropdownSearch/Location';
import TourType from '@/components/common/dropdownSearch/TourType';
import AppToast from '@/components/common/feedback/AppToast';
import { tourSingleContent } from '@/content/features/tourSingle';
import type { TourContent } from '@/data/tourSingleContent';
import TourBookingPaymentModal from '@/features/tour-single/components/sections/TourBookingPaymentModal';
import useTourSingleBookingPaymentFlow from '@/features/tour-single/hooks/useTourSingleBookingPaymentFlow';
import type { Tour } from '@/types/tour';
import { formatNumber } from '@/utils/helpers/formatNumber';
import { createClient } from '@/utils/supabase/client';

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

const CHECKOUT_RESUME_QUERY = 'resumeCheckout';

export default function TourSingleSidebar({ tour, destinationId }: TourSingleSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabaseRef = useRef(createClient());
  const hasHandledResumeRef = useRef(false);
  const { sidebar } = tourSingleContent;
  const dropDownContainer = useRef<HTMLDivElement | null>(null);
  const [currentActiveDD, setCurrentActiveDD] = useState('');
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);
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

  const getPendingCheckoutStorageKey = () => `tour_checkout_resume:${tour?.id ?? 'unknown'}`;

  const persistPendingCheckoutDraft = () => {
    try {
      window.sessionStorage.setItem(
        getPendingCheckoutStorageKey(),
        JSON.stringify({
          when,
          location,
          tourType,
          formState: bookingFlow.formState,
        }),
      );
    } catch {
      // Ignore session storage failures and continue with login redirect.
    }
  };

  const restorePendingCheckoutDraft = () => {
    try {
      const rawValue = window.sessionStorage.getItem(getPendingCheckoutStorageKey());
      if (!rawValue) {
        return;
      }

      const parsed = JSON.parse(rawValue) as {
        when?: string;
        location?: string;
        tourType?: string;
        formState?: {
          adults?: string;
          children?: string;
          paymentOption?: 'full' | 'partial' | 'reserve';
          notes?: string;
        };
      };

      if (typeof parsed.when === 'string') {
        setWhen(parsed.when);
      }
      if (typeof parsed.location === 'string') {
        setLocation(parsed.location);
      }
      if (typeof parsed.tourType === 'string') {
        setTourType(parsed.tourType);
      }

      if (parsed.formState?.adults) {
        bookingFlow.updateField('adults', parsed.formState.adults);
      }
      if (parsed.formState?.children) {
        bookingFlow.updateField('children', parsed.formState.children);
      }
      if (parsed.formState?.paymentOption) {
        bookingFlow.updateField('paymentOption', parsed.formState.paymentOption);
      }
      if (typeof parsed.formState?.notes === 'string') {
        bookingFlow.updateField('notes', parsed.formState.notes);
      }

      bookingFlow.open();
      window.sessionStorage.removeItem(getPendingCheckoutStorageKey());
    } catch {
      // Ignore invalid resume payload and continue.
    }
  };

  const buildLoginRedirectPath = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(CHECKOUT_RESUME_QUERY, '1');
    const nextPath = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    return `/login?next=${encodeURIComponent(nextPath)}`;
  };

  const clearResumeQuery = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(CHECKOUT_RESUME_QUERY);
    const nextPath = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(nextPath, { scroll: false });
  };

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

  useEffect(() => {
    if (hasHandledResumeRef.current || searchParams.get(CHECKOUT_RESUME_QUERY) !== '1') {
      return;
    }

    hasHandledResumeRef.current = true;

    const continueAfterLogin = async () => {
      const {
        data: { user },
      } = await supabaseRef.current.auth.getUser();

      if (user) {
        restorePendingCheckoutDraft();
      }
      clearResumeQuery();
    };

    void continueAfterLogin();
  }, [pathname, router, searchParams]);

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
          onClick={async () => {
            if (!when) {
              setToastState({
                open: true,
                severity: 'error',
                message: sidebar.paymentFlow.toasts.missingDates,
              });
              return;
            }

            const {
              data: { user },
            } = await supabaseRef.current.auth.getUser();

            if (!user) {
              persistPendingCheckoutDraft();
              router.push(buildLoginRedirectPath());
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
          if (!isValid || isSubmittingCheckout || !tour || typeof destinationId !== 'number') {
            return;
          }

          try {
            setIsSubmittingCheckout(true);

            const response = await fetch('/api/paymongo/checkout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                tourId: tour.id,
                travelDateRange: when,
                adults: bookingFlow.formState.adults,
                children: bookingFlow.formState.children,
                paymentOption: bookingFlow.formState.paymentOption,
                notes: bookingFlow.formState.notes.trim(),
                location,
                tourType,
                destinationId,
              }),
            });

            const payload = (await response.json()) as {
              checkoutUrl?: string;
              bookingReference?: string;
              error?: string;
            };

            if (!response.ok || !payload.checkoutUrl) {
              throw new Error(payload.error || 'Checkout creation failed.');
            }

            window.location.href = payload.checkoutUrl;
          } catch (error) {
            setToastState({
              open: true,
              severity: 'error',
              message: error instanceof Error ? error.message : sidebar.paymentFlow.toasts.error,
            });
          } finally {
            setIsSubmittingCheckout(false);
          }
        }}
        isSubmitting={isSubmittingCheckout}
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
