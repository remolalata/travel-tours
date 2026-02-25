import Image from 'next/image';
import Link from 'next/link';

import { aboutContent } from '@/content/features/about';

export default function AboutBanner() {
  const { banner } = aboutContent;

  return (
    <section className='layout-pt-xl'>
      <div className='video relative container'>
        <div className='video__bg'>
          <Image
            width={1290}
            height={550}
            src={banner.imageSrc}
            alt={banner.imageAlt}
            className='rounded-12'
          />
        </div>

        <div className='row justify-center pb-50 md:pb-0'>
          <div className='col-auto'>
            <Link
              href={banner.videoHref}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={banner.playAriaLabel}
              className='d-block'
            >
              <span className='size-60 rounded-full border-2 border-white flex-center'>
                <i className='icon-play text-white text-20 ml-5'></i>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
