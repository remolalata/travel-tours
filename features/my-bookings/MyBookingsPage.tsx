'use client';

import Skeleton from '@mui/material/Skeleton';
import { useCallback } from 'react';

import RouteAccessGuard from '@/components/auth/RouteAccessGuard';
import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeaderClient from '@/components/layout/header/SiteHeaderClient';
import MyBookingCard from '@/components/my-bookings/MyBookingCard';
import MyBookingsTabs from '@/components/my-bookings/MyBookingsTabs';
import { myBookingsPageContent } from '@/content/features/myBookings';
import type { AuthViewerState } from '@/services/auth/mutations/authApi';
import useMyBookingsQuery from '@/services/my-bookings/hooks/useMyBookingsQuery';
import useMyBookingsTabs from '@/services/my-bookings/hooks/useMyBookingsTabs';
import type { MyBookingsTabKey } from '@/types/myBookings';

type MyBookingsPageProps = {
  initialAuthState: AuthViewerState;
};

function MyBookingsLoadingState() {
  return (
    <div className='y-gap-30 row'>
      {Array.from({ length: 2 }).map((_, index) => (
        <div className='col-12' key={index}>
          <div className='rounded-12 border px-20 py-20'>
            <div className='row y-gap-20'>
              <div className='col-xl-3 col-lg-4'>
                <Skeleton variant='rounded' animation='wave' width='100%' height={220} />
              </div>

              <div className='col-xl-6 col-lg-5'>
                <Skeleton variant='text' animation='wave' width='35%' height={22} />
                <Skeleton variant='text' animation='wave' width='70%' height={34} />
                <Skeleton variant='text' animation='wave' width='45%' height={24} />
                <div className='row x-gap-20 y-gap-15 mt-10'>
                  {Array.from({ length: 4 }).map((__, fieldIndex) => (
                    <div className='col-md-6' key={fieldIndex}>
                      <Skeleton variant='text' animation='wave' width='40%' height={18} />
                      <Skeleton variant='text' animation='wave' width='80%' height={24} />
                    </div>
                  ))}
                </div>
              </div>

              <div className='col-xl-3 col-lg-3'>
                <div className='d-flex flex-column items-end justify-between h-full'>
                  <Skeleton variant='rounded' animation='wave' width={120} height={36} />
                  <Skeleton variant='rounded' animation='wave' width='100%' height={44} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MyBookingsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className='rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
      <div className='text-red-3'>{myBookingsPageContent.messages.loadError}</div>
      <button
        type='button'
        className='button -sm -outline-accent-1 text-accent-1 mt-20'
        onClick={onRetry}
      >
        {myBookingsPageContent.messages.retry}
      </button>
    </div>
  );
}

function MyBookingsEmptyState() {
  return (
    <div className='rounded-12 bg-white shadow-2 px-30 py-30 md:px-20'>
      <div className='text-15 text-light-2'>{myBookingsPageContent.messages.empty}</div>
    </div>
  );
}

function MyBookingsList({ activeTab }: { activeTab: MyBookingsTabKey }) {
  const bookingsQuery = useMyBookingsQuery(activeTab);

  if (bookingsQuery.isError) {
    return <MyBookingsErrorState onRetry={() => void bookingsQuery.refetch()} />;
  }

  if (bookingsQuery.isLoading) {
    return <MyBookingsLoadingState />;
  }

  if (!bookingsQuery.data || bookingsQuery.data.length === 0) {
    return <MyBookingsEmptyState />;
  }

  return (
    <div className='y-gap-30 row'>
      {bookingsQuery.data.map((booking) => (
        <div className='col-12' key={booking.id}>
          <MyBookingCard booking={booking} labels={myBookingsPageContent.card} />
        </div>
      ))}
    </div>
  );
}

export default function MyBookingsPage({ initialAuthState }: MyBookingsPageProps) {
  const { activeTab, setActiveTab } = useMyBookingsTabs();
  const handleTabChange = useCallback((value: MyBookingsTabKey) => {
    setActiveTab(value);
  }, [setActiveTab]);

  return (
    <main>
      <SiteHeaderClient initialAuthState={initialAuthState} />
      <RouteAccessGuard mode='auth-required' initialAuthState={initialAuthState}>
        <section className='layout-pt-xl layout-pb-lg accountPageShell'>
          <div className='container'>
            <div className='mb-60'>
              <h1 className='text-30 fw-700'>{myBookingsPageContent.intro.title}</h1>
              <p className='mt-10'>{myBookingsPageContent.intro.description}</p>
            </div>

            <MyBookingsTabs
              ariaLabel={myBookingsPageContent.tabs.ariaLabel}
              activeTab={activeTab}
              items={myBookingsPageContent.tabs.items}
              onChange={handleTabChange}
            />

            <div className='mt-30'>
              <MyBookingsList activeTab={activeTab} />
            </div>
          </div>
        </section>
      </RouteAccessGuard>
      <SiteFooter />
    </main>
  );
}
