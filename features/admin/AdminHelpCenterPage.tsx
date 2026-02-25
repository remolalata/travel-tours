import AdminShell from '@/components/admin/layout/AdminShell';
import { adminContent } from '@/content/features/admin';
import AdminFaqManager from '@/features/admin/help-center/components/AdminFaqManager';

export default function AdminHelpCenterPage() {
  const content = adminContent.pages.helpCenter;

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <AdminFaqManager />
    </AdminShell>
  );
}
