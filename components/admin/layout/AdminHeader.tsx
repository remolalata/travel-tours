'use client';

import Image from 'next/image';

import { adminContent } from '@/content/features/admin';

type AdminHeaderProps = {
  onToggleSidebar: () => void;
};

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
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
              <Image width={50} height={50} src={action.imageSrc} alt={action.label} />
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
