'use client';
import React from 'react';

export const tourTypeOptions = [
  'Island Hopping',
  'Beach Getaway',
  'City Tour',
  'Cultural & Heritage',
  'Family Package',
  'Honeymoon Package',
  'International Tour',
  'Adventure Tour',
];

interface TourTypeProps {
  active: boolean;
  setTourType: React.Dispatch<React.SetStateAction<string>>;
}

export default function TourType({ active, setTourType }: TourTypeProps) {
  return (
    <div
      className={`searchFormItemDropdown -tour-type ${active ? 'is-active' : ''} `}
      data-x='tour-type'
      data-x-toggle='is-active'
    >
      <div className='searchFormItemDropdown__container'>
        <div className='searchFormItemDropdown__list sroll-bar-1'>
          {tourTypeOptions.map((elm) => (
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
