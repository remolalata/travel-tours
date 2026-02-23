import type { SupabaseClient } from '@supabase/supabase-js';

import type { FaqRow } from '@/api/faqs/helpers/faqMapper';
import { mapFaqRows } from '@/api/faqs/helpers/faqMapper';
import type { FaqItem } from '@/types/tourContent';

export type FetchFaqItemsInput = {
  isActive?: boolean;
  limit?: number;
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
