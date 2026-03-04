'use client';

import { Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';

import AdminShell from '@/components/admin/layout/AdminShell';
import AdminListingFiltersPopover from '@/components/admin/shared/AdminListingFiltersPopover';
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput';
import AdminToursGrid from '@/components/admin/tours/AdminToursGrid';
import AppButton from '@/components/common/button/AppButton';
import AppToast from '@/components/common/feedback/AppToast';
import AppConfirmModal from '@/components/common/modal/AppConfirmModal';
import Pagination from '@/components/common/Pagination';
import { adminContent } from '@/content/features/admin';
import useAdminToursQuery from '@/services/admin/tours/hooks/useAdminToursQuery';
import useDeleteAdminTourMutation from '@/services/admin/tours/hooks/useDeleteAdminTourMutation';
import type { AdminTourData } from '@/services/admin/tours/mutations/tourApi';
import type { AdminListingStatusFilter } from '@/utils/helpers/adminListingFilters';
import useAdminListingFilters from '@/utils/hooks/admin/useAdminListingFilters';
import useAdminToursSearch from '@/utils/hooks/admin/useAdminToursSearch';
import useConfirmDialogState from '@/utils/hooks/useConfirmDialogState';

const toursPageSize = 6;

export default function AdminListingPage() {
  const content = adminContent.pages.listing;
  const router = useRouter();
  const deleteDialog = useConfirmDialogState<AdminTourData>();
  const [page, setPage] = useState(0);
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const searchInputId = useId();
  const listingFilters = useAdminListingFilters();
  const { searchTerm, normalizedSearchTerm, setSearchTerm } = useAdminToursSearch();
  const appliedStatusFilter = listingFilters.statusFilters.find(
    (value): value is Exclude<AdminListingStatusFilter, 'all'> => value !== 'all',
  );
  const toursQuery = useAdminToursQuery({
    page,
    pageSize: toursPageSize,
    searchTerm: normalizedSearchTerm,
    status: appliedStatusFilter,
    visibility: listingFilters.visibilityFilters,
  });
  const deleteTourMutation = useDeleteAdminTourMutation();
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((toursQuery.data?.total ?? 0) / toursPageSize)),
    [toursQuery.data?.total],
  );
  const currentPage = page + 1;
  const tours = toursQuery.data?.rows ?? [];
  const hasError = toursQuery.isError;
  const isSearchActive = normalizedSearchTerm.length > 0;
  const totalTours = toursQuery.data?.total ?? 0;

  async function handleConfirmDelete() {
    if (!deleteDialog.selectedItem) {
      return;
    }

    try {
      await deleteTourMutation.mutateAsync(deleteDialog.selectedItem.id);
      deleteDialog.close();
      setToastState({
        open: true,
        message: content.messages.deleteSuccess,
        severity: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      setToastState({
        open: true,
        message: `${content.messages.deleteFailedPrefix}: ${message}`,
        severity: 'error',
      });
    }
  }

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='bg-white shadow-2 mt-60 md:mt-30 px-40 md:px-20 pt-40 md:pt-20 pb-30 md:pb-20 rounded-12'>
        <div
          className='d-flex flex-wrap justify-between items-center mb-20'
          style={{ columnGap: '16px', rowGap: '10px' }}
        >
          <button
            type='button'
            aria-label={content.filters.triggerLabel}
            aria-expanded={listingFilters.isOpen}
            aria-haspopup='dialog'
            className='d-inline-flex justify-center items-center bg-white border rounded-12'
            style={{
              width: '44px',
              height: '44px',
              borderColor: listingFilters.hasActiveFilters ? '#05073c' : '#e8edf5',
              color: '#05073c',
              backgroundColor: listingFilters.hasActiveFilters ? 'rgba(5, 7, 60, 0.06)' : '#fff',
            }}
            onClick={listingFilters.open}
          >
            <Filter size={18} strokeWidth={2} aria-hidden='true' />
          </button>
          <div
            className='d-flex flex-wrap items-center'
            style={{ columnGap: '16px', rowGap: '10px' }}
          >
            <AdminSearchInput
              id={searchInputId}
              label='Search tours'
              value={searchTerm}
              onChange={(nextValue) => {
                setPage(0);
                setSearchTerm(nextValue);
              }}
              placeholder={adminContent.shell.searchPlaceholder}
              containerClassName='rounded-12'
              containerStyle={{ paddingTop: '7px', paddingBottom: '7px' }}
              inputClassName='text-15 fw-500'
            />
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
        </div>
        <AdminListingFiltersPopover
          open={listingFilters.isOpen}
          anchorEl={listingFilters.anchorEl}
          draftStatusFilters={listingFilters.draftStatusFilters}
          draftVisibilityFilters={listingFilters.draftVisibilityFilters}
          onClose={listingFilters.close}
          onDraftStatusFiltersChange={listingFilters.setDraftStatusFilters}
          onDraftVisibilityFiltersChange={listingFilters.setDraftVisibilityFilters}
          onResetDraft={listingFilters.resetDraft}
          onApply={() => {
            setPage(0);
            listingFilters.apply();
          }}
          content={content}
        />

        <AdminToursGrid
          tours={tours}
          actionLabels={content.actions}
          pricePrefix={content.pricePrefix}
          availabilityDateLabels={content.availabilityDateLabels}
          isLoading={toursQuery.isLoading}
          errorMessage={hasError ? content.messages.loadError : null}
          emptyMessage={content.messages.empty}
          onDeleteClick={deleteDialog.open}
        />

        <div className='mt-30'>
          {!hasError && totalTours > 0 ? (
            <Pagination
              range={totalPages}
              page={currentPage}
              onPageChange={(nextPage) => {
                setPage(nextPage - 1);
              }}
            />
          ) : null}
          <div className='mt-20 text-14 text-center'>
            {!hasError
              ? `${content.summary.showing} ${tours.length} ${content.summary.of} ${totalTours} ${isSearchActive ? 'matched' : content.summary.itemSuffix}`
              : null}
          </div>
        </div>
      </div>
      <AppConfirmModal
        open={deleteDialog.isOpen}
        onClose={() => {
          if (!deleteTourMutation.isPending) {
            deleteDialog.close();
          }
        }}
        onConfirm={handleConfirmDelete}
        title={content.deleteModal.title}
        description={
          deleteDialog.selectedItem
            ? `${content.deleteModal.description} (${deleteDialog.selectedItem.title})`
            : content.deleteModal.description
        }
        cancelLabel={content.deleteModal.actions.cancel}
        confirmLabel={content.deleteModal.actions.confirm}
        isConfirming={deleteTourMutation.isPending}
      />
      <AppToast
        open={toastState.open}
        message={toastState.message}
        severity={toastState.severity}
        onClose={() =>
          setToastState((previousValue) => ({
            ...previousValue,
            open: false,
          }))
        }
      />
    </AdminShell>
  );
}
