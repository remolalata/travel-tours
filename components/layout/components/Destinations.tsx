'use client';

import { useState, useEffect, useRef } from 'react';

interface DestinationLink {
  id: number;
  name: string;
  href: string;
}

interface DestinationTab {
  heading: string;
  tours: DestinationLink[][];
}

const buttonData = [
  'Philippines',
  'Southeast Asia Highlights',
  'Beach Escapes',
  'City Breaks',
  'Nature & Adventure',
  'Culture & Heritage',
  'Family Friendly',
  'Seasonal Promos',
];

const tabContent: DestinationTab[] = [
  {
    heading: 'Philippines',
    tours: [
      [
        { id: 1, name: 'Boracay Tours', href: '#' },
        { id: 2, name: 'Palawan Tours', href: '#' },
        { id: 3, name: 'Cebu Tours', href: '#' },
        { id: 4, name: 'Bohol Tours', href: '#' },
        { id: 5, name: 'Siargao Tours', href: '#' },
        { id: 6, name: 'Baguio Tours', href: '#' },
        { id: 7, name: 'Davao Tours', href: '#' },
        { id: 8, name: 'Iloilo Tours', href: '#' },
        { id: 9, name: 'Batanes Tours', href: '#' },
        { id: 10, name: 'Vigan Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Manila Tours', href: '#' },
        { id: 12, name: 'Tagaytay Tours', href: '#' },
        { id: 13, name: 'Bicol Tours', href: '#' },
        { id: 14, name: 'Siquijor Tours', href: '#' },
        { id: 15, name: 'Camiguin Tours', href: '#' },
        { id: 16, name: 'Bacolod Tours', href: '#' },
        { id: 17, name: 'Cagayan de Oro Tours', href: '#' },
        { id: 18, name: 'Zamboanga Tours', href: '#' },
        { id: 19, name: 'Puerto Princesa Tours', href: '#' },
        { id: 20, name: 'Coron Tours', href: '#' },
      ],
      [
        { id: 21, name: 'El Nido Tours', href: '#' },
        { id: 22, name: 'Samar Tours', href: '#' },
        { id: 23, name: 'Leyte Tours', href: '#' },
        { id: 24, name: 'General Santos Tours', href: '#' },
        { id: 25, name: 'Ilocos Tours', href: '#' },
        { id: 26, name: 'La Union Tours', href: '#' },
        { id: 27, name: 'Dumaguete Tours', href: '#' },
        { id: 28, name: 'Subic Tours', href: '#' },
        { id: 29, name: 'Clark Tours', href: '#' },
        { id: 30, name: 'Anilao Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Southeast Asia Highlights',
    tours: [
      [
        { id: 1, name: 'Singapore Tours', href: '#' },
        { id: 2, name: 'Bangkok Tours', href: '#' },
        { id: 3, name: 'Kuala Lumpur Tours', href: '#' },
        { id: 4, name: 'Bali Tours', href: '#' },
        { id: 5, name: 'Jakarta Tours', href: '#' },
        { id: 6, name: 'Ho Chi Minh Tours', href: '#' },
        { id: 7, name: 'Hanoi Tours', href: '#' },
        { id: 8, name: 'Phnom Penh Tours', href: '#' },
        { id: 9, name: 'Siem Reap Tours', href: '#' },
        { id: 10, name: 'Vientiane Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Luang Prabang Tours', href: '#' },
        { id: 12, name: 'Yangon Tours', href: '#' },
        { id: 13, name: 'Da Nang Tours', href: '#' },
        { id: 14, name: 'Bandung Tours', href: '#' },
        { id: 15, name: 'Surabaya Tours', href: '#' },
        { id: 16, name: 'Penang Tours', href: '#' },
        { id: 17, name: 'Langkawi Tours', href: '#' },
        { id: 18, name: 'Johor Bahru Tours', href: '#' },
        { id: 19, name: 'Chiang Mai Tours', href: '#' },
        { id: 20, name: 'Phuket Tours', href: '#' },
      ],
      [
        { id: 21, name: 'Krabi Tours', href: '#' },
        { id: 22, name: 'Pattaya Tours', href: '#' },
        { id: 23, name: 'Ubud Tours', href: '#' },
        { id: 24, name: 'Nusa Dua Tours', href: '#' },
        { id: 25, name: 'Yogyakarta Tours', href: '#' },
        { id: 26, name: 'Cebu to Singapore Tours', href: '#' },
        { id: 27, name: 'Manila to Bangkok Tours', href: '#' },
        { id: 28, name: 'ASEAN Multi-City Tours', href: '#' },
        { id: 29, name: 'Mekong Discovery Tours', href: '#' },
        { id: 30, name: 'Southeast Asia Sampler Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Beach Escapes',
    tours: [
      [
        { id: 1, name: 'Boracay White Beach Tours', href: '#' },
        { id: 2, name: 'El Nido Island Hopping Tours', href: '#' },
        { id: 3, name: 'Coron Lagoon Tours', href: '#' },
        { id: 4, name: 'Siargao Surf Tours', href: '#' },
        { id: 5, name: 'Bohol Panglao Tours', href: '#' },
        { id: 6, name: 'Cebu Moalboal Tours', href: '#' },
        { id: 7, name: 'Camiguin Beach Tours', href: '#' },
        { id: 8, name: 'Siquijor Beach Tours', href: '#' },
        { id: 9, name: 'Phuket Island Tours', href: '#' },
        { id: 10, name: 'Bali Beach Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Krabi Beach Tours', href: '#' },
        { id: 12, name: 'Langkawi Beach Tours', href: '#' },
        { id: 13, name: 'Nha Trang Beach Tours', href: '#' },
        { id: 14, name: 'Da Nang Beach Tours', href: '#' },
        { id: 15, name: 'Lombok Beach Tours', href: '#' },
        { id: 16, name: 'Koh Samui Tours', href: '#' },
        { id: 17, name: 'Palawan Beach Getaways', href: '#' },
        { id: 18, name: 'Batangas Beach Tours', href: '#' },
        { id: 19, name: 'Zambales Beach Tours', href: '#' },
        { id: 20, name: 'Subic Beach Tours', href: '#' },
      ],
      [
        { id: 21, name: 'Bataan Beach Tours', href: '#' },
        { id: 22, name: 'La Union Surf Tours', href: '#' },
        { id: 23, name: 'Apo Island Tours', href: '#' },
        { id: 24, name: 'Honda Bay Tours', href: '#' },
        { id: 25, name: 'Caramoan Island Tours', href: '#' },
        { id: 26, name: 'Malapascua Tours', href: '#' },
        { id: 27, name: 'Bantayan Island Tours', href: '#' },
        { id: 28, name: 'Kalanggaman Tours', href: '#' },
        { id: 29, name: 'Samal Island Tours', href: '#' },
        { id: 30, name: 'ASEAN Beach Hopping Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'City Breaks',
    tours: [
      [
        { id: 1, name: 'Manila City Tours', href: '#' },
        { id: 2, name: 'Cebu City Tours', href: '#' },
        { id: 3, name: 'Davao City Tours', href: '#' },
        { id: 4, name: 'Iloilo City Tours', href: '#' },
        { id: 5, name: 'Bacolod City Tours', href: '#' },
        { id: 6, name: 'Singapore City Tours', href: '#' },
        { id: 7, name: 'Bangkok City Tours', href: '#' },
        { id: 8, name: 'Kuala Lumpur City Tours', href: '#' },
        { id: 9, name: 'Hanoi City Tours', href: '#' },
        { id: 10, name: 'Ho Chi Minh City Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Jakarta City Tours', href: '#' },
        { id: 12, name: 'Bandung City Tours', href: '#' },
        { id: 13, name: 'Penang City Tours', href: '#' },
        { id: 14, name: 'Chiang Mai City Tours', href: '#' },
        { id: 15, name: 'Phnom Penh City Tours', href: '#' },
        { id: 16, name: 'Siem Reap City Tours', href: '#' },
        { id: 17, name: 'Vientiane City Tours', href: '#' },
        { id: 18, name: 'Tagaytay City Tours', href: '#' },
        { id: 19, name: 'Baguio City Tours', href: '#' },
        { id: 20, name: 'Vigan Heritage City Tours', href: '#' },
      ],
      [
        { id: 21, name: 'Clark City Tours', href: '#' },
        { id: 22, name: 'Subic City Tours', href: '#' },
        { id: 23, name: 'General Santos City Tours', href: '#' },
        { id: 24, name: 'Cagayan de Oro City Tours', href: '#' },
        { id: 25, name: 'Puerto Princesa City Tours', href: '#' },
        { id: 26, name: 'Johor Bahru City Tours', href: '#' },
        { id: 27, name: 'Yogyakarta City Tours', href: '#' },
        { id: 28, name: 'Surabaya City Tours', href: '#' },
        { id: 29, name: 'Da Nang City Breaks', href: '#' },
        { id: 30, name: 'ASEAN Capital City Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Nature & Adventure',
    tours: [
      [
        { id: 1, name: 'Bohol Countryside Adventure Tours', href: '#' },
        { id: 2, name: 'Palawan Underground River Tours', href: '#' },
        { id: 3, name: 'Siargao Adventure Tours', href: '#' },
        { id: 4, name: 'Cebu Canyoneering Tours', href: '#' },
        { id: 5, name: 'Bicol Volcano Tours', href: '#' },
        { id: 6, name: 'Sagada Mountain Tours', href: '#' },
        { id: 7, name: 'Banaue Rice Terraces Tours', href: '#' },
        { id: 8, name: 'Davao Highland Tours', href: '#' },
        { id: 9, name: 'Camiguin Nature Tours', href: '#' },
        { id: 10, name: 'Samar Cave Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Bukidnon Adventure Tours', href: '#' },
        { id: 12, name: 'Mt. Pulag Trekking Tours', href: '#' },
        { id: 13, name: 'Mt. Apo Trekking Tours', href: '#' },
        { id: 14, name: 'Coron Reef Adventure Tours', href: '#' },
        { id: 15, name: 'El Nido Kayak Tours', href: '#' },
        { id: 16, name: 'Krabi Adventure Tours', href: '#' },
        { id: 17, name: 'Chiang Mai Nature Tours', href: '#' },
        { id: 18, name: 'Bali Adventure Tours', href: '#' },
        { id: 19, name: 'Luang Prabang Nature Tours', href: '#' },
        { id: 20, name: 'Northern Vietnam Adventure Tours', href: '#' },
      ],
      [
        { id: 21, name: 'Mekong Delta Eco Tours', href: '#' },
        { id: 22, name: 'Komodo Adventure Tours', href: '#' },
        { id: 23, name: 'Raja Ampat Nature Tours', href: '#' },
        { id: 24, name: 'Batanes Nature Tours', href: '#' },
        { id: 25, name: 'Ilocos Sand Dunes Tours', href: '#' },
        { id: 26, name: 'Anilao Diving Tours', href: '#' },
        { id: 27, name: 'Apo Reef Diving Tours', href: '#' },
        { id: 28, name: 'Tubbataha Liveaboard Tours', href: '#' },
        { id: 29, name: 'ASEAN Eco Adventure Tours', href: '#' },
        { id: 30, name: 'Southeast Asia Outdoor Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Culture & Heritage',
    tours: [
      [
        { id: 1, name: 'Vigan Heritage Tours', href: '#' },
        { id: 2, name: 'Intramuros Walking Tours', href: '#' },
        { id: 3, name: 'Iloilo Heritage Tours', href: '#' },
        { id: 4, name: 'Cebu Heritage Tours', href: '#' },
        { id: 5, name: 'Bacolod Heritage Tours', href: '#' },
        { id: 6, name: 'Batanes Culture Tours', href: '#' },
        { id: 7, name: 'Yogyakarta Heritage Tours', href: '#' },
        { id: 8, name: 'Siem Reap Temple Tours', href: '#' },
        { id: 9, name: 'Bangkok Temple Tours', href: '#' },
        { id: 10, name: 'Hanoi Old Quarter Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Ho Chi Minh History Tours', href: '#' },
        { id: 12, name: 'Phnom Penh Heritage Tours', href: '#' },
        { id: 13, name: 'Luang Prabang Culture Tours', href: '#' },
        { id: 14, name: 'Penang Heritage Tours', href: '#' },
        { id: 15, name: 'Melaka Heritage Tours', href: '#' },
        { id: 16, name: 'Jakarta Old Town Tours', href: '#' },
        { id: 17, name: 'Manila Museum Tours', href: '#' },
        { id: 18, name: 'Bohol Heritage Churches Tours', href: '#' },
        { id: 19, name: 'Ilocos Heritage Trail Tours', href: '#' },
        { id: 20, name: 'Cultural Food Tours in ASEAN', href: '#' },
      ],
      [
        { id: 21, name: 'Traditional Villages of North Luzon Tours', href: '#' },
        { id: 22, name: 'Thai Cultural Show Tours', href: '#' },
        { id: 23, name: 'Balinese Culture Tours', href: '#' },
        { id: 24, name: 'Vietnam Heritage Line Tours', href: '#' },
        { id: 25, name: 'Lao Heritage Discovery Tours', href: '#' },
        { id: 26, name: 'Cambodia Heritage Discovery Tours', href: '#' },
        { id: 27, name: 'ASEAN Festival Tours', href: '#' },
        { id: 28, name: 'Philippine Fiesta Tours', href: '#' },
        { id: 29, name: 'UNESCO Sites in ASEAN Tours', href: '#' },
        { id: 30, name: 'Heritage Capitals of Southeast Asia Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Family Friendly',
    tours: [
      [
        { id: 1, name: 'Boracay Family Tours', href: '#' },
        { id: 2, name: 'Cebu Family Tours', href: '#' },
        { id: 3, name: 'Bohol Family Tours', href: '#' },
        { id: 4, name: 'Palawan Family Tours', href: '#' },
        { id: 5, name: 'Baguio Family Tours', href: '#' },
        { id: 6, name: 'Tagaytay Family Tours', href: '#' },
        { id: 7, name: 'Manila Family City Tours', href: '#' },
        { id: 8, name: 'Singapore Family Tours', href: '#' },
        { id: 9, name: 'Bangkok Family Tours', href: '#' },
        { id: 10, name: 'Kuala Lumpur Family Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Sentosa Family Tours', href: '#' },
        { id: 12, name: 'Phuket Family Tours', href: '#' },
        { id: 13, name: 'Bali Family Tours', href: '#' },
        { id: 14, name: 'Chiang Mai Family Tours', href: '#' },
        { id: 15, name: 'Da Nang Family Tours', href: '#' },
        { id: 16, name: 'Ho Chi Minh Family Tours', href: '#' },
        { id: 17, name: 'Siem Reap Family Tours', href: '#' },
        { id: 18, name: 'Penang Family Tours', href: '#' },
        { id: 19, name: 'Johor Bahru Family Tours', href: '#' },
        { id: 20, name: 'Davao Family Nature Tours', href: '#' },
      ],
      [
        { id: 21, name: 'Iloilo Family Heritage Tours', href: '#' },
        { id: 22, name: 'Camiguin Family Beach Tours', href: '#' },
        { id: 23, name: 'Siquijor Family Tours', href: '#' },
        { id: 24, name: 'La Union Family Weekend Tours', href: '#' },
        { id: 25, name: 'Coron Family Tours', href: '#' },
        { id: 26, name: 'El Nido Family Tours', href: '#' },
        { id: 27, name: 'ASEAN Theme Park Tours', href: '#' },
        { id: 28, name: 'Family-Friendly Island Hopping Tours', href: '#' },
        { id: 29, name: 'Kid-Friendly City Break Tours', href: '#' },
        { id: 30, name: 'Multi-Gen ASEAN Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Seasonal Promos',
    tours: [
      [
        { id: 1, name: 'Summer Boracay Promo Tours', href: '#' },
        { id: 2, name: 'Summer Palawan Promo Tours', href: '#' },
        { id: 3, name: 'Holy Week Cebu Tours', href: '#' },
        { id: 4, name: 'Long Weekend Bohol Tours', href: '#' },
        { id: 5, name: 'Rainy Season Baguio Tours', href: '#' },
        { id: 6, name: 'Christmas in Singapore Tours', href: '#' },
        { id: 7, name: 'New Year Bangkok Tours', href: '#' },
        { id: 8, name: 'Valentine Boracay Couple Tours', href: '#' },
        { id: 9, name: 'School Break Family Tours', href: '#' },
        { id: 10, name: 'Weekend Getaway Promo Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Flash Sale ASEAN Tours', href: '#' },
        { id: 12, name: 'Early Bird Thailand Tours', href: '#' },
        { id: 13, name: 'Group Deal Philippines Tours', href: '#' },
        { id: 14, name: 'Barkada Beach Promo Tours', href: '#' },
        { id: 15, name: 'Couple Escape Promo Tours', href: '#' },
        { id: 16, name: 'Family Saver Tours', href: '#' },
        { id: 17, name: 'Seat Sale Add-On Tours', href: '#' },
        { id: 18, name: 'Fiesta Season Heritage Tours', href: '#' },
        { id: 19, name: 'Surf Season Siargao Tours', href: '#' },
        { id: 20, name: 'Peak Season Singapore Tours', href: '#' },
      ],
      [
        { id: 21, name: 'Off-Peak Island Escape Tours', href: '#' },
        { id: 22, name: 'Holiday Bangkok Shopping Tours', href: '#' },
        { id: 23, name: 'March to May Beach Promo Tours', href: '#' },
        { id: 24, name: 'Year-End Clearance Tours', href: '#' },
        { id: 25, name: 'Anniversary Promo Tours', href: '#' },
        { id: 26, name: 'Limited Time ASEAN Deals', href: '#' },
        { id: 27, name: 'Weekend Special Local Tours', href: '#' },
        { id: 28, name: '3D2N Quick Escape Tours', href: '#' },
        { id: 29, name: '4D3N Best Value Tours', href: '#' },
        { id: 30, name: 'All-In Package Promo Tours', href: '#' },
      ],
    ],
  },
];

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
