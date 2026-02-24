import Image from 'next/image';

import { aboutContent } from '@/content/features/about';

export default function AboutHero() {
  const { hero } = aboutContent;

  return (
    <section className='pageHeader -type-1'>
      <div className='pageHeader__bg'>
        <Image
          width={1800}
          height={500}
          src={hero.backgroundImageSrc}
          alt='About page header background'
        />
        <Image
          width={1800}
          height={40}
          style={{ height: 'auto' }}
          src={hero.shapeImageSrc}
          alt='About page header shape'
        />
      </div>

      <div className='container'>
        <div className='row justify-center'>
          <div className='col-12'>
            <div className='pageHeader__content'>
              <h1 className='pageHeader__title'>{hero.title}</h1>
              <p className='pageHeader__text'>{hero.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
