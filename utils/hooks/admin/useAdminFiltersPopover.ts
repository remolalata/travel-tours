'use client';

import type { MouseEvent, SetStateAction } from 'react';
import { useMemo, useState } from 'react';

type UseAdminFiltersPopoverConfig<TFilters> = {
  initialFilters: TFilters;
  hasActiveFilters: (filters: TFilters) => boolean;
};

export default function useAdminFiltersPopover<TFilters>({
  initialFilters,
  hasActiveFilters,
}: UseAdminFiltersPopoverConfig<TFilters>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);

  const isOpen = Boolean(anchorEl);
  const active = useMemo(
    () => hasActiveFilters(appliedFilters),
    [appliedFilters, hasActiveFilters],
  );

  function open(event: MouseEvent<HTMLElement>) {
    setDraftFilters(appliedFilters);
    setAnchorEl(event.currentTarget);
  }

  function close() {
    setDraftFilters(appliedFilters);
    setAnchorEl(null);
  }

  function apply() {
    setAppliedFilters(draftFilters);
    setAnchorEl(null);
  }

  function resetDraft() {
    setDraftFilters(initialFilters);
  }

  function resetApplied() {
    setAppliedFilters(initialFilters);
    setDraftFilters(initialFilters);
  }

  return {
    anchorEl,
    isOpen,
    hasActiveFilters: active,
    appliedFilters,
    draftFilters,
    setDraftFilters: (value: SetStateAction<TFilters>) => setDraftFilters(value),
    open,
    close,
    apply,
    resetDraft,
    resetApplied,
  };
}
