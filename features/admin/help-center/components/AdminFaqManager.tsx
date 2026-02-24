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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { useState } from 'react';

import useFaqItemsQuery from '@/api/faqs/hooks/useFaqItemsQuery';
import useSaveFaqItemsMutation from '@/api/faqs/hooks/useSaveFaqItemsMutation';
import AppButton from '@/components/common/button/AppButton';
import AppToast from '@/components/common/feedback/AppToast';
import { adminContent } from '@/content/features/admin';
import AdminFaqAccordionItem from '@/features/admin/help-center/components/AdminFaqAccordionItem';
import {
  findInvalidFaqManagerItem,
  mapManagerItemsToFaqItems,
} from '@/features/admin/help-center/helpers/faqManager';
import useAdminFaqManager from '@/features/admin/help-center/hooks/useAdminFaqManager';
import type { FaqItem } from '@/types/tourContent';

export default function AdminFaqManager() {
  const faqManagerContent = adminContent.pages.helpCenter.faqManager;
  const faqQuery = useFaqItemsQuery({ isActive: true });
  const saveFaqItemsMutation = useSaveFaqItemsMutation();
  const faqManager = useAdminFaqManager({ sourceItems: faqQuery.data ?? [] });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleSave() {
    setSaveError(null);

    const invalidItem = findInvalidFaqManagerItem(faqManager.items);
    if (invalidItem) {
      const itemLabel = `${faqManagerContent.item.untitledPrefix} ${invalidItem.index + 1}`;
      const prefix =
        invalidItem.field === 'question'
          ? faqManagerContent.messages.validationQuestionPrefix
          : faqManagerContent.messages.validationAnswerPrefix;

      setSaveError(`${prefix} ${itemLabel}.`);
      return;
    }

    const payloadItems: FaqItem[] = mapManagerItemsToFaqItems(faqManager.items);

    try {
      await saveFaqItemsMutation.mutateAsync({ items: payloadItems });
      faqManager.resetDraft();
      setToastState({
        open: true,
        message: faqManagerContent.messages.saveSuccess,
        severity: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      setSaveError(`${faqManagerContent.messages.saveFailedPrefix}: ${message}`);
      setToastState({
        open: true,
        message: `${faqManagerContent.messages.saveFailedPrefix}: ${message}`,
        severity: 'error',
      });
    }
  }

  return (
    <div className='mt-40'>
      <div className='rounded-16 bg-white shadow-2 px-30 py-30 md:px-20 md:py-20'>
        <div className='d-flex flex-wrap justify-between items-start' style={{ gap: 12 }}>
          <div>
            <h2 className='text-22'>{faqManagerContent.title}</h2>
            <p className='mt-10 mb-0'>{faqManagerContent.description}</p>
          </div>

          <div className='d-flex flex-wrap' style={{ gap: 10 }}>
            <AppButton
              size='sm'
              variant='outline'
              onClick={faqManager.resetDraft}
              disabled={!faqManager.hasChanges || saveFaqItemsMutation.isPending}
            >
              {faqManagerContent.actions.reset}
            </AppButton>
            <AppButton size='sm' variant='outline' onClick={() => faqManager.setAllExpanded(true)}>
              {faqManagerContent.actions.expandAll}
            </AppButton>
            <AppButton size='sm' variant='outline' onClick={() => faqManager.setAllExpanded(false)}>
              {faqManagerContent.actions.collapseAll}
            </AppButton>
            <AppButton size='sm' onClick={faqManager.addItem}>
              {faqManagerContent.actions.addItem}
            </AppButton>
            <AppButton
              size='sm'
              onClick={handleSave}
              disabled={
                !faqManager.hasChanges || faqQuery.isLoading || saveFaqItemsMutation.isPending
              }
            >
              {saveFaqItemsMutation.isPending
                ? faqManagerContent.actions.saving
                : faqManagerContent.actions.save}
            </AppButton>
          </div>
        </div>

        <Alert severity='info' sx={{ mt: 2.5, borderRadius: 2 }}>
          {faqManagerContent.messages.localOnlyNotice}
        </Alert>

        {saveError ? (
          <Alert severity='error' sx={{ mt: 2, borderRadius: 2 }}>
            {saveError}
          </Alert>
        ) : null}

        {faqQuery.isLoading ? (
          <div className='mt-20 d-grid' style={{ gap: 12 }}>
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} variant='rounded' height={70} />
            ))}
          </div>
        ) : faqQuery.isError ? (
          <Alert severity='error' sx={{ mt: 2.5, borderRadius: 2 }}>
            {faqManagerContent.messages.loadError}
          </Alert>
        ) : faqManager.items.length === 0 ? (
          <Alert severity='warning' sx={{ mt: 2.5, borderRadius: 2 }}>
            {faqManagerContent.messages.empty}
          </Alert>
        ) : (
          <div className='mt-20'>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={faqManager.handleDragEnd}
            >
              <SortableContext
                items={faqManager.items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='d-grid' style={{ gap: 14 }}>
                  {faqManager.items.map((item, index) => (
                    <AdminFaqAccordionItem
                      key={item.id}
                      item={item}
                      index={index}
                      expanded={faqManager.expandedIds.includes(item.id)}
                      onToggleExpanded={() => faqManager.toggleExpanded(item.id)}
                      onQuestionChange={(value) => faqManager.updateQuestion(item.id, value)}
                      onAnswerChange={(value) => faqManager.updateAnswer(item.id, value)}
                      onRemove={() => faqManager.removeItem(item.id)}
                      content={faqManagerContent}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      <AppToast
        open={toastState.open}
        message={toastState.message}
        severity={toastState.severity}
        onClose={() => setToastState((previousValue) => ({ ...previousValue, open: false }))}
      />
    </div>
  );
}
