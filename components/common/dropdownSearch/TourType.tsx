'use client';
import type { Dispatch, SetStateAction } from 'react';

import { tourTypeOptions } from '@/content/shared/tourTypeOptions';

interface TourTypeProps {
  active: boolean;
  setTourType: Dispatch<SetStateAction<string>>;
  options?: readonly string[];
}

export default function TourType({ active, setTourType, options }: TourTypeProps) {
  const typeOptions = options?.length ? options : tourTypeOptions;

  return (
    <div
      className={`searchFormItemDropdown -tour-type ${active ? 'is-active' : ''} `}
      data-x='tour-type'
      data-x-toggle='is-active'
    >
      <div className='searchFormItemDropdown__container'>
        <div className='searchFormItemDropdown__list sroll-bar-1'>
          {typeOptions.map((elm) => (
            <div
              onClick={() => setTourType((previousValue) => (previousValue === elm ? '' : elm))}
              key={elm}
              className='searchFormItemDropdown__item'
            >
              <button className='js-select-control-button'>
                <span className='js-select-control-choice'>{elm}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
