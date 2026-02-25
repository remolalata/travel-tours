import { arrayMove } from '@dnd-kit/sortable';

import type { AppGalleryPickerItem } from '@/types/gallery';

export function reorderGalleryItems(
  items: AppGalleryPickerItem[],
  activeId: string,
  overId: string,
): AppGalleryPickerItem[] {
  const oldIndex = items.findIndex((item) => item.id === activeId);
  const newIndex = items.findIndex((item) => item.id === overId);

  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return items;
  }

  return arrayMove(items, oldIndex, newIndex);
}

export function createGalleryItemsFromFiles(files: File[]): AppGalleryPickerItem[] {
  return files.map((file, index) => ({
    id: `gallery-file-${Date.now()}-${index}`,
    src: URL.createObjectURL(file),
    alt: file.name,
    file,
    isNew: true,
  }));
}

export function revokeGalleryItemObjectUrls(items: AppGalleryPickerItem[]) {
  items.forEach((item) => {
    if (item.isNew && item.src.startsWith('blob:')) {
      URL.revokeObjectURL(item.src);
    }
  });
}
