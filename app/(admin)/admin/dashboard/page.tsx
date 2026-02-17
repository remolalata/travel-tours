import { adminContent } from '@/content/features/admin';
import AdminMainPage from '@/features/admin/AdminMainPage';

export const metadata = {
  title: adminContent.metadata.main.title,
  description: adminContent.metadata.main.description,
};

export default function Page() {
  return <AdminMainPage />;
}
