'use client';

import { useState } from 'react';

import { helpCenterPageContent } from '@/content/features/help-center';

export default function HelpFaqSection() {
  const { faq } = helpCenterPageContent;
  const [activeFaqId, setActiveFaqId] = useState<number | null>(faq.items[0]?.id ?? null);

  return (
    <section className='layout-pt-xl layout-pb-xl'>
      <div className='container'>
        <div className='row justify-center text-center'>
          <div className='col-auto'>
            <h2 className='text-30 md:text-24'>{faq.title}</h2>
          </div>
        </div>

        <div className='row justify-center pt-40'>
          <div className='col-xl-8 col-lg-10'>
            <div className='accordion -simple row y-gap-20 js-accordion'>
              {faq.items.map((item) => {
                const isActive = activeFaqId === item.id;

                return (
                  <div key={item.id} className='col-12'>
                    <div className={`accordion__item px-20 py-15 border-1 rounded-12 ${isActive ? 'is-active' : ''}`}>
                      <div
                        className='accordion__button d-flex items-center justify-between'
                        onClick={() => setActiveFaqId((previousValue) => (previousValue === item.id ? null : item.id))}
                      >
                        <div className='button text-16 text-dark-1'>{item.question}</div>

                        <div className='accordion__icon size-30 flex-center bg-light-2 rounded-full'>
                          <i className='icon-plus'></i>
                          <i className='icon-minus'></i>
                        </div>
                      </div>

                      <div className='accordion__content' style={isActive ? { maxHeight: '220px' } : {}}>
                        <div className='pt-20'>
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
