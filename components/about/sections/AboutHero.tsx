import Image from 'next/image';

import { aboutContent } from '@/content/features/about';

export default function AboutHero() {
  const { hero } = aboutContent;

  return (
    <section
      className='pageHeader -type-1 d-flex items-center'
      style={{
        minHeight: 'clamp(280px, 42vw, 500px)',
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <div className='pageHeader__bg'>
        <Image
          width={1800}
          height={500}
          src={hero.backgroundImageSrc}
          alt={hero.backgroundImageAlt}
        />
        <Image
          width={1800}
          height={40}
          style={{ height: 'auto' }}
          src={hero.shapeImageSrc}
          alt={hero.shapeImageAlt}
        />
      </div>

      <div className='container w-100'>
        <div className='row justify-center items-center'>
          <div className='col-12'>
            <div className='pageHeader__content'>
              <h1 className='pageHeader__title'>{hero.title}</h1>
              {hero.description ? <p className='pageHeader__text'>{hero.description}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
