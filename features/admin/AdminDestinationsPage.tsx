'use client';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import type { GridRenderCellParams } from '@mui/x-data-grid';
import Image from 'next/image';
import { type ChangeEvent, useState } from 'react';

import useCreateDestinationMutation from '@/api/destinations/hooks/useCreateDestinationMutation';
import useDeleteDestinationMutation from '@/api/destinations/hooks/useDeleteDestinationMutation';
import useDestinationsQuery from '@/api/destinations/hooks/useDestinationsQuery';
import useUpdateDestinationMutation from '@/api/destinations/hooks/useUpdateDestinationMutation';
import AdminShell from '@/components/admin/layout/AdminShell';
import AppButton from '@/components/common/button/AppButton';
import AppToast from '@/components/common/feedback/AppToast';
import AppTextField from '@/components/common/form/AppTextField';
import AppModal from '@/components/common/modal/AppModal';
import type { DataTableColumn } from '@/components/common/table/AppDataTable';
import AppDataTable from '@/components/common/table/AppDataTable';
import { adminContent } from '@/content/features/admin';
import type { Destination } from '@/types/destination';

type DestinationFormState = {
  name: string;
  isActive: boolean;
};

type ModalMode = 'add' | 'edit' | null;

const initialFormState: DestinationFormState = {
  name: '',
  isActive: true,
};

