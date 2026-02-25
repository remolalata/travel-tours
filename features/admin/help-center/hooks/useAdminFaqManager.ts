'use client';

import type { DragEndEvent } from '@dnd-kit/core';
import { useCallback, useMemo, useState } from 'react';

import {
  areFaqManagerItemsEqual,
  createEmptyFaqManagerItem,
  mapFaqItemsToManagerItems,
  reorderFaqManagerItems,
} from '@/features/admin/help-center/helpers/faqManager';
import type { AdminFaqManagerItem } from '@/types/adminHelpCenter';
import type { FaqItem } from '@/types/tourContent';

type UseAdminFaqManagerInput = {
  sourceItems: FaqItem[];
};

type UseAdminFaqManagerReturn = {
  items: AdminFaqManagerItem[];
  expandedIds: string[];
  hasChanges: boolean;
  setAllExpanded: (expanded: boolean) => void;
  resetDraft: () => void;
  toggleExpanded: (id: string) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  updateQuestion: (id: string, value: string) => void;
  updateAnswer: (id: string, value: string) => void;
  handleDragEnd: (event: DragEndEvent) => void;
};

export default function useAdminFaqManager({
  sourceItems,
}: UseAdminFaqManagerInput): UseAdminFaqManagerReturn {
  const mappedSourceItems = useMemo(() => mapFaqItemsToManagerItems(sourceItems), [sourceItems]);
  const [draftItems, setDraftItems] = useState<AdminFaqManagerItem[] | null>(null);
  const [draftExpandedIds, setDraftExpandedIds] = useState<string[] | null>(null);

  const items = draftItems ?? mappedSourceItems;
  const defaultExpandedIds = useMemo(() => (items[0] ? [items[0].id] : []), [items]);
  const expandedIds = draftExpandedIds ?? defaultExpandedIds;
  const hasChanges = useMemo(() => {
    if (!draftItems) {
      return false;
    }

    return !areFaqManagerItemsEqual(draftItems, mappedSourceItems);
  }, [draftItems, mappedSourceItems]);

  const setAllExpanded = useCallback(
    (expanded: boolean) => {
      setDraftExpandedIds(expanded ? items.map((item) => item.id) : []);
    },
    [items],
  );

  const toggleExpanded = useCallback(
    (id: string) => {
      setDraftExpandedIds((previousValue) => {
        const nextBase = previousValue ?? (items[0] ? [items[0].id] : []);

        return nextBase.includes(id)
          ? nextBase.filter((currentId) => currentId !== id)
          : [...nextBase, id];
      });
    },
    [items],
  );

  const resetDraft = useCallback(() => {
    setDraftItems(null);
    setDraftExpandedIds(null);
  }, []);

  const addItem = useCallback(() => {
    setDraftItems((previousValue) => {
      const nextBase = previousValue ?? mappedSourceItems;
      const nextItem = createEmptyFaqManagerItem(nextBase.length + 1);

      setDraftExpandedIds((previousExpandedIds) => {
        const expandedBase = previousExpandedIds ?? (nextBase[0] ? [nextBase[0].id] : []);
        return [...expandedBase, nextItem.id];
      });

      return [...nextBase, nextItem];
    });
  }, [mappedSourceItems]);

  const removeItem = useCallback(
    (id: string) => {
      setDraftItems((previousValue) => {
        const nextBase = previousValue ?? mappedSourceItems;
        return nextBase.filter((item) => item.id !== id);
      });
      setDraftExpandedIds((previousValue) => {
        const nextBase = previousValue ?? defaultExpandedIds;
        return nextBase.filter((expandedId) => expandedId !== id);
      });
    },
    [defaultExpandedIds, mappedSourceItems],
  );

  const updateQuestion = useCallback(
    (id: string, value: string) => {
      setDraftItems((previousValue) =>
        (previousValue ?? mappedSourceItems).map((item) =>
          item.id === id ? { ...item, question: value } : item,
        ),
      );
    },
    [mappedSourceItems],
  );

  const updateAnswer = useCallback(
    (id: string, value: string) => {
      setDraftItems((previousValue) =>
        (previousValue ?? mappedSourceItems).map((item) =>
          item.id === id ? { ...item, answerHtml: value } : item,
        ),
      );
    },
    [mappedSourceItems],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      setDraftItems((previousValue) => {
        const nextBase = previousValue ?? mappedSourceItems;
        return reorderFaqManagerItems(nextBase, String(active.id), String(over.id));
      });
    },
    [mappedSourceItems],
  );

  return {
    items,
    expandedIds,
    hasChanges,
    setAllExpanded,
    resetDraft,
    toggleExpanded,
    addItem,
    removeItem,
    updateQuestion,
    updateAnswer,
    handleDragEnd,
  };
}
