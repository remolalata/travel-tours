'use client';

import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

import AppButton from '@/components/common/button/AppButton';
import type { AppGalleryPickerItem } from '@/types/gallery';
import { createGalleryItemsFromFiles, revokeGalleryItemObjectUrls } from '@/utils/helpers/gallery';

type AppSingleImagePickerLabels = {
  title: string;
  dropzoneLabel: string;
  dropzoneHint: string;
  select: string;
  replace: string;
  remove: string;
  empty: string;
  previewAltFallback: string;
};

type AppSingleImagePickerProps = {
  item: AppGalleryPickerItem | null;
  onChange: (nextItem: AppGalleryPickerItem | null) => void;
  labels: AppSingleImagePickerLabels;
  accept?: Record<string, string[]>;
};

export default function AppSingleImagePicker({
  item,
  onChange,
  labels,
  accept = { 'image/*': [] },
}: AppSingleImagePickerProps) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept,
    noClick: true,
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (item) {
        revokeGalleryItemObjectUrls([item]);
      }

      const nextItem = createGalleryItemsFromFiles([file])[0];
      onChange(nextItem ?? null);
    },
  });

  function handleRemove() {
    if (item) {
      revokeGalleryItemObjectUrls([item]);
    }
    onChange(null);
  }

  return (
    <div>
      <div className='d-flex justify-between items-center mb-15' style={{ gap: 10 }}>
        <div className='text-16 fw-500' style={{ color: '#05073c' }}>
          {labels.title}
        </div>

        <div className='d-flex' style={{ gap: 8 }}>
          <AppButton size='sm' variant='outline' onClick={open}>
            {item ? labels.replace : labels.select}
          </AppButton>
          {item ? (
            <AppButton size='sm' variant='outline' onClick={handleRemove}>
              {labels.remove}
            </AppButton>
          ) : null}
        </div>
      </div>

      <input {...getInputProps()} style={{ display: 'none' }} />

      {item ? (
        <div
          className='border rounded-12 overflow-hidden'
          style={{
            position: 'relative',
            borderColor: 'rgba(5, 7, 60, 0.10)',
            background: '#f8fafc',
            width: '100%',
            aspectRatio: '21 / 9',
          }}
        >
          <Image
            src={item.src}
            alt={item.alt || labels.previewAltFallback}
            fill
            unoptimized
            sizes='100vw'
            style={{ objectFit: 'cover', display: 'block' }}
          />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className='p-15 border rounded-12'
          style={{
            borderStyle: 'dashed',
            borderColor: isDragActive ? 'rgba(235, 102, 43, 0.55)' : 'rgba(5, 7, 60, 0.16)',
            background: isDragActive ? 'rgba(235, 102, 43, 0.04)' : '#fff',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            className='d-flex justify-center items-center text-center'
            style={{ width: '100%', aspectRatio: '21 / 9' }}
          >
            <div>
              <div className='text-15 fw-500' style={{ color: '#05073c' }}>
                {labels.dropzoneLabel}
              </div>
              <div className='mt-5 text-13' style={{ color: '#5a647d' }}>
                {labels.dropzoneHint}
              </div>
              <div className='mt-10 text-13' style={{ color: '#5a647d' }}>
                {labels.empty}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
