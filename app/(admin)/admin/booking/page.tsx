import { adminContent } from '@/content/features/admin';
import AdminBookingPage from '@/features/admin/AdminBookingPage';

export const metadata = {
  title: adminContent.metadata.booking.title,
  description: adminContent.metadata.booking.description,
};

export default function Page() {
  return <AdminBookingPage />;
}
