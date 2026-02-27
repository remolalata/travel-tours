'use client';

import Popover from '@mui/material/Popover';
import type { GridRenderCellParams } from '@mui/x-data-grid';
import { useId, useMemo, useState } from 'react';

import AdminShell from '@/components/admin/layout/AdminShell';
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput';
import AppMultiSelectPills from '@/components/common/form/AppMultiSelectPills';
import type { DataTableColumn } from '@/components/common/table/AppDataTable';
import AppDataTable from '@/components/common/table/AppDataTable';
import { adminContent } from '@/content/features/admin';
import {
  bookingStatusLabelMap,
  bookingStatusValueMap,
} from '@/features/admin/helpers/bookingStatus';
import useAdminBookingsSearch from '@/features/admin/hooks/useAdminBookingsSearch';
import useAdminBookingsQuery from '@/services/admin/bookings/hooks/useAdminBookingsQuery';
import useUpdateAdminBookingStatusMutation from '@/services/admin/bookings/hooks/useUpdateAdminBookingStatusMutation';
import type {
  AdminBookingData,
  RawBookingStatus,
} from '@/services/admin/bookings/mutations/bookingApi';
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

const bookingStatusPillColorMap = {
  approved: {
    text: '#0f5132',
    background: '#d1e7dd',
    border: '#badbcc',
  },
  pending: {
    text: '#664d03',
    background: '#fff3cd',
    border: '#ffecb5',
  },
  cancelled: {
    text: '#842029',
    background: '#f8d7da',
    border: '#f5c2c7',
  },
  completed: {
    text: '#0c5460',
    background: '#d1ecf1',
    border: '#bee5eb',
  },
} as const;
const allRawBookingStatuses = Object.keys(bookingStatusLabelMap) as RawBookingStatus[];

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
  const searchInputId = useId();
  const [currentTabs, setCurrentTabs] = useState<BookingStatus[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [statusPopoverAnchorEl, setStatusPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [statusPopoverBookingId, setStatusPopoverBookingId] = useState<number | null>(null);
  const [statusPopoverCurrentStatus, setStatusPopoverCurrentStatus] =
    useState<RawBookingStatus | null>(null);
  const { searchTerm, normalizedSearchTerm, setSearchTerm } = useAdminBookingsSearch();
  const updateBookingStatusMutation = useUpdateAdminBookingStatusMutation();
  const activeTabs = currentTabs.length > 0 ? currentTabs : content.tabs;
  const statusPopoverOpen = Boolean(statusPopoverAnchorEl);
  const statusPopoverOptions = useMemo(
    () =>
      statusPopoverCurrentStatus
        ? allRawBookingStatuses.filter((status) => status !== statusPopoverCurrentStatus)
        : [],
    [statusPopoverCurrentStatus],
  );

  const bookingsQuery = useAdminBookingsQuery({
    statuses: activeTabs.map((tab) => bookingStatusValueMap[tab]),
    searchTerm: normalizedSearchTerm,
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
        field: 'bookingStatus',
        headerName: 'Status',
        minWidth: 140,
        flex: 0.9,
        sortable: false,
        renderCell: (params: GridRenderCellParams<AdminBookingData>) => {
          const statusStyle = bookingStatusPillColorMap[params.row.bookingStatus];
          return (
            <div className='d-flex items-center h-full'>
              <button
                type='button'
                className='d-flex items-center px-10 py-5 rounded-200 text-12 fw-500'
                style={{
                  color: statusStyle.text,
                  backgroundColor: statusStyle.background,
                  border: `1px solid ${statusStyle.border}`,
                  lineHeight: 1,
                  cursor: 'pointer',
                }}
                onClick={(event) => {
                  setStatusPopoverAnchorEl(event.currentTarget);
                  setStatusPopoverBookingId(params.row.id);
                  setStatusPopoverCurrentStatus(params.row.bookingStatus);
                }}
                disabled={updateBookingStatusMutation.isPending}
              >
                {bookingStatusLabelMap[params.row.bookingStatus]}
                <i className='icon-chevron-down text-10 ml-5' aria-hidden='true' />
              </button>
            </div>
          );
        },
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
    [updateBookingStatusMutation.isPending],
  );

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='bg-white shadow-2 mt-60 md:mb-20 px-40 md:px-20 pt-40 md:pt-20 pb-30 rounded-12'>
        <div className='d-flex justify-between items-center gap-20 mb-20'>
          <AppMultiSelectPills<BookingStatus>
            options={content.tabs}
            value={currentTabs}
            containerSx={{ mb: 0, display: 'inline-flex', alignItems: 'center' }}
            onChange={(nextValue) => {
              setCurrentTabs(nextValue);
              setPage(0);
            }}
          />

          <AdminSearchInput
            id={searchInputId}
            label='Search bookings'
            value={searchTerm}
            onChange={(nextValue) => {
              setPage(0);
              setSearchTerm(nextValue);
            }}
            placeholder={adminContent.shell.searchPlaceholder}
          />
        </div>

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
        <Popover
          open={statusPopoverOpen}
          anchorEl={statusPopoverAnchorEl}
          onClose={() => {
            setStatusPopoverAnchorEl(null);
            setStatusPopoverBookingId(null);
            setStatusPopoverCurrentStatus(null);
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.5,
                p: 1.5,
                borderRadius: 2,
                minWidth: 140,
              },
            },
          }}
        >
          <div className='d-flex flex-column items-start' style={{ gap: 10 }}>
            {statusPopoverOptions.map((statusOption) => {
              const optionStyle = bookingStatusPillColorMap[statusOption];

              return (
                <button
                  key={statusOption}
                  type='button'
                  className='d-inline-flex items-center px-10 py-5 rounded-200 text-12 fw-500'
                  style={{
                    color: optionStyle.text,
                    backgroundColor: optionStyle.background,
                    border: `1px solid ${optionStyle.border}`,
                    lineHeight: 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (!statusPopoverBookingId) {
                      return;
                    }

                    updateBookingStatusMutation.mutate({
                      bookingId: statusPopoverBookingId,
                      bookingStatus: statusOption,
                    });
                    setStatusPopoverAnchorEl(null);
                    setStatusPopoverBookingId(null);
                    setStatusPopoverCurrentStatus(null);
                  }}
                  disabled={updateBookingStatusMutation.isPending}
                >
                  {bookingStatusLabelMap[statusOption]}
                </button>
              );
            })}
          </div>
        </Popover>

        <div className='mt-20 text-14 text-center'>
          {!bookingsQuery.isLoading && !bookingsQuery.isError
            ? `Showing ${(bookingsQuery.data?.rows ?? []).length} of ${bookingsQuery.data?.total ?? 0} booking(s)`
            : null}
        </div>
      </div>
    </AdminShell>
  );
}
