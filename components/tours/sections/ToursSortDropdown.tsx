'use client';

import { useEffect, useRef, useState } from 'react';

import type { ToursListSortOption } from '@/services/tours/helpers/toursListSort';

type ToursSortDropdownProps = {
  label: string;
  valueLabel: string;
  options: readonly ToursListSortOption[];
  onSelect: (value: string) => void;
};

export default function ToursSortDropdown({
  label,
  valueLabel,
  options,
  onSelect,
}: ToursSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const eventTarget = event.target;

      if (
        containerRef.current &&
        eventTarget instanceof Node &&
        !containerRef.current.contains(eventTarget)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div ref={containerRef} className='col-auto'>
      <div className={`dropdown -type-2 js-dropdown js-form-dd ${isOpen ? 'is-active' : ''} `}>
        <div
          className='dropdown__button js-button'
          onClick={() => setIsOpen((previous) => !previous)}
        >
          <span>{label}</span>
          <span className='js-title'>{valueLabel}</span>
          <i className='icon-chevron-down'></i>
        </div>

        <div className='dropdown__menu js-menu-items'>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className='dropdown__item'
              data-value={option.value}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
