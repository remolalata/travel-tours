'use client';

import type { GridRenderCellParams } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';

import useAdminBookingsQuery from '@/api/admin/bookings/hooks/useAdminBookingsQuery';
import type { AdminBookingData } from '@/api/admin/bookings/mutations/bookingApi';
import AdminShell from '@/components/admin/layout/AdminShell';
import AppMultiSelectPills from '@/components/common/form/AppMultiSelectPills';
import type { DataTableColumn } from '@/components/common/table/AppDataTable';
import AppDataTable from '@/components/common/table/AppDataTable';
import { adminContent } from '@/content/features/admin';
import { bookingStatusValueMap } from '@/features/admin/helpers/bookingStatus';
import type { BookingStatus } from '@/types/admin';

const bookedDateFormatter = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const travelDateFormatter = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
});

const rowsPerPageOptions = [10, 20, 50];

const paymentLabelMap = {
  unpaid: 'Unpaid',
  partial: 'Partial',
  paid: 'Paid',
  refunded: 'Refunded',
} as const;

function formatCurrency(amount: number, currency: string): string {
  const normalizedCurrency = currency.trim() || 'PHP';

  try {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toFixed(2)}`;
  }
}

export default function AdminBookingPage() {
  const content = adminContent.pages.booking;
  const [currentTabs, setCurrentTabs] = useState<BookingStatus[]>([content.tabs[0]]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const activeTabs = currentTabs.length > 0 ? currentTabs : content.tabs;

  const bookingsQuery = useAdminBookingsQuery({
    statuses: activeTabs.map((tab) => bookingStatusValueMap[tab]),
    page,
    pageSize: rowsPerPage,
  });

  const columns = useMemo<DataTableColumn<AdminBookingData>[]>(
    () => [
      {
        field: 'bookingReference',
        headerName: 'Booking Reference',
        minWidth: 190,
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<AdminBookingData, string>) => (
          <span className='fw-500'>{params.row.bookingReference}</span>
        ),
      },
      {
        field: 'packageTitle',
        headerName: 'Booking',
        minWidth: 280,
        flex: 1.5,
        sortable: false,
        renderCell: (params: GridRenderCellParams<AdminBookingData, string>) => (
          <span className='fw-500'>{params.row.packageTitle}</span>
        ),
      },
      {
        field: 'destinationName',
        headerName: 'Destination',
        minWidth: 140,
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<AdminBookingData, string | null>) =>
          params.row.destinationName ?? '-',
      },
      {
        field: 'customerName',
        headerName: 'Customer',
        minWidth: 200,
        flex: 1,
        sortable: false,
        valueGetter: (_, row) => `${row.customerFirstName} ${row.customerLastName}`,
      },
      {
        field: 'travelWindow',
        headerName: 'Travel',
        minWidth: 220,
        flex: 1.1,
        sortable: false,
        valueGetter: (_, row) => {
          const start = travelDateFormatter.format(new Date(row.travelStartDate));
          const end = travelDateFormatter.format(new Date(row.travelEndDate));
          return `${start} - ${end}`;
        },
      },
      {
        field: 'numberOfTravelers',
        headerName: 'Travelers',
        align: 'left',
        headerAlign: 'left',
        minWidth: 100,
        flex: 0.7,
      },
      {
        field: 'paymentStatus',
        headerName: 'Payment',
        minWidth: 200,
        flex: 1.1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<AdminBookingData>) =>
          `${paymentLabelMap[params.row.paymentStatus]} (${formatCurrency(params.row.amountPaid, params.row.currency)} paid)`,
      },
      {
        field: 'totalAmount',
        headerName: 'Amount',
        align: 'left',
        headerAlign: 'left',
        minWidth: 130,
        flex: 0.8,
        sortable: false,
        renderCell: (params: GridRenderCellParams<AdminBookingData>) =>
          formatCurrency(params.row.totalAmount, params.row.currency),
      },
      {
        field: 'bookedAt',
        headerName: 'Booked',
        minWidth: 180,
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<AdminBookingData>) =>
          bookedDateFormatter.format(new Date(params.row.bookedAt)),
      },
    ],
    [],
  );

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:mb-20 mt-60'>
        <AppMultiSelectPills<BookingStatus>
          options={content.tabs}
          value={currentTabs}
          onChange={(nextValue) => {
            setCurrentTabs(nextValue);
            setPage(0);
          }}
        />

        <AppDataTable
          columns={columns}
          rows={bookingsQuery.data?.rows ?? []}
          rowKey={(row) => row.id}
          loading={bookingsQuery.isLoading}
          refreshing={bookingsQuery.isFetching && !bookingsQuery.isLoading}
          errorMessage={
            bookingsQuery.isError ? 'Failed to load bookings. Please refresh and try again.' : null
          }
          emptyMessage='No bookings found for this status.'
          pagination={{
            page,
            rowsPerPage,
            total: bookingsQuery.data?.total ?? 0,
            rowsPerPageOptions,
            onPageChange: setPage,
            onRowsPerPageChange: (nextRowsPerPage) => {
              setRowsPerPage(nextRowsPerPage);
              setPage(0);
            },
          }}
        />

        <div className='text-14 text-center mt-20'>
          {!bookingsQuery.isLoading && !bookingsQuery.isError
            ? `Showing ${(bookingsQuery.data?.rows ?? []).length} of ${bookingsQuery.data?.total ?? 0} booking(s)`
            : null}
        </div>
      </div>
    </AdminShell>
  );
}
