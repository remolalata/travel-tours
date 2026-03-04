import HomePage from '@/features/home/HomePage';
import { fetchFaqItems } from '@/services/faqs/mutations/faqApi';
import type { FaqItem } from '@/types/tourContent';
import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: 'Travel & Tours',
  description: 'Achieving your dream destination with hassle-free service of Travel & Tours!',
};

export default async function Page() {
  let faqItems: FaqItem[] = [];

  try {
    const supabase = await createClient();
    faqItems = await fetchFaqItems(supabase, { isActive: true, limit: 4 });
  } catch {
    faqItems = [];
  }

  return <HomePage faqItems={faqItems} />;
}
