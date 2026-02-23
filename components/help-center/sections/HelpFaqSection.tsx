import AppFaqAccordion from '@/components/common/accordion/AppFaqAccordion';
import { helpCenterPageContent } from '@/content/features/help-center';
import type { FaqItem } from '@/types/tourContent';

interface HelpFaqSectionProps {
  items: FaqItem[];
}

export default function HelpFaqSection({ items }: HelpFaqSectionProps) {
  const { faq } = helpCenterPageContent;

  return (
    <section className='layout-pt-xl layout-pb-xl'>
      <div className='container'>
        <div className='row justify-center text-center'>
          <div className='col-auto'>
            <h2 className='text-30 md:text-24'>{faq.title}</h2>
          </div>
        </div>

        <div className='row justify-center pt-40'>
          <div className='col-xl-8 col-lg-10'>
            <div className='accordion -simple row y-gap-20 js-accordion'>
              <AppFaqAccordion items={items} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
