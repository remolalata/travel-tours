'use client';

import type { DragEndEvent } from '@dnd-kit/core';
import { useCallback } from 'react';

import type { AdminTextBlockLikeItem } from '@/types/adminTextBlocks';
import { reorderTextBlockItems } from '@/utils/helpers/textBlocksManager';

type UseAdminTextBlocksManagerInput<T extends AdminTextBlockLikeItem> = {
  items: T[];
  onChange: (nextItems: T[]) => void;
  createItem: (nextIndex: number) => T;
};

export default function useAdminTextBlocksManager<T extends AdminTextBlockLikeItem>({
  items,
  onChange,
  createItem,
}: UseAdminTextBlocksManagerInput<T>) {
  const addItem = useCallback(() => {
    onChange([...items, createItem(items.length + 1)]);
  }, [createItem, items, onChange]);

  const removeItem = useCallback(
    (id: string) => {
      if (items.length <= 1) {
        return;
      }

      onChange(items.filter((item) => item.id !== id));
    },
    [items, onChange],
  );

  const updateItemContent = useCallback(
    (id: string, value: string) => {
      onChange(items.map((item) => (item.id === id ? { ...item, content: value } : item)));
    },
    [items, onChange],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      onChange(reorderTextBlockItems(items, String(active.id), String(over.id)));
    },
    [items, onChange],
  );

  return {
    addItem,
    removeItem,
    updateItemContent,
    handleDragEnd,
  };
}
