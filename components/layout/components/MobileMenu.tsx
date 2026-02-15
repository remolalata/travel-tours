'use client';

import { menuData } from '@/data/mobileMenu';
import type { MobileMenuItem } from '@/data/mobileMenu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
const socialMediaLinks = [
  { id: 1, class: 'icon-facebook', href: '#' },
  { id: 2, class: 'icon-twitter', href: '#' },
  { id: 3, class: 'icon-instagram', href: '#' },
  { id: 4, class: 'icon-linkedin', href: '#' },
];
interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileMenu({ mobileMenuOpen, setMobileMenuOpen }: MobileMenuProps) {
  const [activeSub, setActiveSub] = useState<string>('');
  const pathname = usePathname();
  return (
    <div
      data-aos='fade'
      data-aos-delay=''
      className={`menu js-menu ${mobileMenuOpen ? '-is-active' : ''} `}
      style={
        mobileMenuOpen
          ? { opacity: '1', visibility: 'visible' }
          : { pointerEvents: 'none', visibility: 'hidden' }
      }
    >
      <div onClick={() => setMobileMenuOpen(false)} className='menu__overlay js-menu-button'></div>

      <div className='menu__container'>
        <div className='menu__header'>
          <h4>Main Menu</h4>

          <button onClick={() => setMobileMenuOpen(false)} className='js-menu-button'>
            <i className='icon-cross text-10'></i>
          </button>
        </div>

        <div className='menu__content'>
          <ul
            className='menuNav js-navList -is-active'
            style={{
              maxHeight: 'calc(var(--app-vh, 100vh) - 262px - env(safe-area-inset-bottom, 0px))',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {menuData.map((menuItem: MobileMenuItem) => (
              <li key={menuItem.id} className='menuNav__item -has-submenu js-has-submenu'>
                <a
                  onClick={() =>
                    setActiveSub((previousValue) =>
                      previousValue === menuItem.label ? '' : menuItem.label,
                    )
                  }
                >
                  <span
                    className={
                      menuItem.submenu.some(
                        (submenuItem) => submenuItem.href.split('/')[1] === pathname?.split('/')[1],
                      )
                        ? 'activeMenu'
                        : ''
                    }
                  >
                    {menuItem.label}
                  </span>
                  <i
                    style={
                      activeSub === menuItem.label
                        ? { transform: 'rotate(90deg)', transition: '0.3s' }
                        : { transform: 'rotate(0deg)', transition: '0.3s' }
                    }
                    className='icon-chevron-right'
                  ></i>
                </a>

                <ul
                  style={
                    activeSub === menuItem.label
                      ? { maxHeight: '1200px', transition: '0.6s' }
                      : { maxHeight: '0px', transition: '0.6s' }
                  }
                >
                  {menuItem.submenu.map((submenuItem) => (
                    <li key={submenuItem.id} className=''>
                      <Link
                        className={
                          pathname.split('/')[1] === submenuItem.href?.split('/')[1]
                            ? 'activeMenu'
                            : ''
                        }
                        style={{ paddingLeft: '15px', fontSize: '17px' }}
                        href={submenuItem.href}
                      >
                        {submenuItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            <li className='menuNav__item'>
              <Link href='/contact'>Contact</Link>
            </li>
          </ul>
        </div>

        <div className='menu__footer'>
          <i className='icon-headphone text-50'></i>

          <div className='text-20 lh-12 fw-500 mt-20'>
            <div>Speak to our expert at</div>
            <div className='text-accent-1'>1-800-453-6744</div>
          </div>

          <div className='d-flex items-center x-gap-10 pt-30'>
            {socialMediaLinks.map((elm, i) => (
              <div key={i}>
                <a href={elm.href} className='d-block'>
                  <i className={elm.class}></i>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
