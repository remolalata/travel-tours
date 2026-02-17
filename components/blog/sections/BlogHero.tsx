import Image from 'next/image';

import { blogContent } from '@/content/features/blog';
import type { BlogPost } from '@/types/blog';

type BlogHeroProps = {
  post?: BlogPost;
};

export default function BlogHero({ post }: BlogHeroProps) {
  const hero = blogContent.hero;

  return (
    <section className='hero -type-1 -min-2'>
      <div className='hero__bg'>
        <Image width={1800} height={500} src={hero.backgroundImageSrc} alt='Blog hero background' />
        <Image
          style={{ height: 'auto' }}
          width={1800}
          height={40}
          src={hero.shapeImageSrc}
          alt='Blog hero shape'
        />
      </div>

      <div className='container'>
        <div className='row justify-center'>
          <div className='col-xl-12'>
            <div className='hero__content'>
              <h1 className='hero__title'>{post?.title ?? hero.defaultTitle}</h1>
              <p className='hero__text'>{post?.excerpt ?? hero.defaultDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
