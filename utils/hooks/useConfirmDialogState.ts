'use client';

import { useCallback, useState } from 'react';

export default function useConfirmDialogState<T>() {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const open = useCallback((item: T) => {
    setSelectedItem(item);
  }, []);

  const close = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return {
    selectedItem,
    isOpen: selectedItem !== null,
    open,
    close,
  };
}
