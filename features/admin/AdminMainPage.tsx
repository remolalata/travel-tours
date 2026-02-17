'use client';

import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AdminShell from '@/components/admin/layout/AdminShell';
import { adminContent } from '@/content/features/admin';

export default function AdminMainPage() {
  const content = adminContent.pages.main;
  const [activeTabId, setActiveTabId] = useState(content.chartTabs[0]?.id ?? 1);
  const activeTab = content.chartTabs.find((tab) => tab.id === activeTabId) ?? content.chartTabs[0];

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='row y-gap-30 pt-60 md:pt-30'>
        {content.statCards.map((item) => (
          <div key={item.id} className='col-xl-3 col-sm-6'>
            <div className='rounded-12 bg-white shadow-2 px-30 py-30 h-full'>
              <div className='row y-gap-20 items-center justify-between'>
                <div className='col-auto'>
                  <div>{item.title}</div>
                  <div className='text-30 fw-700'>{item.amount}</div>

                  <div>
                    <span className='text-accent-1'>{item.today}</span> {content.todayLabel}
                  </div>
                </div>

                <div className='col-auto'>
                  <div className='size-80 flex-center bg-accent-1-05 rounded-full'>
                    <i className={`text-30 ${item.iconClass}`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='row pt-30 y-gap-30'>
        <div className='col-xl-8 col-lg-12 col-md-6'>
          <div className='rounded-12 bg-white shadow-2 h-full'>
            <div className='pt-20 px-30'>
              <div className='tabs -underline-2 js-tabs'>
                <div className='d-flex items-center justify-between'>
                  <div className='text-18 fw-500'>{content.chartTitle}</div>

                  <div className='tabs__controls row x-gap-20 y-gap-10 lg:x-gap-20 js-tabs-controls'>
                    {content.chartTabs.map((tab) => (
                      <div key={tab.id} className='col-auto'>
                        <button
                          className={`tabs__button fw-500 px-5 pb-5 lg:pb-0 js-tabs-button ${
                            activeTab.id === tab.id ? 'is-tab-el-active' : ''
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

                <div className='tabs__content pt-30 js-tabs-content'>
                  <div className='tabs__pane -tab-item-1 is-tab-el-active'>
                    <ResponsiveContainer height={500} width='100%'>
                      <LineChart data={activeTab.data}>
                        <CartesianGrid strokeDasharray='' />
                        <XAxis tick={{ fontSize: 12 }} dataKey='name' interval='preserveEnd' />
                        <YAxis tick={{ fontSize: 12 }} domain={[0, 300]} tickCount={7} interval='preserveEnd' />
                        <Tooltip />
                        <Line type='monotone' dataKey='value' strokeWidth={2} stroke='#336CFB' fill='#336CFB' activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-xl-4 col-lg-12 col-md-6'>
          <div className='px-30 py-25 rounded-12 bg-white shadow-2'>
            <div className='d-flex items-center justify-between'>
              <div className='text-18 fw-500'>{content.activitiesTitle}</div>
            </div>

            <div className='row y-gap-30 pt-30'>
              {content.activities.map((item) => (
                <div key={item.id} className='col-12'>
                  <div className='d-flex items-center'>
                    <div className='flex-center size-40 bg-accent-1-05 rounded-full'>
                      <i className={`${item.iconClass} text-16`}></i>
                    </div>

                    <div className='lh-14 ml-10'>{item.message}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className='pt-40'>
              <button className='button -md -outline-accent-1 col-12 text-accent-1' type='button'>
                {content.activitiesCtaLabel}
                <i className='icon-arrow-top-right text-16 ml-10'></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
