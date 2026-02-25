'use client';

import Image from 'next/image';
import { useState } from 'react';

import Calender from '@/components/common/dropdownSearch/Calender';
import RangeSlider from '@/components/common/RangeSlider';
import Stars from '@/components/common/Stars';
import { durations, features, languages, rating, toursTypes } from '@/data/tourFilteringOptions';

export default function Sidebar() {
  const [ddActives, setDdActives] = useState(['tourtype']);
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
                    {toursTypes.map((elm, i) => (
                      <div key={i}>
                        <div className='d-flex items-center'>
                          <div className='form-checkbox'>
                            <input type='checkbox' name='name' />
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

                          <div className='ml-10 lh-11'>{elm}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a href='#' className='d-flex mt-15 text-15 text-accent-2 fw-500'>
                    See More
                  </a>
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
                className='d-flex justify-between items-center mb-10 accordion__button'
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
                  <RangeSlider />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='sidebar__item'>
          <div className='accordion -simple-2 js-accordion'>
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes('duration') ? 'is-active' : ''
              } `}
            >
              <div
                className='d-flex justify-between items-center accordion__button'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes('duration')
                      ? [...pre.filter((elm) => elm != 'duration')]
                      : [...pre, 'duration'],
                  )
                }
              >
                <h5 className='text-18 fw-500'>Duration</h5>

                <div className='flex-center accordion__icon'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={ddActives.includes('duration') ? { maxHeight: '300px' } : {}}
              >
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {durations.map((elm, i) => (
                      <div key={i}>
                        <div className='d-flex items-center'>
                          <div className='form-checkbox'>
                            <input type='checkbox' name='name' />
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

                          <div className='ml-10 lh-11'>{elm}</div>
                        </div>
                      </div>
                    ))}
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
                ddActives.includes('language') ? 'is-active' : ''
              } `}
            >
              <div
                className='d-flex justify-between items-center accordion__button'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes('language')
                      ? [...pre.filter((elm) => elm != 'language')]
                      : [...pre, 'language'],
                  )
                }
              >
                <h5 className='text-18 fw-500'>Language</h5>

                <div className='flex-center accordion__icon'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={ddActives.includes('language') ? { maxHeight: '300px' } : {}}
              >
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {languages.map((elm, i) => (
                      <div key={i}>
                        <div className='d-flex items-center'>
                          <div className='form-checkbox'>
                            <input type='checkbox' name='name' />
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

                          <div className='ml-10 lh-11'>{elm}</div>
                        </div>
                      </div>
                    ))}
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
                      <div key={i} className='d-flex'>
                        <div className='form-checkbox'>
                          <input type='checkbox' name='rating' />
                          <div className='form-checkbox__mark'>
                            <div className='form-checkbox__icon'>
                              <Image width='10' height='8' src='/img/icons/check.svg' alt='icon' />
                            </div>
                          </div>
                        </div>
                        <div className='d-flex x-gap-5 ml-10'>
                          <Stars star={elm} font={13} />
                        </div>
                      </div>
                    ))}
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
                ddActives.includes('features') ? 'is-active' : ''
              } `}
            >
              <div
                className='d-flex justify-between items-center accordion__button'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes('features')
                      ? [...pre.filter((elm) => elm != 'features')]
                      : [...pre, 'features'],
                  )
                }
              >
                <h5 className='text-18 fw-500'>Specials</h5>

                <div className='flex-center accordion__icon'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={ddActives.includes('features') ? { maxHeight: '300px' } : {}}
              >
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {features.map((elm, i) => (
                      <div key={i}>
                        <div className='d-flex items-center'>
                          <div className='form-checkbox'>
                            <input type='checkbox' name='name' />
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

                          <div className='ml-10 lh-11'>{elm}</div>
                        </div>
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
