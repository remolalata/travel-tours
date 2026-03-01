'use client';

import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';

import AdminShell from '@/components/admin/layout/AdminShell';
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput';
import AdminToursGrid from '@/components/admin/tours/AdminToursGrid';
import AppButton from '@/components/common/button/AppButton';
import AppToast from '@/components/common/feedback/AppToast';
import AppConfirmModal from '@/components/common/modal/AppConfirmModal';
import Pagination from '@/components/common/Pagination';
import { adminContent } from '@/content/features/admin';
import useAdminToursSearch from '@/features/admin/hooks/useAdminToursSearch';
import useAdminToursQuery from '@/services/admin/tours/hooks/useAdminToursQuery';
import useDeleteAdminTourMutation from '@/services/admin/tours/hooks/useDeleteAdminTourMutation';
import type { AdminTourData } from '@/services/admin/tours/mutations/tourApi';
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
  const { searchTerm, normalizedSearchTerm, setSearchTerm } = useAdminToursSearch();
  const toursQuery = useAdminToursQuery({
    page,
    pageSize: toursPageSize,
    searchTerm: normalizedSearchTerm,
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
      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:pb-20 mt-60 md:mt-30'>
        <div
          className='d-flex justify-end items-center mb-20 flex-wrap'
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

        <AdminToursGrid
          tours={tours}
          actionLabels={content.actions}
          pricePrefix={content.pricePrefix}
          availabilityDateLabels={content.availabilityDateLabels}
          isLoading={toursQuery.isLoading}
          errorMessage={hasError ? content.messages.loadError : null}
          emptyMessage={content.messages.empty}
          onEditClick={(tour) => {
            router.push(`/admin/tours/edit/${tour.id}`);
          }}
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
          <div className='text-14 text-center mt-20'>
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
