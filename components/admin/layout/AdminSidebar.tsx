'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { adminContent } from '@/content/features/admin';

type AdminSidebarProps = {
  onClose: () => void;
};

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openMenuIds, setOpenMenuIds] = useState<number[]>([]);

  const toggleMenu = (menuId: number) => {
    setOpenMenuIds((previousValue) =>
      previousValue.includes(menuId)
        ? previousValue.filter((id) => id !== menuId)
        : [...previousValue, menuId],
    );
  };

  const renderNavIcon = (iconClass?: string) => (iconClass ? <i className={iconClass}></i> : null);

  return (
    <div className='dashboard__sidebar js-dashboard-sidebar'>
      <div className='dashboard__sidebar_header'>
        <button
          onClick={onClose}
          type='button'
          className='text-white closeSidebar'
          aria-label='Close sidebar'
        >
          &times;
        </button>
        <Link href='/' className='text-20 text-white fw-500'>
          {/* eslint-disable @next/next/no-img-element */}
          <img
            width={167}
            height={32}
            src='/img/logo.svg'
            alt={adminContent.shell.brandLabel}
            style={{ height: 'auto' }}
          />
        </Link>
      </div>

      <div className='sidebar -dashboard'>
        {adminContent.shell.navItems.map((item) => {
          if (item.href === '/logout') {
            return null;
          }

          const hasActiveChild = (item.children ?? []).some(
            (child) => child.href && pathname === child.href,
          );
          const isParentActive = Boolean(item.href && pathname === item.href);
          const isMenuOpen = openMenuIds.includes(item.id) || hasActiveChild;

          return (
            <div key={item.id} className={`sidebar__item ${isParentActive ? '-is-active' : ''}`}>
              {item.children ? (
                <>
                  <button
                    type='button'
                    className='sidebar__linkButton'
                    onClick={() => toggleMenu(item.id)}
                    aria-expanded={isMenuOpen}
                    aria-controls={`admin-sidebar-submenu-${item.id}`}
                    style={{ width: '100%' }}
                  >
                    {renderNavIcon(item.iconClass)}
                    <span className='ml-10'>{item.label}</span>
                    <i
                      className='icon-chevron-right text-12'
                      style={{
                        marginLeft: 'auto',
                        transition: 'transform 0.2s ease',
                        transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    ></i>
                  </button>

                  <div
                    id={`admin-sidebar-submenu-${item.id}`}
                    style={{
                      maxHeight: isMenuOpen ? '200px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.2s ease',
                    }}
                  >
                    <div className='pt-5 pr-15 pb-10 pl-40'>
                      {(item.children ?? []).map((child) => {
                        const isChildActive = Boolean(child.href && pathname === child.href);

                        return (
                          <div
                            key={child.id}
                            className={`sidebar__item ${isChildActive ? '-is-active' : ''}`}
                          >
                            <Link
                              href={child.href ?? '#'}
                              className='sidebar__linkButton'
                              style={{ minHeight: 40, fontSize: 14 }}
                            >
                              {child.iconClass ? <i className={child.iconClass}></i> : null}
                              <span className={child.iconClass ? 'ml-10' : ''}>{child.label}</span>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : item.href === '/logout' ? (
                <form action='/logout' method='post' className='sidebar__logoutForm'>
                  <button type='submit' className='sidebar__linkButton'>
                    {renderNavIcon(item.iconClass)}
                    <span className='ml-10'>{item.label}</span>
                  </button>
                </form>
              ) : (
                <Link href={item.href ?? '#'} className='sidebar__linkButton'>
                  {renderNavIcon(item.iconClass)}
                  <span className='ml-10'>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
