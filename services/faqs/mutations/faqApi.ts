import type { SupabaseClient } from '@supabase/supabase-js';

import type { FaqRow } from '@/services/faqs/helpers/faqMapper';
import { mapFaqRows } from '@/services/faqs/helpers/faqMapper';
import type { FaqItem } from '@/types/tourContent';

export type FetchFaqItemsInput = {
  isActive?: boolean;
  limit?: number;
};

export type SaveFaqItemsInput = {
  items: FaqItem[];
};

export async function fetchFaqItems(
  supabase: SupabaseClient,
  input: FetchFaqItemsInput = {},
): Promise<FaqItem[]> {
  let query = supabase
    .from('faq_items')
    .select('id,item_order,question,answer')
    .order('item_order', { ascending: true });

  if (typeof input.isActive === 'boolean') {
    query = query.eq('is_active', input.isActive);
  }

  if (typeof input.limit === 'number') {
    query = query.limit(input.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`FAQ_ITEMS_FETCH_FAILED:${error.message}`);
  }

  return mapFaqRows((data ?? []) as FaqRow[]);
}

export async function saveFaqItems(
  supabase: SupabaseClient,
  input: SaveFaqItemsInput,
): Promise<void> {
  const payload = input.items.map((item, index) => ({
    item_order: index + 1,
    question: item.question.trim(),
    answer: item.answer.trim(),
    is_active: true,
  }));

  const { error: deleteError } = await supabase.from('faq_items').delete().gte('item_order', 1);

  if (deleteError) {
    throw new Error(`FAQ_ITEMS_DELETE_FAILED:${deleteError.message}`);
  }

  if (payload.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from('faq_items').insert(payload);

  if (insertError) {
    throw new Error(`FAQ_ITEMS_SAVE_FAILED:${insertError.message}`);
  }
}
