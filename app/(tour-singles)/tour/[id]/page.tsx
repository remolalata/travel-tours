import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';

import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';
import PageHeader from '@/features/tour-single/components/sections/PageHeader';
import TourDetailsContent from '@/features/tour-single/components/sections/TourDetailsContent';
import TourSlider from '@/features/tour-single/components/sections/TourSlider';
import { fetchFaqItems } from '@/services/faqs/mutations/faqApi';
import { fetchReviews } from '@/services/reviews/mutations/reviewApi';
import { fetchTourSinglePageData } from '@/services/tours/mutations/tourSingleApi';
import type { Review } from '@/types/review';
import type { FaqItem } from '@/types/tourContent';
import { createClient } from '@/utils/supabase/server';

interface TourPageProps {
  params: Promise<{ id: string }>;
}

const getSingleTourPageData = cache(async (routeValue: string) => {
  const supabase = await createClient();
  return fetchTourSinglePageData(supabase, { routeValue });
});

function buildTourMetaDescription(description?: string | null): string {
  const fallbackDescription =
    'Discover curated tour packages, guided activities, and hassle-free travel planning with Travel & Tours.';
  const rawValue = (description || fallbackDescription)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (rawValue.length <= 160) {
    return rawValue;
  }

  return `${rawValue.slice(0, 157).trimEnd()}...`;
}

function getCanonicalTourPath(slug: string): string {
  return `/tour/${slug}`;
}

function isNumericRouteValue(value: string): boolean {
  return /^\d+$/.test(value);
}

export async function generateMetadata(props: TourPageProps): Promise<Metadata> {
  const params = await props.params;
  const routeValue = params.id;
  const singlePageData = await getSingleTourPageData(routeValue);

  if (!singlePageData) {
    return {
      title: 'Tour Not Found | Travel & Tours',
      description: 'The requested tour could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${singlePageData.tour.title} | Travel & Tours`;
  const description = buildTourMetaDescription(
    singlePageData.overviewDescription || singlePageData.tour.description,
  );
  const canonicalPath = getCanonicalTourPath(singlePageData.routeContext.slug);
  const primaryImage = singlePageData.galleryImageUrls[0] || singlePageData.tour.imageSrc;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: 'website',
      images: primaryImage
        ? [
            {
              url: primaryImage,
              alt: singlePageData.tour.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: primaryImage ? [primaryImage] : undefined,
    },
  };
}

export default async function Page(props: TourPageProps) {
  const params = await props.params;
  const routeValue = params.id;
  const singlePageData = await getSingleTourPageData(routeValue);

  if (!singlePageData) {
    notFound();
  }

  if (routeValue !== singlePageData.routeContext.slug && isNumericRouteValue(routeValue)) {
    permanentRedirect(getCanonicalTourPath(singlePageData.routeContext.slug));
  }

  const { tour, tourContent, galleryImageUrls, overviewDescription, routeContext } = singlePageData;
  let reviews: Review[] = [];
  let faqItems: FaqItem[] = [];

  try {
    const supabase = await createClient();
    reviews = await fetchReviews(supabase, {
      destinationId: routeContext.destinationId,
      isPublished: true,
      limit: 3,
    });
    faqItems = await fetchFaqItems(supabase, {
      isActive: true,
      limit: 4,
    });
  } catch {
    reviews = [];
    faqItems = [];
  }

  return (
    <>
      <main>
        <SiteHeader />
        <PageHeader
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Tours', href: '/tours' },
            { label: tour.title },
          ]}
        />

        <TourDetailsContent
          tour={tour}
          tourContent={tourContent}
          destinationId={routeContext.destinationId}
          reviews={reviews}
          galleryImageUrls={galleryImageUrls}
          overviewDescription={overviewDescription}
          faqItems={faqItems}
        />
        <TourSlider destinationId={routeContext.destinationId} currentTourId={routeContext.id} />
        <SiteFooter />
      </main>
    </>
  );
}
