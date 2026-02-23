'use client';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { useState } from 'react';

import AppButton from '@/components/common/button/AppButton';
import AppFieldHelper from '@/components/common/form/AppFieldHelper';
import AppSelectField from '@/components/common/form/AppSelectField';
import AppTextField from '@/components/common/form/AppTextField';
import type { AdminListingContent } from '@/types/admin';

type InclusionItem = {
  id: string;
  itemType: 'included' | 'excluded';
  itemOrder: string;
  content: string;
};

type AdminInclusionBlocksManagerProps = {
  items: InclusionItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, key: keyof Omit<InclusionItem, 'id'>, value: string) => void;
  onDragEnd: (event: import('@dnd-kit/core').DragEndEvent) => void;
  content: AdminListingContent['createPage'];
};

function InclusionAccordionItem({
  item,
  index,
  itemsCount,
  onRemove,
  onUpdateItem,
  content,
}: {
  item: InclusionItem;
  index: number;
  itemsCount: number;
  onRemove: () => void;
  onUpdateItem: (key: keyof Omit<InclusionItem, 'id'>, value: string) => void;
  content: AdminListingContent['createPage'];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
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
          aria-label={content.inclusionBlocks.item.expandIconAriaLabel}
          sx={{
            px: 2,
            py: 1,
            minHeight: '60px !important',
            '& .MuiAccordionSummary-content': { margin: '6px 0 !important', alignItems: 'center' },
          }}
        >
          <button
            type='button'
            {...attributes}
            {...listeners}
            aria-label={content.inclusionBlocks.item.dragHandleAriaLabel}
            onClick={(event) => event.stopPropagation()}
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
          </button>

          <div className='text-15 fw-500' style={{ color: '#05073c' }}>
            {content.inclusionBlocks.item.titlePrefix} {index + 1}
          </div>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
            <Box>
              <AppSelectField
                label={content.inclusionBlocks.fields.itemType}
                value={item.itemType}
                onChange={(value) => onUpdateItem('itemType', value)}
                options={content.inclusionBlocks.typeOptions}
                emptyOptionLabel={content.messages.selectEmpty}
              />
              <AppFieldHelper text={content.inclusionBlocks.helpers.itemType} />
            </Box>
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
              <AppTextField
                label={content.inclusionBlocks.fields.content}
                value={item.content}
                onChange={(value) => onUpdateItem('content', value)}
                multiline
                rows={3}
              />
              <AppFieldHelper text={content.inclusionBlocks.helpers.content} />
            </Box>
            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' }, display: 'flex', justifyContent: 'flex-end' }}>
              <AppButton
                type='button'
                size='sm'
                variant='outline'
                onClick={onRemove}
                disabled={itemsCount <= 1}
              >
                {content.inclusionBlocks.actions.removeItem}
              </AppButton>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default function AdminInclusionBlocksManager({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onDragEnd,
  content,
}: AdminInclusionBlocksManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <div>
      <div className='toursCreateSection__header d-flex justify-between items-center'>
        <div>
          <h4 className='text-18 fw-500'>{content.inclusionBlocks.title}</h4>
          <p className='text-14 text-light-1 mt-5'>{content.inclusionBlocks.description}</p>
        </div>
        <AppButton type='button' size='sm' variant='outline' onClick={onAddItem}>
          {content.inclusionBlocks.actions.addItem}
        </AppButton>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className='d-flex flex-column y-gap-15'>
            {items.map((item, index) => (
              <InclusionAccordionItem
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
