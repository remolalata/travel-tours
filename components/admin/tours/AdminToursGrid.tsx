import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import AdminListingCard from '@/components/admin/shared/AdminListingCard';
import type { AdminTourData } from '@/services/admin/tours/mutations/tourApi';
import type { AdminListingContent } from '@/types/admin';

type AdminToursGridProps = {
  tours: AdminTourData[];
  actionLabels: AdminListingContent['actions'];
  pricePrefix: string;
  availabilityDateLabels: AdminListingContent['availabilityDateLabels'];
  isLoading: boolean;
  errorMessage: string | null;
  emptyMessage: string;
  onEditClick: (tour: AdminTourData) => void;
  onDeleteClick: (tour: AdminTourData) => void;
};

export default function AdminToursGrid({
  tours,
  actionLabels,
  pricePrefix,
  availabilityDateLabels,
  isLoading,
  errorMessage,
  emptyMessage,
  onEditClick,
  onDeleteClick,
}: AdminToursGridProps) {
  if (isLoading) {
    return (
      <div className='y-gap-30 row'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`tour-skeleton-${index}`} className='col-lg-6'>
            <div className='px-20 py-20 border rounded-12'>
              <div className='items-center x-gap-20 y-gap-20 row'>
                <div className='col-12 col-xl-auto'>
                  <Skeleton
                    variant='rounded'
                    animation='wave'
                    sx={{
                      borderRadius: '12px',
                      width: { xs: '100%', xl: 220 },
                      height: { xs: 180, sm: 200, xl: 150 },
                    }}
                  />
                </div>

                <div className='col'>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Skeleton variant='text' animation='wave' width='40%' height={24} />
                    <Skeleton variant='text' animation='wave' width='80%' height={32} />
                    <Skeleton variant='text' animation='wave' width='55%' height={24} />

                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Skeleton variant='text' animation='wave' width={100} height={24} />
                      <Box
                        sx={{
                          minWidth: 120,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                        }}
                      >
                        <Skeleton variant='text' animation='wave' width={70} height={22} />
                        <Skeleton variant='text' animation='wave' width={110} height={28} />
                      </Box>
                    </Box>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return <div className='py-20 text-14 text-red-1 text-center'>{errorMessage}</div>;
  }

  if (tours.length === 0) {
    return <div className='py-20 text-14 text-center'>{emptyMessage}</div>;
  }

  return (
    <div className='y-gap-30 row'>
      {tours.map((item) => (
        <div key={item.id} className='col-lg-6'>
          <AdminListingCard
            item={item}
            actionLabels={actionLabels}
            pricePrefix={pricePrefix}
            availabilityDateLabels={availabilityDateLabels}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        </div>
      ))}
    </div>
  );
}
