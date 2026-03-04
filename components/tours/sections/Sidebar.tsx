'use client';

import Image from 'next/image';
import { useState } from 'react';

import Calender from '@/components/common/dropdownSearch/Calender';
import RangeSlider from '@/components/common/RangeSlider';
import Stars from '@/components/common/Stars';
import { rating } from '@/data/tourFilteringOptions';
import useTourTypesQuery from '@/services/tours/hooks/useTourTypesQuery';

type SidebarProps = {
  selectedTourTypeIds: number[];
  onToggleTourType: (tourTypeId: number) => void;
  priceRange: [number, number];
  onPriceRangeChange: (priceRange: [number, number]) => void;
  onPriceRangeCommit: (priceRange: [number, number]) => void;
};

export default function Sidebar({
  selectedTourTypeIds,
  onToggleTourType,
  priceRange,
  onPriceRangeChange,
  onPriceRangeCommit,
}: SidebarProps) {
  const [ddActives, setDdActives] = useState(['tourtype']);
  const tourTypesQuery = useTourTypesQuery();
  const tourTypes = tourTypesQuery.data ?? [];
  return (
    <div className='rounded-12 sidebar -type-1'>
      <div className='bg-accent-1 sidebar__header'>
        <div className='text-15 text-white fw-500'>When are you traveling?</div>

        <div className='mt-10'>
          <div className='searchForm -type-1 -col-1 -narrow' style={{ overflow: 'hidden' }}>
            <div className='searchForm__form'>
              <div className='js-select-control searchFormItem js-form-dd js-calendar'>
                <div className='searchFormItem__button' data-x-click='calendar'>
                  <div className='d-flex items-center pl-calendar'>
                    <i className='mr-15 text-20 icon-calendar'></i>
                    <div>
                      <span className='js-first-date'>
                        <Calender />
                      </span>
                      <span className='js-last-date'></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='sidebar__content'>
        <div className='sidebar__item'>
          <div className='accordion -simple-2 js-accordion'>
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes('tourtype') ? 'is-active' : ''
              } `}
            >
              <div
                className='d-flex justify-between items-center accordion__button'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes('tourtype')
                      ? [...pre.filter((elm) => elm != 'tourtype')]
                      : [...pre, 'tourtype'],
                  )
                }
              >
                <h5 className='text-18 fw-500'>Tour Type</h5>

                <div className='flex-center accordion__icon'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={ddActives.includes('tourtype') ? { maxHeight: '300px' } : {}}
              >
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {tourTypes.map((tourType) => (
                      <div key={tourType.id}>
                        <div className='d-flex items-center'>
                          <div className='cursor-pointer form-checkbox'>
                            <input
                              type='checkbox'
                              id={`tourType-${tourType.id}`}
                              name={`tourType-${tourType.id}`}
                              className='cursor-pointer'
                              checked={selectedTourTypeIds.includes(tourType.id)}
                              onChange={() => onToggleTourType(tourType.id)}
                            />
                            <div className='form-checkbox__mark'>
                              <div className='form-checkbox__icon'>
                                <Image
                                  width='10'
                                  height='8'
                                  src='/img/icons/check.svg'
                                  alt='icon'
                                />
                              </div>
                            </div>
                          </div>

                          <label
                            htmlFor={`tourType-${tourType.id}`}
                            className='ml-10 cursor-pointer lh-11'
                          >
                            {tourType.name}
                          </label>
                        </div>
                      </div>
                    ))}
                    {tourTypesQuery.isLoading ? (
                      <div className='text-14 text-light-1 lh-11'>Loading tour types...</div>
                    ) : null}
                    {!tourTypesQuery.isLoading && tourTypes.length === 0 ? (
                      <div className='text-14 text-light-1 lh-11'>No tour types available.</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='sidebar__item'>
          <div className='accordion -simple-2 js-accordion'>
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes('pricerange') ? 'is-active' : ''
              } `}
            >
              <div
                className='d-flex justify-between items-center accordion__button'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes('pricerange')
                      ? [...pre.filter((elm) => elm != 'pricerange')]
                      : [...pre, 'pricerange'],
                  )
                }
              >
                <h5 className='text-18 fw-500'>Filter Price</h5>

                <div className='flex-center accordion__icon'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={ddActives.includes('pricerange') ? { maxHeight: '300px' } : {}}
              >
                <div className='pt-15'>
                  <RangeSlider
                    value={priceRange}
                    onChange={onPriceRangeChange}
                    onChangeCommitted={onPriceRangeCommit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='sidebar__item'>
          <div className='accordion -simple-2 js-accordion'>
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes('rating') ? 'is-active' : ''
              } `}
            >
              <div
                className='d-flex justify-between items-center accordion__button'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes('rating')
                      ? [...pre.filter((elm) => elm != 'rating')]
                      : [...pre, 'rating'],
                  )
                }
              >
                <h5 className='text-18 fw-500'>Rating</h5>

                <div className='flex-center accordion__icon'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={ddActives.includes('rating') ? { maxHeight: '300px' } : {}}
              >
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {rating.map((elm, i) => (
                      <div key={i} className='d-flex items-center'>
                        <div className='cursor-pointer form-checkbox'>
                          <input
                            type='checkbox'
                            id={`rating-${elm}`}
                            name={`rating-${elm}`}
                            className='cursor-pointer'
                          />
                          <div className='form-checkbox__mark'>
                            <div className='form-checkbox__icon'>
                              <Image width='10' height='8' src='/img/icons/check.svg' alt='icon' />
                            </div>
                          </div>
                        </div>
                        <label
                          htmlFor={`rating-${elm}`}
                          className='d-flex items-center x-gap-5 ml-10 cursor-pointer'
                        >
                          <Stars star={elm} font={13} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