export default function AdminDestinationsPage() {
  const content = adminContent.pages.destinations;
  const destinationsQuery = useDestinationsQuery({});
  const createDestinationMutation = useCreateDestinationMutation();
  const updateDestinationMutation = useUpdateDestinationMutation();
  const deleteDestinationMutation = useDeleteDestinationMutation();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState<DestinationFormState>(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const isModalOpen = modalMode !== null;
  const isSaving = createDestinationMutation.isPending || updateDestinationMutation.isPending;
  const modalContent = modalMode === 'edit' ? content.editModal : content.addModal;

  function buildSlug(name: string): string {
    const sanitized = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    if (sanitized) {
      return sanitized;
    }

    return `destination-${Date.now()}`;
  }

  function resetFormState() {
    setFormState(initialFormState);
    setImageFile(null);
    setImagePreview('');
    setRemoveImage(false);
    setFormErrorMessage(null);
  }

  function handleOpenAddModal() {
    setEditingDestination(null);
    resetFormState();
    setModalMode('add');
  }

  function handleOpenEditModal(destination: Destination) {
    setEditingDestination(destination);
    setFormErrorMessage(null);
    setFormState({
      name: destination.name,
      isActive: destination.isActive,
    });
    setImageFile(null);
    setImagePreview(destination.imageSrc ?? '');
    setRemoveImage(false);
    setModalMode('edit');
  }

  function handleCloseModal() {
    if (isSaving) {
      return;
    }

    setModalMode(null);
    setEditingDestination(null);
    resetFormState();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(fileUrl);
    setRemoveImage(false);
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview('');
    setRemoveImage(true);
  }

  async function handleSaveDestination() {
    const name = formState.name.trim();

    if (!name) {
      setFormErrorMessage(modalContent.messages.requiredName);
      return;
    }

    const slug = buildSlug(name);

    try {
      setFormErrorMessage(null);

      if (modalMode === 'edit' && editingDestination) {
        await updateDestinationMutation.mutateAsync({
          id: editingDestination.id,
          name,
          slug,
          imageFile,
          isActive: formState.isActive,
          removeImage,
          currentImageSrc: editingDestination.imageSrc,
        });

        setToastState({
          open: true,
          message: content.editModal.messages.updateSuccess,
          severity: 'success',
        });
      } else {
        await createDestinationMutation.mutateAsync({
          name,
          slug,
          imageFile,
          isActive: formState.isActive,
        });

        setToastState({
          open: true,
          message: content.addModal.messages.createSuccess,
          severity: 'success',
        });
      }

      handleCloseModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.startsWith('DESTINATION_UPLOAD_FAILED:')) {
        setFormErrorMessage(
          `${modalContent.messages.uploadFailedPrefix}: ${message.replace('DESTINATION_UPLOAD_FAILED:', '')}`,
        );
        return;
      }

      const failedPrefix =
        modalMode === 'edit'
          ? content.editModal.messages.updateFailedPrefix
          : content.addModal.messages.createFailedPrefix;

      setFormErrorMessage(`${failedPrefix}: ${message}`);
    }
  }

  async function handleDeleteDestination(destination: Destination) {
    try {
      await deleteDestinationMutation.mutateAsync(destination.id);
      setToastState({
        open: true,
        message: content.table.messages.deleteSuccess,
        severity: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      setToastState({
        open: true,
        message: `${content.table.messages.deleteFailedPrefix}: ${message}`,
        severity: 'error',
      });
    }
  }

  const columns: DataTableColumn<Destination>[] = [
    {
      field: 'name',
      headerName: content.table.columns.name,
      minWidth: 220,
      flex: 1.2,
      sortable: false,
    },
    {
      field: 'imageSrc',
      headerName: content.table.columns.image,
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Destination, string | null>) => (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={params.row.imageSrc ?? undefined}
            alt={params.row.name}
            sx={{ width: 36, height: 36, bgcolor: 'var(--color-blue-1)' }}
          >
            {params.row.name.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      ),
    },
    {
      field: 'isActive',
      headerName: content.table.columns.active,
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Destination, boolean>) => (
        <Chip
          size='small'
          label={
            params.row.isActive
              ? content.table.statusLabels.active
              : content.table.statusLabels.inactive
          }
          color={params.row.isActive ? 'success' : 'default'}
          variant={params.row.isActive ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: content.table.columns.actions,
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<Destination>) => (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Tooltip title={content.table.actions.editLabel}>
            <span>
              <IconButton
                size='small'
                aria-label={content.table.actions.editLabel}
                onClick={() => handleOpenEditModal(params.row)}
                disabled={deleteDestinationMutation.isPending}
              >
                <i className='icon-pencil text-16' />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={content.table.actions.deleteLabel}>
            <span>
              <IconButton
                size='small'
                aria-label={content.table.actions.deleteLabel}
                onClick={() => handleDeleteDestination(params.row)}
                disabled={deleteDestinationMutation.isPending}
              >
                <i className='icon-delete text-16' />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:mb-20 mt-60'>
        <div className='d-flex justify-end mb-20'>
          <AppButton type='button' size='sm' onClick={handleOpenAddModal}>
            {content.addButtonLabel}
          </AppButton>
        </div>

        <AppDataTable
          columns={columns}
          rows={destinationsQuery.data ?? []}
          rowKey={(row) => row.id}
          loading={destinationsQuery.isLoading}
          refreshing={destinationsQuery.isFetching && !destinationsQuery.isLoading}
          errorMessage={destinationsQuery.isError ? content.table.messages.loadError : null}
          emptyMessage={content.table.messages.empty}
        />
      </div>

      <AppModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={modalContent.title}
        size='small'
        actions={
          <>
            <AppButton
              type='button'
              size='sm'
              variant='outline'
              onClick={handleCloseModal}
              disabled={isSaving}
            >
              {modalContent.actions.cancel}
            </AppButton>
            <AppButton type='button' size='sm' onClick={handleSaveDestination} disabled={isSaving}>
              {isSaving ? modalContent.actions.saving : modalContent.actions.save}
            </AppButton>
          </>
        }
      >
        <div className='d-flex flex-column' style={{ gap: 20 }}>
          <div>
            <AppTextField
              label={modalContent.fields.name}
              value={formState.name}
              onChange={(nextName) =>
                setFormState((previousValue) => ({
                  ...previousValue,
                  name: nextName,
                }))
              }
            />
          </div>

          <div>
            <div className='relative w-100 rounded-12 overflow-hidden' style={{ height: 180 }}>
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt={modalContent.image.previewAlt}
                    fill
                    sizes='(max-width: 768px) 100vw, 520px'
                    className='object-cover'
                    unoptimized={imagePreview.startsWith('blob:')}
                  />
                  <button
                    onClick={clearImage}
                    className='absoluteIcon1 button -dark-1'
                    type='button'
                    aria-label={modalContent.image.clearLabel}
                  >
                    <i className='icon-delete text-18'></i>
                  </button>
                </>
              ) : (
                <label
                  htmlFor='destination-image'
                  className='rounded-12 border-dash-1 bg-accent-1-05 flex-center flex-column'
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                  }}
                >
                  <Image
                    width={40}
                    height={40}
                    alt={modalContent.image.uploadLabel}
                    src='/img/dashboard/upload.svg'
                  />
                  <div className='text-16 fw-500 text-accent-1 mt-10'>
                    {modalContent.image.uploadLabel}
                  </div>
                </label>
              )}
              <input
                id='destination-image'
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div>
            <Box
              sx={{
                border: '1px solid #dfe5ee',
                borderRadius: 2,
                px: 2,
                py: 1.25,
                bgcolor: '#fff',
              }}
            >
              <FormControlLabel
                sx={{ m: 0, width: '100%', justifyContent: 'space-between' }}
                label={modalContent.fields.active}
                labelPlacement='start'
                control={
                  <Switch
                    checked={formState.isActive}
                    onChange={(event) =>
                      setFormState((previousValue) => ({
                        ...previousValue,
                        isActive: event.target.checked,
                      }))
                    }
                  />
                }
              />
            </Box>
          </div>

          {formErrorMessage ? (
            <Alert severity='error' sx={{ mt: 0.5 }}>
              {formErrorMessage}
            </Alert>
          ) : null}
        </div>
      </AppModal>

      <AppToast
        open={toastState.open}
        message={toastState.message}
        severity={toastState.severity}
        onClose={() => setToastState((previousValue) => ({ ...previousValue, open: false }))}
      />
    </AdminShell>
  );
}
