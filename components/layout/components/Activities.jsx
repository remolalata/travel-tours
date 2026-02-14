'use client';

import { useState, useEffect, useRef } from 'react';

const buttonData = [
  'Top PH & SEA Landmarks',
  'Food and Nightlife',
  'Adventure and Sports',
  'Landscapes and Nature',
  'Boat Tours',
  'Water Sports',
  'Air Tours',
  'Road Trips',
];

const tabContent = [
  {
    heading: 'Top PH & SEA Landmarks',
    items: [
      [
        { id: 1, name: 'Intramuros and Rizal Park Tours', href: '#' },
        { id: 2, name: 'Vigan Heritage Village Tours', href: '#' },
        { id: 3, name: 'Chocolate Hills and Tarsier Tours', href: '#' },
        { id: 4, name: 'Mayon Volcano View Tours', href: '#' },
        { id: 5, name: 'Marina Bay and Merlion Tours', href: '#' },
        { id: 6, name: 'Bangkok Grand Palace Tours', href: '#' },
        { id: 7, name: 'Wat Arun and Wat Pho Tours', href: '#' },
        { id: 8, name: 'Petronas Towers City Tours', href: '#' },
        { id: 9, name: 'Angkor-Style Temple Heritage Tours', href: '#' },
        { id: 10, name: 'UNESCO Heritage Trail Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Fort Santiago Historical Tours', href: '#' },
        { id: 12, name: 'Cebu Basilica and Magellan’s Cross Tours', href: '#' },
        { id: 13, name: 'Singapore Civic District Tours', href: '#' },
        { id: 14, name: 'Southeast Asia City Icons Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Food and Nightlife',
    items: [
      [
        { id: 1, name: 'Binondo Food Crawl Tours', href: '#' },
        { id: 2, name: 'Cebu Lechon and Street Food Tours', href: '#' },
        { id: 3, name: 'Bacolod Chicken Inasal Food Tours', href: '#' },
        { id: 4, name: 'Iloilo La Paz Batchoy Tours', href: '#' },
        { id: 5, name: 'Manila Rooftop Nightlife Tours', href: '#' },
        { id: 6, name: 'Poblacion Nightlife Tours', href: '#' },
        { id: 7, name: 'Bangkok Night Market Food Tours', href: '#' },
        { id: 8, name: 'Singapore Hawker Food Tours', href: '#' },
        { id: 9, name: 'Kuala Lumpur Night Bites Tours', href: '#' },
        { id: 10, name: 'Ho Chi Minh Street Food Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Craft Beer and Pub Crawl Tours', href: '#' },
        { id: 12, name: 'Coffee and Dessert Hopping Tours', href: '#' },
        { id: 13, name: 'Seafood Night Market Tours', href: '#' },
        { id: 14, name: 'Live Music and Bar Scene Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Adventure and Sports',
    items: [
      [
        { id: 1, name: 'Cebu Canyoneering Tours', href: '#' },
        { id: 2, name: 'Siargao Surf Experience Tours', href: '#' },
        { id: 3, name: 'Mt. Pulag Trekking Tours', href: '#' },
        { id: 4, name: 'Davao Mt. Apo Adventure Tours', href: '#' },
        { id: 5, name: 'Bohol ATV and Countryside Tours', href: '#' },
        { id: 6, name: 'Palawan Cliff and Lagoon Kayak Tours', href: '#' },
        { id: 7, name: 'Boracay Parasailing Adventure Tours', href: '#' },
        { id: 8, name: 'Thailand Zipline Adventure Tours', href: '#' },
        { id: 9, name: 'Bali ATV and Rafting Tours', href: '#' },
        { id: 10, name: 'Southeast Asia Multi-Adventure Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Trail Running Escape Tours', href: '#' },
        { id: 12, name: 'Island Bike and Hike Tours', href: '#' },
        { id: 13, name: 'Beginner Friendly Outdoor Sports Tours', href: '#' },
        { id: 14, name: 'Extreme Adventure Weekend Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Landscapes and Nature',
    items: [
      [
        { id: 1, name: 'Batanes Rolling Hills Tours', href: '#' },
        { id: 2, name: 'Sagada and Banaue Nature Tours', href: '#' },
        { id: 3, name: 'Palawan Underground River Tours', href: '#' },
        { id: 4, name: 'Coron Lakes and Limestone Cliffs Tours', href: '#' },
        { id: 5, name: 'Camiguin Waterfalls and Springs Tours', href: '#' },
        { id: 6, name: 'Baguio Highlands Nature Tours', href: '#' },
        { id: 7, name: 'Bohol Forest and River Cruise Tours', href: '#' },
        { id: 8, name: 'Chiang Mai Mountain Nature Tours', href: '#' },
        { id: 9, name: 'Bali Rice Terrace Nature Tours', href: '#' },
        { id: 10, name: 'Mekong Delta Eco Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Sunrise and Sunset Viewpoint Tours', href: '#' },
        { id: 12, name: 'Eco Park and Birdwatching Tours', href: '#' },
        { id: 13, name: 'Volcano and Crater Lake Tours', href: '#' },
        { id: 14, name: 'Nature Photography Day Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Boat Tours',
    items: [
      [
        { id: 1, name: 'El Nido Island Hopping Boat Tours', href: '#' },
        { id: 2, name: 'Coron Island and Lake Boat Tours', href: '#' },
        { id: 3, name: 'Honda Bay Island Boat Tours', href: '#' },
        { id: 4, name: 'Boracay Sunset Paraw Boat Tours', href: '#' },
        { id: 5, name: 'Bohol Loboc River Boat Tours', href: '#' },
        { id: 6, name: 'Siargao Sohoton Boat Tours', href: '#' },
        { id: 7, name: 'Cebu Mactan Island Boat Tours', href: '#' },
        { id: 8, name: 'Phuket Island Boat Tours', href: '#' },
        { id: 9, name: 'Krabi Longtail Boat Tours', href: '#' },
        { id: 10, name: 'Singapore River Cruise Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Floating Market Boat Tours', href: '#' },
        { id: 12, name: 'Private Yacht Day Boat Tours', href: '#' },
        { id: 13, name: 'Family Friendly Boat Tours', href: '#' },
        { id: 14, name: 'Full-Day Archipelago Boat Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Water Sports',
    items: [
      [
        { id: 1, name: 'Boracay Snorkeling and Helmet Dive Tours', href: '#' },
        { id: 2, name: 'Cebu Sardine Run and Diving Tours', href: '#' },
        { id: 3, name: 'Coron Scuba Diving Tours', href: '#' },
        { id: 4, name: 'Anilao Freediving Tours', href: '#' },
        { id: 5, name: 'Siargao Surf Lesson Tours', href: '#' },
        { id: 6, name: 'Bohol Paddle Board Tours', href: '#' },
        { id: 7, name: 'Palawan Kayaking Tours', href: '#' },
        { id: 8, name: 'Phuket Jet Ski Tours', href: '#' },
        { id: 9, name: 'Bali Snorkel and Dive Tours', href: '#' },
        { id: 10, name: 'Langkawi Water Sports Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Banana Boat and Tow Sports Tours', href: '#' },
        { id: 12, name: 'Reef Discovery Water Tours', href: '#' },
        { id: 13, name: 'Beginner Friendly Water Sports Tours', href: '#' },
        { id: 14, name: 'All-In Beach Water Activity Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Air Tours',
    items: [
      [
        { id: 1, name: 'Cebu Scenic Flight Tours', href: '#' },
        { id: 2, name: 'Palawan Aerial Island View Tours', href: '#' },
        { id: 3, name: 'Boracay Parasailing Air Tours', href: '#' },
        { id: 4, name: 'Clark Pampanga Hot Air Balloon Tours', href: '#' },
        { id: 5, name: 'Bohol Helicopter Sightseeing Tours', href: '#' },
        { id: 6, name: 'Manila Bay Air Sightseeing Tours', href: '#' },
        { id: 7, name: 'Singapore Helicopter City Tours', href: '#' },
        { id: 8, name: 'Bangkok Skyline Air Tours', href: '#' },
        { id: 9, name: 'Bali Aerial Coastline Tours', href: '#' },
        { id: 10, name: 'Southeast Asia Scenic Air Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Sunset Flight Experience Tours', href: '#' },
        { id: 12, name: 'Private Charter Air Tours', href: '#' },
        { id: 13, name: 'Proposal and Celebration Air Tours', href: '#' },
        { id: 14, name: 'Weekend Air Escape Tours', href: '#' },
      ],
    ],
  },
  {
    heading: 'Road Trips',
    items: [
      [
        { id: 1, name: 'Baguio and La Union Road Trip Tours', href: '#' },
        { id: 2, name: 'Ilocos Heritage Road Trip Tours', href: '#' },
        { id: 3, name: 'Tagaytay and Batangas Road Trip Tours', href: '#' },
        { id: 4, name: 'Bicol Scenic Road Trip Tours', href: '#' },
        { id: 5, name: 'Cebu South Coastal Road Trip Tours', href: '#' },
        { id: 6, name: 'Bohol Loop Road Trip Tours', href: '#' },
        { id: 7, name: 'Davao Highlands Road Trip Tours', href: '#' },
        { id: 8, name: 'Northern Luzon Mountain Road Trip Tours', href: '#' },
        { id: 9, name: 'Penang and KL Road Trip Tours', href: '#' },
        { id: 10, name: 'Thailand Countryside Road Trip Tours', href: '#' },
      ],
      [
        { id: 11, name: 'Self-Drive Car Rental Package Tours', href: '#' },
        { id: 12, name: 'Van and Driver Road Trip Tours', href: '#' },
        { id: 13, name: 'Family Road Adventure Tours', href: '#' },
        { id: 14, name: 'Long Weekend Road Escape Tours', href: '#' },
      ],
    ],
  },
];

export default function Activities() {
  const [currentdd, setCurrentdd] = useState('');
  const [currentdestinationTab, setCurrentdestinationTab] = useState('Top world landmarks');
  const dropDownContainer = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (dropDownContainer.current && !dropDownContainer.current.contains(event.target)) {
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
          const isOpening = currentdd != 'activities';
          if (isOpening) setCurrentdestinationTab(buttonData[0] || '');
          setCurrentdd(isOpening ? 'activities' : '');
        }}
      >
        Activities
        <i className='text-18 icon-chevron-down'></i>
      </div>

      <div className={`headerDropdown__content ${currentdd == 'activities' ? 'is-active' : ''} `}>
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
                        currentdestinationTab == elm ? 'is-tab-el-active' : ''
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
                      {tabContent
                        .filter((elm) => elm.heading == currentdestinationTab)[0]
                        ?.items.map((elm2, i2) => (
                          <div key={i2} className='tabsMenu-list'>
                            <div className='tabsMenu-list__title'>
                              {
                                tabContent.filter((elm) => elm.heading == currentdestinationTab)[0]
                                  .heading
                              }
                            </div>
                            <div className='tabsMenu-list__content'>
                              {elm2.map((elm3, i3) => (
                                <div key={i3} className='tabsMenu-list__item'>
                                  <a href={elm3.href}>{elm3.name}</a>
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
