import type { IncludedExcludedItem, TourContent } from '@/data/tourSingleContent';
import { defaultTourContent } from '@/data/tourSingleContent';

interface IncludedProps {
  tourContent?: TourContent;
}

export default function Included({ tourContent }: IncludedProps) {
  const includedItems = tourContent?.includedItems || defaultTourContent.includedItems;
  const excludedItems = tourContent?.excludedItems || defaultTourContent.excludedItems;

  return (
    <div className='x-gap-130 y-gap-20 pt-20 row'>
      <div className='col-lg-6'>
        <div className='y-gap-15'>
          {includedItems.map((elm: IncludedExcludedItem, i) => (
            <div key={i} className='d-flex'>
              <i className='flex-center bg-green-1 mr-15 rounded-full size-24 text-10 text-green-2 icon-check'></i>
              {elm.text}
            </div>
          ))}
        </div>
      </div>

      <div className='col-lg-6'>
        <div className='y-gap-15'>
          {excludedItems.map((elm: IncludedExcludedItem, i) => (
            <div key={i} className='d-flex'>
              <i className='flex-center bg-red-4 mr-15 rounded-full size-24 text-10 text-red-3 icon-cross'></i>
              {elm.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
