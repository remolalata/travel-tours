import { arrayMove } from '@dnd-kit/sortable';

import type { AdminFaqManagerItem } from '@/types/adminHelpCenter';
import type { FaqItem } from '@/types/tourContent';

function buildFaqManagerItemId(index: number): string {
  return `faq-item-${index + 1}`;
}

export function mapFaqItemsToManagerItems(items: FaqItem[]): AdminFaqManagerItem[] {
  return items.map((item, index) => ({
    id: buildFaqManagerItemId(index),
    question: item.question,
    answerHtml: item.answer,
  }));
}

export function createEmptyFaqManagerItem(nextIndex: number): AdminFaqManagerItem {
  return {
    id: `faq-item-new-${nextIndex}`,
    question: '',
    answerHtml: '',
  };
}

export function mapManagerItemsToFaqItems(items: AdminFaqManagerItem[]): FaqItem[] {
  return items.map((item) => ({
    question: item.question.trim(),
    answer: item.answerHtml.trim(),
  }));
}

export function reorderFaqManagerItems(
  items: AdminFaqManagerItem[],
  activeId: string,
  overId: string,
): AdminFaqManagerItem[] {
  const oldIndex = items.findIndex((item) => item.id === activeId);
  const newIndex = items.findIndex((item) => item.id === overId);

  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
    return items;
  }

  return arrayMove(items, oldIndex, newIndex);
}

export function getFaqItemDisplayTitle(
  item: AdminFaqManagerItem,
  index: number,
  untitledPrefix: string,
  emptyQuestionLabel: string,
): string {
  const question = item.question.trim();

  if (question) {
    return question;
  }

  return `${untitledPrefix} ${index + 1} - ${emptyQuestionLabel}`;
}

export function stripHtmlToText(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function findInvalidFaqManagerItem(items: AdminFaqManagerItem[]): {
  index: number;
  field: 'question' | 'answer';
} | null {
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];

    if (!item.question.trim()) {
      return { index, field: 'question' };
    }

    if (!stripHtmlToText(item.answerHtml)) {
      return { index, field: 'answer' };
    }
  }

  return null;
}

export function areFaqManagerItemsEqual(
  leftItems: AdminFaqManagerItem[],
  rightItems: AdminFaqManagerItem[],
): boolean {
  if (leftItems.length !== rightItems.length) {
    return false;
  }

  for (let index = 0; index < leftItems.length; index += 1) {
    const left = leftItems[index];
    const right = rightItems[index];

    if (left.question !== right.question || left.answerHtml !== right.answerHtml) {
      return false;
    }
  }

  return true;
}
