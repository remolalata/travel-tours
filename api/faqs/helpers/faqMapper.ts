import type { FaqItem } from '@/types/tourContent';

type FaqRow = {
  id: number;
  item_order: number;
  question: string;
  answer: string;
};

export function mapFaqRows(rows: FaqRow[]): FaqItem[] {
  return [...rows]
    .sort((left, right) => left.item_order - right.item_order)
    .map((row) => ({
      question: row.question,
      answer: row.answer,
    }));
}

export type { FaqRow };
