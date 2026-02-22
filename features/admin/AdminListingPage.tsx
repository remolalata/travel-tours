'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import useAdminToursQuery from '@/api/admin/tours/hooks/useAdminToursQuery';
import AdminShell from '@/components/admin/layout/AdminShell';
import AdminToursGrid from '@/components/admin/tours/AdminToursGrid';
import AppButton from '@/components/common/button/AppButton';
import Pagination from '@/components/common/Pagination';
import { adminContent } from '@/content/features/admin';

const toursPageSize = 6;

export default function AdminListingPage() {
  const content = adminContent.pages.listing;
  const router = useRouter();
  const [page, setPage] = useState(0);
  const toursQuery = useAdminToursQuery({ page, pageSize: toursPageSize });
  const totalPages = useMemo(() => Math.max(1, Math.ceil((toursQuery.data?.total ?? 0) / toursPageSize)), [toursQuery.data?.total]);
  const currentPage = page + 1;
  const tours = toursQuery.data?.rows ?? [];
  const hasError = toursQuery.isError;

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:pb-20 mt-60 md:mt-30'>
        <div className='d-flex justify-end mb-20'>
          <AppButton
            type='button'
            size='sm'
            onClick={() => {
              router.push('/admin/tours/new');
            }}
          >
            {content.addButtonLabel}
          </AppButton>
        </div>

        <AdminToursGrid
          tours={tours}
          pricePrefix={content.pricePrefix}
          isLoading={toursQuery.isLoading}
          errorMessage={hasError ? content.messages.loadError : null}
          emptyMessage={content.messages.empty}
        />

        <div className='mt-30'>
          <Pagination
            range={totalPages}
            page={currentPage}
            onPageChange={(nextPage) => {
              setPage(nextPage - 1);
            }}
          />
          <div className='text-14 text-center mt-20'>
            {!hasError
              ? `${content.summary.showing} ${tours.length} ${content.summary.of} ${toursQuery.data?.total ?? 0} ${content.summary.itemSuffix}`
              : null}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
