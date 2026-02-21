import type { AdminTourData } from '@/api/admin/tours/mutations/tourApi';
import AdminListingCard from '@/components/admin/shared/AdminListingCard';

type AdminToursGridProps = {
  tours: AdminTourData[];
  pricePrefix: string;
  isLoading: boolean;
  loadingMessage: string;
  errorMessage: string | null;
  emptyMessage: string;
};

export default function AdminToursGrid({
  tours,
  pricePrefix,
  isLoading,
  loadingMessage,
  errorMessage,
  emptyMessage,
}: AdminToursGridProps) {
  if (isLoading) {
    return <div className='text-14 text-center py-20'>{loadingMessage}</div>;
  }

  if (errorMessage) {
    return <div className='text-14 text-center text-red-1 py-20'>{errorMessage}</div>;
  }

  if (tours.length === 0) {
    return <div className='text-14 text-center py-20'>{emptyMessage}</div>;
  }

  return (
    <div className='row y-gap-30'>
      {tours.map((item) => (
        <div key={item.id} className='col-lg-6'>
          <AdminListingCard item={item} pricePrefix={pricePrefix} />
        </div>
      ))}
    </div>
  );
}
