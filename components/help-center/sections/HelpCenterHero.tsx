import Image from 'next/image';

import { helpCenterPageContent } from '@/content/features/help-center';

export default function HelpCenterHero() {
  const { hero } = helpCenterPageContent;

  return (
    <section className='pageHeader -type-2'>
      <div className='pageHeader__bg'>
        <Image width={1800} height={350} src={hero.backgroundImageSrc} alt='Help center header background' />
        <Image
          width={1800}
          height={40}
          style={{ height: 'auto' }}
          src={hero.shapeImageSrc}
          alt='Help center header shape'
        />
      </div>

      <div className='container'>
        <div className='row justify-center'>
          <div className='col-12'>
            <div className='pageHeader__content'>
              <h1 className='pageHeader__title'>{hero.title}</h1>

              <p className='pageHeader__text'>{hero.description}</p>

              <div className='pageHeader__search'>
                <input type='text' placeholder={hero.searchPlaceholder} />
                <button type='button'>
                  <i className='icon-search text-15 text-white'></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
