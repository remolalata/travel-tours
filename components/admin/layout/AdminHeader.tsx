'use client';

import Image from 'next/image';

import useAdminProfileQuery from '@/api/admin/profile/hooks/useAdminProfileQuery';
import { adminContent } from '@/content/features/admin';

type AdminHeaderProps = {
  onToggleSidebar: () => void;
};

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const profileQuery = useAdminProfileQuery();
  const avatarUrl = profileQuery.data?.avatarUrl ?? null;

  return (
    <div className='dashboard__content_header'>
      <div className='d-flex items-center'>
        <div className='mr-60'>
          <button onClick={onToggleSidebar} className='d-flex js-toggle-db-sidebar' type='button'>
            <i className='icon-main-menu text-20'></i>
          </button>
        </div>

        <div className='dashboard__content_header_search d-flex items-center py-5 px-20 rounded-200 border-1 md:d-none'>
          <i className='icon-search text-18 mr-10'></i>
          <input type='text' placeholder={adminContent.shell.searchPlaceholder} />
        </div>
      </div>

      <div className='d-flex items-center x-gap-20'>
        {adminContent.shell.topActions.map((action) => (
          <div key={action.id}>
            {action.imageSrc ? (
              avatarUrl ? (
                <Image
                  width={42}
                  height={42}
                  src={avatarUrl}
                  alt={action.label}
                  className='rounded-circle object-cover'
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <div
                  className='size-40 rounded-circle border-1 flex-center text-dark-1'
                  aria-label={action.label}
                  title={action.label}
                  style={{ borderRadius: '50%' }}
                >
                  <i className='icon-person text-18' />
                </div>
              )
            ) : (
              <button type='button' aria-label={action.label}>
                <i className={action.iconClass}></i>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
