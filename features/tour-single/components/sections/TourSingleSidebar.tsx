'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Calender from '@/components/common/dropdownSearch/Calender';
import Location from '@/components/common/dropdownSearch/Location';
import TourType from '@/components/common/dropdownSearch/TourType';
import type { Tour } from '@/data/tours';
import type { TourContent } from '@/data/tourSingleContent';
import { formatNumber } from '@/utils/helpers/formatNumber';

interface TourSingleSidebarProps {
  tour?: Tour;
  tourContent?: TourContent;
}

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

export default function TourSingleSidebar({ tour }: TourSingleSidebarProps) {
  const router = useRouter();
  const dropDownContainer = useRef<HTMLDivElement | null>(null);
  const [currentActiveDD, setCurrentActiveDD] = useState('');
  const [location, setLocation] = useState(() => tour?.location.split(',')[0]?.trim() ?? '');
  const [when, setWhen] = useState('');
  const [tourType, setTourType] = useState(() => inferTourType(tour));

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
    <div className='tourSingleSidebar'>
      <div className='d-flex items-center'>
        <div>From</div>
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
                <h5>Where</h5>
                <div className='js-select-control-chosen'>
                  {location ? location : 'Search destinations'}
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
                <h5>When</h5>
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
                <h5>Tour Type</h5>
                <div className='js-select-control-chosen'>{tourType ? tourType : 'All tour'}</div>
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
          const quoteSearchParams = new URLSearchParams();

          if (location) quoteSearchParams.set('where', location);
          if (tourType) quoteSearchParams.set('tourType', tourType);
          if (when) quoteSearchParams.set('when', when);

          const searchParamsString = quoteSearchParams.toString();
          router.push(searchParamsString ? `/get-quote?${searchParamsString}` : '/get-quote');
        }}
      >
        Get a Quote
        <i className='icon-arrow-top-right ml-10'></i>
      </button>
    </div>
  );
}
