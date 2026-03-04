import AdminFaqManager from '@/components/admin/help-center/AdminFaqManager';
import AdminShell from '@/components/admin/layout/AdminShell';
import { adminContent } from '@/content/features/admin';

export default function AdminHelpCenterPage() {
  const content = adminContent.pages.helpCenter;

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <AdminFaqManager />
    </AdminShell>
  );
}
