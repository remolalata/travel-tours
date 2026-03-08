import { helpCenterPageContent } from '@/content/features/help-center';
import HelpCenterPage from '@/features/help-center/HelpCenterPage';
import { fetchFaqItems } from '@/services/faqs/mutations/faqApi';
import type { FaqItem } from '@/types/tourContent';
import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: helpCenterPageContent.metadata.title,
  description: helpCenterPageContent.metadata.description,
};

export default async function Page() {
  let faqItems: FaqItem[] = [];

  try {
    const supabase = await createClient();
    faqItems = await fetchFaqItems(supabase, { isActive: true });
  } catch {
    faqItems = [];
  }

  return <HelpCenterPage faqItems={faqItems} />;
}
