import { adminContent } from '@/content/features/admin';
import AdminListingPage from '@/features/admin/AdminListingPage';

export const metadata = {
  title: adminContent.metadata.listing.title,
  description: adminContent.metadata.listing.description,
};

export default function Page() {
  return <AdminListingPage />;
}
