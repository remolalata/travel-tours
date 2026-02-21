import { adminContent } from '@/content/features/admin';
import AdminDestinationsPage from '@/features/admin/AdminDestinationsPage';

export const metadata = {
  title: adminContent.metadata.destinations.title,
  description: adminContent.metadata.destinations.description,
};

export default function Page() {
  return <AdminDestinationsPage />;
}
