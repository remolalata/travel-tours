import { adminContent } from '@/content/features/admin';
import AdminMessagesPage from '@/features/admin/AdminMessagesPage';

export const metadata = {
  title: adminContent.metadata.messages.title,
  description: adminContent.metadata.messages.description,
};

export default function Page() {
  return <AdminMessagesPage />;
}
