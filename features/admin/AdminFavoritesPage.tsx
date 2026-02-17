'use client';

import AdminShell from '@/components/admin/layout/AdminShell';
import AdminListingCard from '@/components/admin/shared/AdminListingCard';
import Pagination from '@/components/common/Pagination';
import { adminContent } from '@/content/features/admin';

export default function AdminFavoritesPage() {
  const content = adminContent.pages.favorites;

  return (
    <AdminShell title={content.intro.title} description={content.intro.description}>
      <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-60'>
        <div className='row y-gap-30'>
          {content.cards.map((item) => (
            <div key={item.id} className='col-xl-4 col-lg-4 col-md-6'>
              <AdminListingCard item={item} compact pricePrefix={content.pricePrefix} />
            </div>
          ))}
        </div>

        <div className='mt-30'>
          <Pagination />
          <div className='text-14 text-center mt-20'>{content.resultSummary}</div>
        </div>
      </div>
    </AdminShell>
  );
}
