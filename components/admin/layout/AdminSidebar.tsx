'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { adminContent } from '@/content/features/admin';

type AdminSidebarProps = {
  onClose: () => void;
};

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className='dashboard__sidebar js-dashboard-sidebar'>
      <div className='dashboard__sidebar_header'>
        <button onClick={onClose} type='button' className='text-white closeSidebar' aria-label='Close sidebar'>
          &times;
        </button>
        <Link href='/' className='text-white text-20 fw-500'>
          {adminContent.shell.brandLabel}
        </Link>
      </div>

      <div className='sidebar -dashboard'>
        {adminContent.shell.navItems.map((item) => (
          <div key={item.id} className={`sidebar__item ${pathname === item.href ? '-is-active' : ''}`}>
            {item.href === '/logout' ? (
              <form action='/logout' method='post' className='sidebar__logoutForm'>
                <button type='submit' className='sidebar__linkButton'>
                  <i className={item.iconClass}></i>
                  <span className='ml-10'>{item.label}</span>
                </button>
              </form>
            ) : (
              <Link href={item.href} className='sidebar__linkButton'>
                <i className={item.iconClass}></i>
                <span className='ml-10'>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
