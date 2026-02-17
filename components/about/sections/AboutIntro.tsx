import Link from 'next/link';

import { aboutContent } from '@/content/features/about';

export default function AboutIntro() {
  const { intro } = aboutContent;

  return (
    <section className='layout-pt-lg'>
      <div className='container'>
        <div className='row y-gap-20 justify-between'>
          <div className='col-lg-6'>
            <h2 className='text-30 fw-700'>{intro.heading}</h2>
          </div>

          <div className='col-lg-5'>
            {intro.paragraphs.map((paragraph, index) => (
              <p key={index} className={index > 0 ? 'mt-20' : ''}>
                {paragraph}
              </p>
            ))}

            <Link href={intro.ctaHref} className='button -md -dark-1 bg-accent-1 text-white mt-30'>
              {intro.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
