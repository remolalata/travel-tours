'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import useAdminTourReferencesQuery from '@/services/admin/tours/hooks/useAdminTourReferencesQuery';
import Calender from '@/components/common/dropdownSearch/Calender';
import Location from '@/components/common/dropdownSearch/Location';
import TourType from '@/components/common/dropdownSearch/TourType';
import { homeContent } from '@/content/features/home';

export default function HomeSearchHero() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const referencesQuery = useAdminTourReferencesQuery();
  const [currentActiveDD, setCurrentActiveDD] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [when, setWhen] = useState<string>('');
  const [tourType, setTourType] = useState<string>('');
  const whenInputId = useId();
  const dropDownContainer = useRef<HTMLDivElement | null>(null);
  const baseDuration = shouldReduceMotion ? 0 : 0.45;
  const viewport = { once: true, amount: 0.35 as const };
  const { hero } = homeContent;
  const locationOptions = useMemo(
    () =>
      (referencesQuery.data?.destinations ?? []).map((destination, index) => ({
        id: Number(destination.value) || index + 1,
        choice: destination.label,
        type: 'Destination',
      })),
    [referencesQuery.data?.destinations],
  );
  const tourTypeOptions = useMemo(
    () => (referencesQuery.data?.tourTypes ?? []).map((tourTypeOption) => tourTypeOption.label),
    [referencesQuery.data?.tourTypes],
  );

  const handleLocationChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setLocation((previousValue) => (typeof value === 'function' ? value(previousValue) : value));
    setCurrentActiveDD('');
  };

  const handleTourTypeChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
    setTourType((previousValue) => (typeof value === 'function' ? value(previousValue) : value));
    setCurrentActiveDD('');
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

  return (
    <section className='hero -type-1'>
      <div className='hero__bg'>
        <Image
          width={1800}
          height={560}
          src='/img/hero.webp'
          alt='image'
          style={{ objectPosition: 'center bottom' }}
        />
        <Image
          width='1800'
          height='40'
          src='/img/hero/1/shape.svg'
          alt='image'
          style={{ height: 'auto' }}
        />
      </div>

      <div className='container'>
        <div className='justify-center row'>
          <div className='col-xl-8 col-lg-10'>
            <div className='hero__content'>
              <motion.h1
                className='hero__title'
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: baseDuration, delay: shouldReduceMotion ? 0 : 0.1 }}
              >
                {hero.title}
              </motion.h1>

              <motion.p
                className='hero__text'
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: baseDuration, delay: shouldReduceMotion ? 0 : 0.2 }}
              >
                {hero.description}
              </motion.p>

              <motion.div
                ref={dropDownContainer}
                className='mt-60 md:mt-35'
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: baseDuration, delay: shouldReduceMotion ? 0 : 0.3 }}
              >
                <div className='searchForm -type-1'>
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
                        <div className='flex-center border rounded-12 size-50 searchFormItem__icon'>
                          <i className='text-20 icon-pin'></i>
                        </div>
                        <div className='searchFormItem__content'>
                          <p className='text-15 fw-500'>{hero.fields.whereLabel}</p>
                          <div className='js-select-control-chosen'>
                            {location ? location : hero.fields.wherePlaceholder}
                          </div>
                        </div>
                      </div>

                      <Location
                        setLocation={handleLocationChange}
                        active={currentActiveDD === 'location'}
                        options={locationOptions}
                      />
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
                        <div className='flex-center border rounded-12 size-50 searchFormItem__icon'>
                          <i className='text-20 icon-calendar'></i>
                        </div>
                        <div className='searchFormItem__content'>
                          <label className='text-15 fw-500' htmlFor={whenInputId}>
                            {hero.fields.whenLabel}
                          </label>
                          <div>
                            <span className='js-first-date'>
                              <Calender
                                active={currentActiveDD === 'calender'}
                                inputId={whenInputId}
                                onValueChange={(displayValue) => setWhen(displayValue)}
                              />
                            </span>
                            <span className='js-last-date'></span>
                          </div>
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
                        <div className='flex-center border rounded-12 size-50 searchFormItem__icon'>
                          <i className='text-20 icon-flag'></i>
                        </div>
                        <div className='searchFormItem__content'>
                          <p className='text-15 fw-500'>{hero.fields.tourTypeLabel}</p>
                          <div className='js-select-control-chosen'>
                            {tourType ? tourType : hero.fields.tourTypePlaceholder}
                          </div>
                        </div>
                      </div>

                      <TourType
                        setTourType={handleTourTypeChange}
                        active={currentActiveDD === 'tourType'}
                        options={tourTypeOptions}
                      />
                    </div>
                  </div>

                  <div className='searchForm__button'>
                    <button
                      type='button'
                      onClick={() => {
                        setCurrentActiveDD('');

                        const quoteSearchParams = new URLSearchParams();
                        if (location) quoteSearchParams.set('where', location);
                        if (when) quoteSearchParams.set('when', when);
                        if (tourType) quoteSearchParams.set('tourType', tourType);

                        const searchParamsString = quoteSearchParams.toString();
                        router.push(
                          searchParamsString ? `/get-quote?${searchParamsString}` : '/get-quote',
                        );
                      }}
                      className='text-white bg-accent-1 button -dark-1'
                    >
                      <i className='mr-10 text-16 icon-search'></i>
                      {hero.submitLabel}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
