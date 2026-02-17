import { adminContent } from '@/content/features/admin';
import AdminProfilePage from '@/features/admin/AdminProfilePage';

export const metadata = {
  title: adminContent.metadata.profile.title,
  description: adminContent.metadata.profile.description,
};

export default function Page() {
  return <AdminProfilePage />;
}
