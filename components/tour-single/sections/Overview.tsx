import { tourSingleContent } from '@/content/features/tourSingle';

type OverviewProps = {
  description?: string | null;
};

function removeUnsafeTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
}

export default function Overview({ description }: OverviewProps) {
  const overviewContent = tourSingleContent.overview;
  const resolvedDescription = (description || '').trim();
  const hasDescription = resolvedDescription.length > 0;

  return (
    <>
      <h2 className='text-30'>{overviewContent.title}</h2>
      {hasDescription ? (
        <div
          className='mt-20'
          dangerouslySetInnerHTML={{ __html: removeUnsafeTags(resolvedDescription) }}
        />
      ) : (
        <p className='mt-20'>{overviewContent.fallbackDescription}</p>
      )}
    </>
  );
}
