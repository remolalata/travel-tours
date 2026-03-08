'use client';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { useState } from 'react';

import AppButton from '@/components/common/button/AppButton';
import DatePickerInput from '@/components/common/date/DatePickerInput';
import DateRangePickerInput from '@/components/common/date/DateRangePickerInput';
import AppFieldHelper from '@/components/common/form/AppFieldHelper';
import AppSelectField from '@/components/common/form/AppSelectField';
import AppTextField from '@/components/common/form/AppTextField';
import type { AdminListingContent } from '@/types/admin';
import { muiFieldSx } from '@/utils/styles/muiFieldSx';

type DepartureItem = {
  id: string;
  startDate: string;
  endDate: string;
  bookingDeadline: string;
  maximumCapacity: string;
  price: string;
  originalPrice: string;
  status: 'open' | 'sold_out' | 'closed' | 'cancelled';
};

type DepartureFieldKey =
  | 'startDate'
  | 'endDate'
  | 'bookingDeadline'
  | 'maximumCapacity'
  | 'price'
  | 'originalPrice'
  | 'status';

type AdminDepartureBlocksManagerProps = {
  items: DepartureItem[];
  fieldErrors: Record<
    string,
    Partial<
      Record<'startDate' | 'endDate' | 'bookingDeadline' | 'maximumCapacity' | 'price', string>
    >
  >;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, key: DepartureFieldKey, value: string) => void;
  content: AdminListingContent['createPage'];
};

function DepartureAccordionItem({
  item,
  index,
  itemsCount,
  fieldErrors,
  onRemove,
  onUpdateItem,
  content,
}: {
  item: DepartureItem;
  index: number;
  itemsCount: number;
  fieldErrors: Partial<
    Record<'startDate' | 'endDate' | 'bookingDeadline' | 'maximumCapacity' | 'price', string>
  >;
  onRemove: () => void;
  onUpdateItem: (key: DepartureFieldKey, value: string) => void;
  content: AdminListingContent['createPage'];
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div>
      <Accordion
        expanded={expanded}
        onChange={(_, nextExpanded) => setExpanded(nextExpanded)}
        disableGutters
        sx={{
          borderRadius: '14px !important',
          border: '1px solid #e8edf5',
          boxShadow: 'none',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<i className='icon-chevron-down text-14' aria-hidden='true' />}
          aria-label={content.departureBlocks.item.expandIconAriaLabel}
          sx={{
            px: 2,
            py: 1,
            minHeight: '60px !important',
            '& .MuiAccordionSummary-content': { margin: '6px 0 !important', alignItems: 'center' },
          }}
        >
          <div className='text-15 fw-500' style={{ color: '#05073c' }}>
            {content.departureBlocks.item.titlePrefix} {index + 1}
          </div>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 2, pb: 2 }}>
          <Box
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}
          >
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <DateRangePickerInput
                key={`${item.id}-${item.startDate}-${item.endDate}`}
                useMuiInput
                allowEmpty
                muiInputLabel={content.departureBlocks.fields.dateRange}
                muiInputRequired
                muiInputSx={muiFieldSx}
                muiInputError={Boolean(fieldErrors.startDate || fieldErrors.endDate)}
                muiInputHelperText={
                  fieldErrors.startDate ||
                  fieldErrors.endDate ||
                  content.departureBlocks.helpers.dateRange
                }
                initialSelectedDates={[
                  item.startDate ? dayjs(item.startDate) : null,
                  item.endDate ? dayjs(item.endDate) : null,
                ]}
                onValueChange={(_, [startDate, endDate]) => {
                  onUpdateItem('startDate', startDate.format('YYYY-MM-DD'));
                  onUpdateItem('endDate', endDate.format('YYYY-MM-DD'));
                }}
              />
            </Box>
            <Box>
              <DatePickerInput
                key={`${item.id}-${item.bookingDeadline}`}
                useMuiInput
                allowEmpty
                muiInputLabel={content.departureBlocks.fields.bookingDeadline}
                muiInputRequired
                muiInputSx={muiFieldSx}
                muiInputError={Boolean(fieldErrors.bookingDeadline)}
                muiInputHelperText={
                  fieldErrors.bookingDeadline || content.departureBlocks.helpers.bookingDeadline
                }
                initialSelectedDate={item.bookingDeadline ? dayjs(item.bookingDeadline) : null}
                onValueChange={(_, selectedDate) => {
                  onUpdateItem('bookingDeadline', selectedDate.format('YYYY-MM-DD'));
                }}
              />
            </Box>
            <Box>
              <AppTextField
                label={content.departureBlocks.fields.maximumCapacity}
                value={item.maximumCapacity}
                onChange={(value) => onUpdateItem('maximumCapacity', value)}
                type='number'
                errorMessage={fieldErrors.maximumCapacity}
                inputProps={{ min: 1 }}
              />
              <AppFieldHelper
                text={
                  fieldErrors.maximumCapacity || content.departureBlocks.helpers.maximumCapacity
                }
                className={fieldErrors.maximumCapacity ? 'text-red-1' : undefined}
              />
            </Box>
            <Box>
              <AppTextField
                label={content.departureBlocks.fields.price}
                value={item.price}
                onChange={(value) => onUpdateItem('price', value)}
                type='number'
                errorMessage={fieldErrors.price}
              />
              <AppFieldHelper
                text={fieldErrors.price || content.departureBlocks.helpers.price}
                className={fieldErrors.price ? 'text-red-1' : undefined}
              />
            </Box>
            <Box>
              <AppTextField
                label={content.departureBlocks.fields.originalPrice}
                value={item.originalPrice}
                onChange={(value) => onUpdateItem('originalPrice', value)}
                type='number'
              />
              <AppFieldHelper text={content.departureBlocks.helpers.originalPrice} />
            </Box>
            <Box>
              <AppSelectField
                label={content.departureBlocks.fields.status}
                value={item.status}
                onChange={(value) => onUpdateItem('status', value)}
                options={content.departureBlocks.statusOptions}
              />
              <AppFieldHelper text={content.departureBlocks.helpers.status} />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: '1 / -1', md: '1 / -1' },
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <AppButton
                type='button'
                size='sm'
                variant='outline'
                onClick={onRemove}
                disabled={itemsCount <= 1}
              >
                {content.departureBlocks.actions.removeItem}
              </AppButton>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default function AdminDepartureBlocksManager({
  items,
  fieldErrors,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  content,
}: AdminDepartureBlocksManagerProps) {
  return (
    <div>
      <div className='toursCreateSection__header d-flex justify-between items-center'>
        <div>
          <h4 className='text-18 fw-500'>{content.departureBlocks.title}</h4>
          <p className='text-14 text-light-1 mt-5'>{content.departureBlocks.description}</p>
        </div>
        <AppButton type='button' size='sm' variant='outline' onClick={onAddItem}>
          {content.departureBlocks.actions.addItem}
        </AppButton>
      </div>

      <div className='d-flex flex-column y-gap-15'>
        {items.map((item, index) => (
          <DepartureAccordionItem
            key={item.id}
            item={item}
            index={index}
            itemsCount={items.length}
            fieldErrors={fieldErrors[item.id] ?? {}}
            onRemove={() => onRemoveItem(item.id)}
            onUpdateItem={(key, value) => onUpdateItem(item.id, key, value)}
            content={content}
          />
        ))}
      </div>
    </div>
  );
}
