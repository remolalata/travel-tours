'use client';

import AdminFiltersPopover from '@/components/admin/shared/AdminFiltersPopover';
import type { AdminListingContent } from '@/types/admin';
import {
  type AdminListingStatusFilter,
  type AdminListingVisibilityFilter,
  getAdminListingStatusFilterOptions,
  getAdminListingVisibilityFilterOptions,
  normalizeSingleSelectFilter,
} from '@/utils/helpers/adminListingFilters';

type AdminListingFiltersPopoverProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  draftStatusFilters: AdminListingStatusFilter[];
  draftVisibilityFilters: AdminListingVisibilityFilter[];
  onClose: () => void;
  onDraftStatusFiltersChange: (value: AdminListingStatusFilter[]) => void;
  onDraftVisibilityFiltersChange: (value: AdminListingVisibilityFilter[]) => void;
  onResetDraft: () => void;
  onApply: () => void;
  content: AdminListingContent;
};

export default function AdminListingFiltersPopover({
  open,
  anchorEl,
  draftStatusFilters,
  draftVisibilityFilters,
  onClose,
  onDraftStatusFiltersChange,
  onDraftVisibilityFiltersChange,
  onResetDraft,
  onApply,
  content,
}: AdminListingFiltersPopoverProps) {
  return (
    <AdminFiltersPopover
      open={open}
      anchorEl={anchorEl}
      title={content.filters.title}
      groups={[
        {
          id: 'status',
          label: content.filters.groups.status.label,
          options: getAdminListingStatusFilterOptions(content),
          value: draftStatusFilters,
          selectionMode: 'single',
          onChange: (nextValue) => {
            onDraftStatusFiltersChange(normalizeSingleSelectFilter(nextValue, 'all'));
          },
        },
        {
          id: 'visibility',
          label: content.filters.groups.visibility.label,
          options: getAdminListingVisibilityFilterOptions(content),
          value: draftVisibilityFilters,
          onChange: onDraftVisibilityFiltersChange,
        },
      ]}
      resetLabel={content.filters.actions.reset}
      applyLabel={content.filters.actions.apply}
      onClose={onClose}
      onResetDraft={onResetDraft}
      onApply={onApply}
    />
  );
}
