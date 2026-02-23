import { arrayMove } from '@dnd-kit/sortable';

import type { AdminTextBlockLikeItem } from '@/types/adminTextBlocks';

export function reorderTextBlockItems<T extends AdminTextBlockLikeItem>(
  items: T[],
  activeId: string,
  overId: string,
): T[] {
  const oldIndex = items.findIndex((item) => item.id === activeId);
  const newIndex = items.findIndex((item) => item.id === overId);

  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return items;
  }

  return arrayMove(items, oldIndex, newIndex);
}
