'use client';

import type { MouseEvent } from 'react';
import { useMemo, useState } from 'react';

import type {
  AdminListingStatusFilter,
  AdminListingVisibilityFilter,
} from '@/utils/helpers/adminListingFilters';

export default function useAdminListingFilters() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [statusFilters, setStatusFilters] = useState<AdminListingStatusFilter[]>(['all']);
  const [visibilityFilters, setVisibilityFilters] = useState<AdminListingVisibilityFilter[]>([]);
  const [draftStatusFilters, setDraftStatusFilters] = useState<AdminListingStatusFilter[]>(['all']);
  const [draftVisibilityFilters, setDraftVisibilityFilters] = useState<
    AdminListingVisibilityFilter[]
  >([]);

  const isOpen = Boolean(anchorEl);
  const hasActiveFilters = useMemo(
    () => statusFilters.some((value) => value !== 'all') || visibilityFilters.length > 0,
    [statusFilters, visibilityFilters],
  );

  function open(event: MouseEvent<HTMLElement>) {
    setDraftStatusFilters(statusFilters);
    setDraftVisibilityFilters(visibilityFilters);
    setAnchorEl(event.currentTarget);
  }

  function close() {
    setDraftStatusFilters(statusFilters);
    setDraftVisibilityFilters(visibilityFilters);
    setAnchorEl(null);
  }

  function resetDraft() {
    setDraftStatusFilters(['all']);
    setDraftVisibilityFilters([]);
  }

  function apply() {
    setStatusFilters(draftStatusFilters);
    setVisibilityFilters(draftVisibilityFilters);
    setAnchorEl(null);
  }

  function resetApplied() {
    setStatusFilters(['all']);
    setVisibilityFilters([]);
    setDraftStatusFilters(['all']);
    setDraftVisibilityFilters([]);
  }

  return {
    anchorEl,
    isOpen,
    hasActiveFilters,
    statusFilters,
    visibilityFilters,
    draftStatusFilters,
    draftVisibilityFilters,
    setDraftStatusFilters,
    setDraftVisibilityFilters,
    open,
    close,
    apply,
    resetDraft,
    resetApplied,
  };
}
