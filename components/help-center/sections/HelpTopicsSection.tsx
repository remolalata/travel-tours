import Image from 'next/image';

import { helpCenterPageContent } from '@/content/features/help-center';

export default function HelpTopicsSection() {
  const { topics } = helpCenterPageContent;

  return (
    <section className='layout-pt-md'>
      <div className='container'>
        <div className='row y-gap-20'>
          <div className='col-12'>
            <h2 className='text-30 md:text-24'>{topics.title}</h2>
          </div>
        </div>

        <div className='row y-gap-30 pt-30'>
          {topics.items.map((topic) => (
            <div key={topic.id} className='col-lg-4 col-md-6'>
              <div className='px-50 py-45 border-1 rounded-12'>
                <Image width={60} height={60} src={topic.iconSrc} alt={topic.title} className='mb-20' />

                <h3 className='text-18 fw-500'>{topic.title}</h3>

                <div className='mt-10'>{topic.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
