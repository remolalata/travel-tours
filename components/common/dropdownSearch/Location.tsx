'use client';

import { locations } from '@/data/searchDDLocations';

interface LocationProps {
  active: boolean;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

export default function Location({ active, setLocation }: LocationProps) {
  return (
    <div
      className={`searchFormItemDropdown -location ${active ? 'is-active' : ''} `}
      data-x='location'
      data-x-toggle='is-active'
    >
      <div className='searchFormItemDropdown__container'>
        <div className='searchFormItemDropdown__list sroll-bar-1'>
          {locations.map((elm) => (
            <div
              onClick={() =>
                setLocation((previousValue) => (previousValue === elm.choice ? '' : elm.choice))
              }
              key={elm.id}
              className='searchFormItemDropdown__item'
            >
              <button className='js-select-control-button'>
                <span className='js-select-control-choice'>{elm.choice}</span>
                <span>{elm.type}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
