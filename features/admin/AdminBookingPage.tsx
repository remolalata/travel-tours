'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

import AdminShell from '@/components/admin/layout/AdminShell';
import Pagination from '@/components/common/Pagination';
import { adminContent } from '@/content/features/admin';
import type { BookingStatus } from '@/types/admin';

const statusClassMap: Record<BookingStatus, string> = {
  Approved: 'text-purple-1',
  Pending: 'text-yellow-1',
  Cancelled: 'text-red-2',
};

export default function AdminBookingPage() {
  const content = adminContent.pages.booking;
  const [currentTab, setCurrentTab] = useState<BookingStatus>(content.tabs[0]);

  const filteredBookings = useMemo(
    () => content.bookings.filter((booking) => booking.status === currentTab),
    [content.bookings, currentTab],
  );

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:mb-20 mt-60'>
        <div className='tabs -underline-2 js-tabs'>
          <div className='tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls'>
            {content.tabs.map((tab) => (
              <div key={tab} className='col-auto'>
                <button
                  className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 js-tabs-button ${
                    tab === currentTab ? 'is-tab-el-active' : ''
                  }`}
                  onClick={() => setCurrentTab(tab)}
                  type='button'
                >
                  {tab}
                </button>
              </div>
            ))}
          </div>

          <div className='tabs__content js-tabs-content'>
            <div className='tabs__pane -tab-item-1 is-tab-el-active'>
              <div className='overflowAuto'>
                <table className='tableTest mb-30'>
                  <thead className='bg-light-1 rounded-12'>
                    <tr>
                      {content.tableHeaders.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.orderNumber}</td>

                        <td className='min-w-300'>
                          <div className='d-flex items-center'>
                            <Image width={70} height={65} src={booking.imageUrl} alt={booking.title} />
                            <div className='ml-20'>{booking.title}</div>
                          </div>
                        </td>

                        <td>{booking.startDate}</td>
                        <td>{booking.endDate}</td>
                        <td>{booking.numberOfPeople}</td>
                        <td>{booking.cost}</td>

                        <td>
                          <div className={`circle ${statusClassMap[booking.status]}`}>{booking.status}</div>
                        </td>

                        <td>
                          <div className='d-flex items-center'>
                            <button className='button -dark-1 size-35 bg-light-1 rounded-full flex-center' type='button'>
                              <i className='icon-pencil text-14'></i>
                            </button>

                            <button className='button -dark-1 size-35 bg-light-1 rounded-full flex-center ml-10' type='button'>
                              <i className='icon-delete text-14'></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination />

              <div className='text-14 text-center mt-20'>{content.resultSummary}</div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
