'use client';

import AdminShell from '@/components/admin/layout/AdminShell';
import AdminTourCreateForm from '@/components/admin/tours/AdminTourCreateForm';
import { adminContent } from '@/content/features/admin';

export default function AdminTourCreatePage() {
  const content = adminContent.pages.listing.createPage.intro;

  return (
    <AdminShell title={content.title} description={content.description}>
      <AdminTourCreateForm />
    </AdminShell>
  );
}
