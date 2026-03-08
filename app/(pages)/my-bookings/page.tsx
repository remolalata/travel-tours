import MyBookingsPage from '@/features/my-bookings/MyBookingsPage';

export const dynamic = 'force-static';

export const metadata = {
  title: 'My Bookings | Travel & Tours',
  description: 'Manage and review your bookings.',
};

export default function Page() {
  return <MyBookingsPage />;
}
