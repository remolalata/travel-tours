'use client';

import AdminShell from '@/components/admin/layout/AdminShell';
import AdminTourCreateForm from '@/components/admin/tours/AdminTourCreateForm';
import { adminContent } from '@/content/features/admin';
import useAdminTourQuery from '@/services/admin/tours/hooks/useAdminTourQuery';

type AdminTourEditPageProps = {
  tourId: number;
};

export default function AdminTourEditPage({ tourId }: AdminTourEditPageProps) {
  const content = adminContent.pages.listing;
  const tourQuery = useAdminTourQuery(tourId);

  return (
    <AdminShell
      title={content.editPage.intro.title}
      description={content.editPage.intro.description}
    >
      {tourQuery.isLoading ? (
        <div className='rounded-12 bg-white shadow-2 px-40 py-30 md:px-20 md:py-20 mt-60 md:mt-30 text-14 text-center'>
          {content.messages.loading}
        </div>
      ) : tourQuery.isError || !tourQuery.data ? (
        <div className='rounded-12 bg-white shadow-2 px-40 py-30 md:px-20 md:py-20 mt-60 md:mt-30 text-14 text-red-1 text-center'>
          {content.messages.loadError}
        </div>
      ) : (
        <AdminTourCreateForm
          key={`edit-tour-${tourId}`}
          mode='edit'
          tourId={tourId}
          initialData={tourQuery.data}
        />
      )}
    </AdminShell>
  );
}
