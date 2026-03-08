import { adminContent } from '@/content/features/admin';
import AdminQuotesInboxPage from '@/features/admin/AdminQuotesInboxPage';

export const metadata = {
  title: adminContent.metadata.quotesInbox.title,
  description: adminContent.metadata.quotesInbox.description,
};

export default function Page() {
  return <AdminQuotesInboxPage />;
}
