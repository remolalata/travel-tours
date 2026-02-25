'use client';

import type { GridRenderCellParams } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';

import useAdminQuoteRequestsQuery from '@/api/admin/quotes-inbox/hooks/useAdminQuoteRequestsQuery';
import type { AdminQuoteRequestRow } from '@/api/admin/quotes-inbox/mutations/quoteRequestApi';
import AdminShell from '@/components/admin/layout/AdminShell';
import type { DataTableColumn } from '@/components/common/table/AppDataTable';
import AppDataTable from '@/components/common/table/AppDataTable';
import { adminContent } from '@/content/features/admin';

const rowsPerPageOptions = [10, 20, 50];

const submittedDateFormatter = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default function AdminQuotesInboxPage() {
  const content = adminContent.pages.quotesInbox;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const quoteRequestsQuery = useAdminQuoteRequestsQuery({ page, pageSize: rowsPerPage });

  const columns = useMemo<DataTableColumn<AdminQuoteRequestRow>[]>(
    () => [
      {
        field: 'submittedAt',
        headerName: 'Submitted',
        minWidth: 180,
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<AdminQuoteRequestRow>) =>
          submittedDateFormatter.format(new Date(params.row.submittedAt)),
      },
      {
        field: 'requestType',
        headerName: 'Type',
        minWidth: 110,
        flex: 0.7,
        sortable: false,
        valueGetter: (_, row) => (row.userId ? 'User' : 'Guest'),
      },
      {
        field: 'contactFullName',
        headerName: 'Customer',
        minWidth: 190,
        flex: 1,
        sortable: false,
      },
      {
        field: 'contactEmail',
        headerName: 'Email',
        minWidth: 230,
        flex: 1.3,
        sortable: false,
      },
      {
        field: 'contactPhone',
        headerName: 'Phone',
        minWidth: 160,
        flex: 0.9,
        sortable: false,
      },
      {
        field: 'destinationName',
        headerName: 'Destination',
        minWidth: 150,
        flex: 0.9,
        sortable: false,
      },
      {
        field: 'travelDateRange',
        headerName: 'Travel Dates',
        minWidth: 220,
        flex: 1.1,
        sortable: false,
      },
      {
        field: 'tourTypeName',
        headerName: 'Tour Type',
        minWidth: 170,
        flex: 1,
        sortable: false,
      },
      {
        field: 'travelers',
        headerName: 'Travelers',
        minWidth: 120,
        flex: 0.8,
        sortable: false,
        valueGetter: (_, row) => `${row.adultsCount}A / ${row.childrenCount}C`,
      },
      {
        field: 'budgetRange',
        headerName: 'Budget',
        minWidth: 170,
        flex: 1,
        sortable: false,
      },
      {
        field: 'preferredHotel',
        headerName: 'Hotel',
        minWidth: 130,
        flex: 0.8,
        sortable: false,
      },
    ],
    [],
  );

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:mb-20 mt-60'>
        <AppDataTable
          columns={columns}
          rows={quoteRequestsQuery.data?.rows ?? []}
          rowKey={(row) => row.id}
          loading={quoteRequestsQuery.isLoading}
          refreshing={quoteRequestsQuery.isFetching && !quoteRequestsQuery.isLoading}
          errorMessage={
            quoteRequestsQuery.isError
              ? 'Failed to load quote requests. Please refresh and try again.'
              : null
          }
          emptyMessage='No quote requests found.'
          pagination={{
            page,
            rowsPerPage,
            total: quoteRequestsQuery.data?.total ?? 0,
            rowsPerPageOptions,
            onPageChange: setPage,
            onRowsPerPageChange: (nextRowsPerPage) => {
              setRowsPerPage(nextRowsPerPage);
              setPage(0);
            },
          }}
        />
      </div>
    </AdminShell>
  );
}
