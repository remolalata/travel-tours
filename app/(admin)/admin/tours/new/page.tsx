import { adminContent } from '@/content/features/admin';
import AdminTourCreatePage from '@/features/admin/AdminTourCreatePage';

export const metadata = {
  title: adminContent.metadata.listing.title,
  description: adminContent.metadata.listing.description,
};

export default function Page() {
  return <AdminTourCreatePage />;
}
