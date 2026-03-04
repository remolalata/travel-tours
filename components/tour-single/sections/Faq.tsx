import AppFaqAccordion from '@/components/common/accordion/AppFaqAccordion';
import type { FaqItem, TourContent } from '@/data/tourSingleContent';

interface FaqProps {
  tourContent?: TourContent;
  items?: FaqItem[];
}

export default function Faq({ tourContent, items }: FaqProps) {
  const faqItems = items ?? tourContent?.faqItems ?? [];
  return <AppFaqAccordion items={faqItems} />;
}
