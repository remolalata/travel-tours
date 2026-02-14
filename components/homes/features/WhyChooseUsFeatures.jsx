import Image from 'next/image';
import React from 'react';

export default function WhyChooseUsFeatures() {
  const gr8Features = [
    {
      id: 1,
      iconSrc: '/img/icons/1/ticket.svg',
      title: 'Ultimate flexibility',
      text: 'Plan your trip your way with options that fit your schedule, budget, and travel style. We offer flexible package choices, practical add-ons, and clear guidance so you can book with confidence.',
    },
    {
      id: 2,
      iconSrc: '/img/icons/1/hot-air-balloon.svg',
      title: 'Memorable experiences',
      text: 'We design each getaway to be more than just a trip. From iconic city tours to island adventures, our curated itineraries help you create meaningful moments with the people who matter most.',
    },
    {
      id: 3,
      iconSrc: '/img/icons/1/diamond.svg',
      title: 'Seamless, hassle-free travel',
      text: 'Skip the stress of planning. We handle the essentials: flights, accommodations, transfers, and tour arrangements, so you can focus on enjoying every part of your journey.',
    },
    {
      id: 4,
      iconSrc: '/img/icons/1/medal.svg',
      title: 'Award-winning support',
      text: "Travel with peace of mind knowing our team is ready to assist you before, during, and after your trip. We're committed to fast, friendly, and reliable service at every step.",
    },
  ];

  return (
    <section className='layout-pt-xl'>
      <div className='container'>
        <div className='row'>
          <div className='col-auto'>
            <h2 data-aos='fade-up' className='text-30 md:text-24'>
              Why Gr8 Escapes
            </h2>
          </div>
        </div>

        <div data-aos='fade-up' className='row md:x-gap-20 pt-40 sm:pt-20 mobile-css-slider -w-280'>
          {gr8Features.map((elm, i) => (
            <div key={i} className='col-lg-3 col-sm-6'>
              <div className='featureIcon -type-1 pr-40 md:pr-0'>
                <div className='featureIcon__icon'>
                  <Image width={60} height={60} src={elm.iconSrc} alt='icon' />
                </div>

                <h3 className='featureIcon__title text-18 fw-500 mt-30'>{elm.title}</h3>
                <p className='featureIcon__text mt-10'>{elm.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
