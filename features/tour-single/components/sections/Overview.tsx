import { tourSingleContent } from '@/content/features/tourSingle';

type OverviewProps = {
  description?: string | null;
};

export default function Overview({ description }: OverviewProps) {
  const overviewContent = tourSingleContent.overview;

  return (
    <>
      <h2 className='text-30'>{overviewContent.title}</h2>
      <p className='mt-20'>
        {description || overviewContent.fallbackDescription}
      </p>

      <h3 className='mt-20 text-20 fw-500'>{overviewContent.highlightsTitle}</h3>
      <ul className='mt-20 ulList'>
        {overviewContent.fallbackHighlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}
