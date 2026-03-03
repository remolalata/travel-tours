'use client';

import Popover from '@mui/material/Popover';

import AppButton from '@/components/common/button/AppButton';
import AppMultiSelectPills from '@/components/common/form/AppMultiSelectPills';
import type { AdminListingContent } from '@/types/admin';
import {
  type AdminListingStatusFilter,
  type AdminListingVisibilityFilter,
  getAdminListingStatusFilterOptions,
  getAdminListingVisibilityFilterOptions,
  mapFilterLabelsToValues,
  mapFilterValuesToLabels,
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
  const statusOptions = getAdminListingStatusFilterOptions(content);
  const visibilityOptions = getAdminListingVisibilityFilterOptions(content);
  const statusLabels = mapFilterValuesToLabels(draftStatusFilters, statusOptions);
  const visibilityLabels = mapFilterValuesToLabels(draftVisibilityFilters, visibilityOptions);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            p: 2,
            borderRadius: 2,
            minWidth: 280,
            maxWidth: 320,
          },
        },
      }}
    >
      <div className='d-flex flex-column' style={{ gap: 18 }}>
        <div className='text-15 fw-600' style={{ color: '#05073c' }}>
          {content.filters.title}
        </div>

        <div>
          <div className='mb-10 text-13 fw-500' style={{ color: '#05073c' }}>
            {content.filters.groups.status.label}
          </div>
          <AppMultiSelectPills<string>
            options={statusOptions.map((option) => option.label)}
            value={statusLabels}
            containerSx={{ mb: 0 }}
            onChange={(nextValue) => {
              const nextFilters = mapFilterLabelsToValues(nextValue, statusOptions);
              onDraftStatusFiltersChange(normalizeSingleSelectFilter(nextFilters, 'all'));
            }}
          />
        </div>

        <div>
          <div className='mb-10 text-13 fw-500' style={{ color: '#05073c' }}>
            {content.filters.groups.visibility.label}
          </div>
          <AppMultiSelectPills<string>
            options={visibilityOptions.map((option) => option.label)}
            value={visibilityLabels}
            containerSx={{ mb: 0 }}
            onChange={(nextValue) => {
              onDraftVisibilityFiltersChange(mapFilterLabelsToValues(nextValue, visibilityOptions));
            }}
          />
        </div>

        <div className='d-flex justify-between items-center' style={{ gap: 10 }}>
          <button
            type='button'
            className='text-13 fw-500'
            style={{ color: '#52607a' }}
            onClick={onResetDraft}
          >
            {content.filters.actions.reset}
          </button>
          <AppButton type='button' size='sm' variant='outline' onClick={onApply}>
            {content.filters.actions.apply}
          </AppButton>
        </div>
      </div>
    </Popover>
  );
}
