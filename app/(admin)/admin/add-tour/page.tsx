import { adminContent } from '@/content/features/admin';
import AdminAddTourPage from '@/features/admin/AdminAddTourPage';

export const metadata = {
  title: adminContent.metadata.addTour.title,
  description: adminContent.metadata.addTour.description,
};

export default function Page() {
  return <AdminAddTourPage />;
}
