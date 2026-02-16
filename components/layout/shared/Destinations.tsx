'use client';

import { useEffect, useRef, useState } from 'react';

import { buttonData, tabContent } from '@/content/shared/layoutDestinations';

export default function Destinations() {
  const [currentdestinationTab, setCurrentdestinationTab] = useState(buttonData[0] || '');
  const [currentdd, setCurrentdd] = useState<string>('');
  const dropDownContainer = useRef<HTMLDivElement | null>(null);
  const activeTab =
    tabContent.find((elm) => elm.heading === currentdestinationTab) || tabContent[0];

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const eventTarget = event.target;
      if (
        dropDownContainer.current &&
        eventTarget instanceof Node &&
        !dropDownContainer.current.contains(eventTarget)
      ) {
        setCurrentdd('');
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div ref={dropDownContainer} className='headerDropdown lg:d-none js-form-dd'>
      <div
        className='headerDropdown__button'
        onClick={() => {
          const isOpening = currentdd !== 'destination';
          if (isOpening) setCurrentdestinationTab(buttonData[0] || '');
          setCurrentdd(isOpening ? 'destination' : '');
        }}
      >
        Destinations
        <i className='text-18 icon-chevron-down'></i>
      </div>

      <div className={`headerDropdown__content ${currentdd === 'destination' ? 'is-active' : ''} `}>
        <div className='tabsMenu'>
          <div className='tabsMenu__container'>
            <div className='tabs js-tabs'>
              <div className='tabsMenu__tabs'>
                <div className='tabs__controls js-tabs-controls'>
                  {buttonData.map((elm, i) => (
                    <button
                      onClick={() => setCurrentdestinationTab(elm)}
                      key={i}
                      className={`tabs__button js-tabs-button ${
                        currentdestinationTab === elm ? 'is-tab-el-active' : ''
                      } `}
                      data-tab-target='.-tab-item-1'
                    >
                      {elm}
                    </button>
                  ))}
                </div>
              </div>

              <div className='tabsMenu__content'>
                <div className='tabs__content js-tabs-content'>
                  <div className='tabs__pane -tab-item-1 is-tab-el-active'>
                    <div className='tabsMenu__lists'>
                      {activeTab?.tours?.map((tourGroup, i2) => (
                        <div key={i2} className='tabsMenu-list'>
                          <div className='tabsMenu-list__title'>
                            {activeTab?.heading} Travel Guide
                          </div>
                          <div className='tabsMenu-list__content'>
                            {tourGroup.map((tour) => (
                              <div key={tour.id} className='tabsMenu-list__item'>
                                <a href={tour.href}>{tour.name}</a>
                              </div>
                            ))}
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
    </div>
  );
}
