'use client';

import { useState } from 'react';

import { termsPageContent } from '@/content/features/terms';

export default function TermsContent() {
  const [activeTabId, setActiveTabId] = useState<string>(termsPageContent.tabs[0]?.id ?? '');
  const activeTab = termsPageContent.tabs.find((tab) => tab.id === activeTabId) ?? termsPageContent.tabs[0];

  return (
    <section className='layout-pt-md layout-pb-lg'>
      <div className='container'>
        <div className='tabs -terms js-tabs'>
          <div className='row y-gap-30'>
            <div className='col-lg-3'>
              <div className='tabs__controls row y-gap-10 js-tabs-controls'>
                {termsPageContent.tabs.map((tab) => (
                  <div key={tab.id} className='col-12'>
                    <button
                      className={`tabs__button relative pl-20 js-tabs-button ${
                        tab.id === activeTab.id ? 'is-tab-el-active' : ''
                      }`}
                      onClick={() => setActiveTabId(tab.id)}
                      type='button'
                    >
                      {tab.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className='col-lg-9'>
              <div className='tabs__content js-tabs-content'>
                <div className='tabs__pane -tab-item-1 is-tab-el-active'>
                  {activeTab.sections.map((section, sectionIndex) => (
                    <div key={section.id} className={sectionIndex > 0 ? 'mt-60 md:mt-30' : ''}>
                      <h2 className='text-20 fw-500'>{section.title}</h2>
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <p key={`${section.id}-${paragraphIndex}`} className='mt-10'>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
