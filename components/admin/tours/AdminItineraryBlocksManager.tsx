'use client';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { useState } from 'react';

import AppButton from '@/components/common/button/AppButton';
import AppFieldHelper from '@/components/common/form/AppFieldHelper';
import AppTextField from '@/components/common/form/AppTextField';
import type { AdminListingContent } from '@/types/admin';

type ItineraryItem = {
  id: string;
  dayNumber: string;
  title: string;
  content: string;
  icon: string;
  isSummary: boolean;
};

type AdminItineraryBlocksManagerProps = {
  items: ItineraryItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, key: keyof Omit<ItineraryItem, 'id'>, value: string | boolean) => void;
  onDragEnd: (event: import('@dnd-kit/core').DragEndEvent) => void;
  content: AdminListingContent['createPage'];
};

function ItineraryAccordionItem({
  item,
  index,
  itemsCount,
  onRemove,
  onUpdateItem,
  content,
}: {
  item: ItineraryItem;
  index: number;
  itemsCount: number;
  onRemove: () => void;
  onUpdateItem: (key: keyof Omit<ItineraryItem, 'id'>, value: string | boolean) => void;
  content: AdminListingContent['createPage'];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
      }}
    >
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
          aria-label={content.itineraryBlocks.item.expandIconAriaLabel}
          sx={{
            px: 2,
            py: 1,
            minHeight: '60px !important',
            '& .MuiAccordionSummary-content': { margin: '6px 0 !important', alignItems: 'center' },
          }}
        >
          <span
            {...listeners}
            aria-label={content.itineraryBlocks.item.dragHandleAriaLabel}
            aria-roledescription={attributes['aria-roledescription']}
            aria-describedby={attributes['aria-describedby']}
            tabIndex={0}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 10,
              border: '1px solid rgba(5, 7, 60, 0.12)',
              background: '#fff',
              marginRight: 12,
              cursor: 'grab',
              flexShrink: 0,
            }}
          >
            <i className='icon-main-menu text-14' aria-hidden='true'></i>
          </span>

          <div className='text-15 fw-500' style={{ color: '#05073c' }}>
            {content.itineraryBlocks.item.titlePrefix} {index + 1}
          </div>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 2, pb: 2 }}>
          <Box
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}
          >
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <AppTextField
                label={content.fields.itineraryTitle}
                value={item.title}
                onChange={(value) => onUpdateItem('title', value)}
              />
              <AppFieldHelper text={content.helpers.itineraryTitle} />
            </Box>
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <AppTextField
                label={content.fields.itineraryContent}
                value={item.content}
                onChange={(value) => onUpdateItem('content', value)}
                multiline
                rows={4}
              />
              <AppFieldHelper text={content.helpers.itineraryContent} />
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
                {content.itineraryBlocks.actions.removeItem}
              </AppButton>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default function AdminItineraryBlocksManager({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onDragEnd,
  content,
}: AdminItineraryBlocksManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <div>
      <div className='toursCreateSection__header d-flex justify-between items-center'>
        <div>
          <h4 className='text-18 fw-500'>{content.itineraryBlocks.title}</h4>
          <p className='text-14 text-light-1 mt-5'>{content.itineraryBlocks.description}</p>
        </div>
        <AppButton type='button' size='sm' variant='outline' onClick={onAddItem}>
          {content.itineraryBlocks.actions.addItem}
        </AppButton>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className='d-flex flex-column y-gap-15'>
            {items.map((item, index) => (
              <ItineraryAccordionItem
                key={item.id}
                item={item}
                index={index}
                itemsCount={items.length}
                onRemove={() => onRemoveItem(item.id)}
                onUpdateItem={(key, value) => onUpdateItem(item.id, key, value)}
                content={content}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
