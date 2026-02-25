import { adminContent } from '@/content/features/admin';
import AdminHelpCenterPage from '@/features/admin/AdminHelpCenterPage';

export const metadata = {
  title: adminContent.metadata.helpCenter.title,
  description: adminContent.metadata.helpCenter.description,
};

export default function Page() {
  return <AdminHelpCenterPage />;
}
