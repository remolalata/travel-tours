'use client';

import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

import AppButton from '@/components/common/button/AppButton';
import type { AppGalleryPickerItem } from '@/types/gallery';
import { createGalleryItemsFromFiles, revokeGalleryItemObjectUrls } from '@/utils/helpers/gallery';

type AppImageGalleryPickerLabels = {
  title: string;
  dropzoneLabel: string;
  dropzoneHint: string;
  addMore: string;
  remove: string;
  empty: string;
  itemAltFallback: string;
};

type AppImageGalleryPickerProps = {
  items: AppGalleryPickerItem[];
  onChange: (nextItems: AppGalleryPickerItem[]) => void;
  labels: AppImageGalleryPickerLabels;
  maxFiles?: number;
  accept?: Record<string, string[]>;
};

function GalleryItem({
  item,
  index,
  onRemove,
  labels,
}: {
  item: AppGalleryPickerItem;
  index: number;
  onRemove: () => void;
  labels: AppImageGalleryPickerLabels;
}) {
  return (
    <div
      className='rounded-12 border-1 bg-white p-10'
      style={{ position: 'relative' }}
    >
      <button
        type='button'
        aria-label={labels.remove}
        onClick={onRemove}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 28,
          height: 28,
          borderRadius: 999,
          border: '1px solid rgba(5, 7, 60, 0.14)',
          background: 'rgba(255, 255, 255, 0.92)',
          color: '#05073c',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1,
          fontSize: 14,
          lineHeight: 1,
        }}
      >
        ×
      </button>

      <div
        className='overflow-hidden rounded-10 border-1'
        style={{
          aspectRatio: '1 / 1',
          borderColor: 'rgba(5, 7, 60, 0.10)',
          background: '#f8fafc',
        }}
      >
        <img
          src={item.src}
          alt={item.alt || `${labels.itemAltFallback} ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    </div>
  );
}

export default function AppImageGalleryPicker({
  items,
  onChange,
  labels,
  maxFiles,
  accept = { 'image/*': [] },
}: AppImageGalleryPickerProps) {
  const canAddMore = typeof maxFiles !== 'number' || items.length < maxFiles;
  const remainingSlots = typeof maxFiles === 'number' ? Math.max(maxFiles - items.length, 0) : undefined;

  const onDrop = useMemo(
    () => (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) {
        return;
      }

      const nextFiles =
        typeof remainingSlots === 'number' ? acceptedFiles.slice(0, remainingSlots) : acceptedFiles;

      if (!nextFiles.length) {
        return;
      }

      onChange([...items, ...createGalleryItemsFromFiles(nextFiles)]);
    },
    [items, onChange, remainingSlots],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    noClick: true,
    multiple: true,
    disabled: !canAddMore,
  });

  function handleRemove(itemId: string) {
    const removedItem = items.find((item) => item.id === itemId);
    if (removedItem) {
      revokeGalleryItemObjectUrls([removedItem]);
    }
    onChange(items.filter((item) => item.id !== itemId));
  }

  return (
    <div>
      <div className='d-flex justify-between items-center mb-15' style={{ gap: 10 }}>
        <div className='text-16 fw-500' style={{ color: '#05073c' }}>
          {labels.title}
        </div>
        <AppButton size='sm' variant='outline' onClick={open} disabled={!canAddMore}>
          {labels.addMore}
        </AppButton>
      </div>

      <input {...getInputProps()} style={{ display: 'none' }} />

      {items.length === 0 ? (
        <div
          {...getRootProps()}
          className='rounded-12 border-1 p-20'
          style={{
            borderStyle: 'dashed',
            borderColor: isDragActive ? 'rgba(235, 102, 43, 0.55)' : 'rgba(5, 7, 60, 0.16)',
            background: isDragActive ? 'rgba(235, 102, 43, 0.04)' : '#fff',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            className='d-flex items-center justify-center text-center'
            style={{ width: '100%', aspectRatio: '21 / 9' }}
          >
            <div>
              <div className='text-15 fw-500' style={{ color: '#05073c' }}>
                {labels.dropzoneLabel}
              </div>
              <div className='text-13 mt-5' style={{ color: '#5a647d' }}>
                {labels.dropzoneHint}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className='mt-15 text-13' style={{ color: '#5a647d' }}>
          {labels.empty}
        </div>
      ) : (
        <div className='mt-15'>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: 12,
            }}
          >
            {items.map((item, index) => (
              <GalleryItem
                key={item.id}
                item={item}
                index={index}
                onRemove={() => handleRemove(item.id)}
                labels={labels}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
