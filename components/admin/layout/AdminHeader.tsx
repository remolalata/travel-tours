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
  const firstName = profileQuery.data?.firstName?.trim() || null;

  return (
    <div className='dashboard__content_header'>
      <div className='d-flex items-center'>
        <div className='mr-60'>
          <button onClick={onToggleSidebar} className='d-flex js-toggle-db-sidebar' type='button'>
            <i className='text-20 icon-main-menu'></i>
          </button>
        </div>

        <div className='d-flex items-center px-20 py-5 border rounded-200 dashboard__content_header_search md:d-none'>
          <i className='mr-10 text-18 icon-search'></i>
          <input type='text' placeholder={adminContent.shell.searchPlaceholder} />
        </div>
      </div>

      <div className='d-flex items-center x-gap-20'>
        {adminContent.shell.topActions.map((action) => (
          <div key={action.id}>
            {action.imageSrc ? (
              <div className='d-flex items-center'>
                {firstName ? <span className='mr-10 text-14 fw-500'>{firstName}</span> : null}
                {avatarUrl ? (
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
                    className='flex-center border rounded-circle size-40 text-dark-1'
                    aria-label={action.label}
                    title={action.label}
                    style={{ borderRadius: '50%' }}
                  >
                    <i className='text-18 icon-person' />
                  </div>
                )}
              </div>
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
