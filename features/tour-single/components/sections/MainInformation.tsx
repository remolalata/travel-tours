import Stars from '@/components/common/Stars';
import { tourSingleContent } from '@/content/features/tourSingle';
import FacebookShareAction from '@/features/tour-single/components/sections/FacebookShareAction';
import type { Tour } from '@/types/tour';

interface MainInformationProps {
  tour?: Tour;
}

function getTitleLines(title?: string): { firstLine: string; secondLine: string } {
  const titleParts = title?.split(' ') ?? [];

  return {
    firstLine: titleParts.slice(0, 7).join(' '),
    secondLine: titleParts.slice(7).join(' '),
  };
}

export default function MainInformation({ tour }: MainInformationProps) {
  const content = tourSingleContent.mainInformation;
  const titleLines = getTitleLines(tour?.title);

  return (
    <>
      <div className='justify-between items-end y-gap-20 row'>
        <div className='col-auto'>
          <div className='items-center x-gap-10 y-gap-10 row'>
            <div className='col-auto'>
              <button className='px-15 py-5 rounded-200 text-14 -accent-1 bg-accent-1-05 text-accent-1 button'>
                {content.badges.bestsellerLabel}
              </button>
            </div>
            <div className='col-auto'>
              <button className='bg-light-1 px-15 py-5 rounded-200 text-14 -accent-1 button'>
                {content.badges.freeCancellationLabel}
              </button>
            </div>
          </div>

          <h2 className='mt-20 text-40 sm:text-30 lh-14'>
            {titleLines.firstLine}

            <br />
            {titleLines.secondLine}
          </h2>

          <div className='items-center x-gap-20 y-gap-20 pt-20 row'>
            <div className='col-auto'>
              <div className='d-flex items-center'>
                <div className='d-flex x-gap-5 pr-10'>
                  <Stars star={tour?.rating} font={12} />
                </div>
                {tour?.rating} ({tour?.ratingCount})
              </div>
            </div>

            <div className='col-auto'>
              <div className='d-flex items-center'>
                <i className='mr-5 text-16 icon-pin'></i>
                {tour?.location}
              </div>
            </div>

            <div className='col-auto'>
              <div className='d-flex items-center'>
                <i className='mr-5 text-16 icon-reservation'></i>
                {content.stats.bookedLabel}
              </div>
            </div>
          </div>
        </div>

        <div className='col-auto'>
          <div className='d-flex x-gap-30 y-gap-10'>
            <FacebookShareAction
              label={content.actions.share.label}
              ariaLabelPrefix={content.actions.share.ariaLabelPrefix}
              tourTitle={tour?.title}
            />

            <a href={content.actions.wishlist.href} className='d-flex items-center'>
              <i className='flex-center mr-10 text-16 icon-heart'></i>
              {content.actions.wishlist.label}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
