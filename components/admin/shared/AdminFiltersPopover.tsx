'use client';

import Popover from '@mui/material/Popover';

import AppButton from '@/components/common/button/AppButton';
import AppMultiSelectPills from '@/components/common/form/AppMultiSelectPills';
import {
  mapFilterLabelsToValues,
  mapFilterValuesToLabels,
} from '@/utils/helpers/adminListingFilters';

export type AdminFilterOption<T extends string> = {
  value: T;
  label: string;
};

export type AdminFilterGroupConfig<T extends string> = {
  id: string;
  label: string;
  options: AdminFilterOption<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  selectionMode?: 'single' | 'multiple';
};

type AdminFiltersPopoverProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  title: string;
  groups: AdminFilterGroupConfig<any>[];
  resetLabel: string;
  applyLabel: string;
  onClose: () => void;
  onResetDraft: () => void;
  onApply: () => void;
};

export default function AdminFiltersPopover({
  open,
  anchorEl,
  title,
  groups,
  resetLabel,
  applyLabel,
  onClose,
  onResetDraft,
  onApply,
}: AdminFiltersPopoverProps) {
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
          {title}
        </div>

        {groups.map((group) => {
          const selectedLabels = mapFilterValuesToLabels(group.value, group.options);

          return (
            <div key={group.id}>
              <div className='mb-10 text-13 fw-500' style={{ color: '#05073c' }}>
                {group.label}
              </div>
              <AppMultiSelectPills<string>
                options={group.options.map((option) => option.label)}
                value={selectedLabels}
                containerSx={{ mb: 0 }}
                onChange={(nextValue) => {
                  const mappedValues = mapFilterLabelsToValues(nextValue, group.options);
                  if (group.selectionMode === 'single') {
                    group.onChange(
                      mappedValues.length > 0 ? [mappedValues[mappedValues.length - 1]] : [],
                    );
                    return;
                  }

                  group.onChange(mappedValues);
                }}
              />
            </div>
          );
        })}

        <div className='d-flex justify-between items-center' style={{ gap: 10 }}>
          <button
            type='button'
            className='text-13 fw-500'
            style={{ color: '#52607a' }}
            onClick={onResetDraft}
          >
            {resetLabel}
          </button>
          <AppButton type='button' size='sm' variant='outline' onClick={onApply}>
            {applyLabel}
          </AppButton>
        </div>
      </div>
    </Popover>
  );
}
