'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { mobileMenuData } from '@/data/mobileMenu';

type MobileMenuProps = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

const socialMediaLinks = [
  { id: 1, className: 'icon-facebook', href: '#' },
  { id: 2, className: 'icon-twitter', href: '#' },
  { id: 3, className: 'icon-instagram', href: '#' },
  { id: 4, className: 'icon-linkedin', href: '#' },
];

export default function MobileMenu({ mobileMenuOpen, setMobileMenuOpen }: MobileMenuProps) {
  const [activeSub, setActiveSub] = useState<string>('');
  const pathname = usePathname();
  const pathnameSegment = pathname.split('/')[1] ?? '';

  return (
    <div
      className={`menu js-menu ${mobileMenuOpen ? '-is-active' : ''}`}
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
          <ul className='menuNav js-navList -is-active' style={{ maxHeight: 'calc(100vh - 262px)', overflowY: 'auto' }}>
            {mobileMenuData.map((menuSection) => (
              <li key={menuSection.id} className='menuNav__item -has-submenu js-has-submenu'>
                <a
                  href='#'
                  onClick={(event) => {
                    event.preventDefault();
                    setActiveSub((previousValue) =>
                      previousValue === menuSection.label ? '' : menuSection.label,
                    );
                  }}
                >
                  <span
                    className={
                      menuSection.submenu.some((item) => item.href.split('/')[1] === pathnameSegment)
                        ? 'activeMenu'
                        : ''
                    }
                  >
                    {menuSection.label}
                  </span>
                  <i
                    style={
                      activeSub === menuSection.label
                        ? { transform: 'rotate(90deg)', transition: '0.3s' }
                        : { transform: 'rotate(0deg)', transition: '0.3s' }
                    }
                    className='icon-chevron-right'
                  ></i>
                </a>

                <ul
                  style={
                    activeSub === menuSection.label
                      ? { maxHeight: '1200px', transition: '0.6s' }
                      : { maxHeight: '0px', transition: '0.6s' }
                  }
                >
                  {menuSection.submenu.map((item) => (
                    <li key={item.id}>
                      <Link
                        className={pathnameSegment === item.href.split('/')[1] ? 'activeMenu' : ''}
                        style={{ paddingLeft: '15px', fontSize: '17px' }}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            <li className='menuNav__item'>
              <Link href='/contact' onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
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
            {socialMediaLinks.map((social) => (
              <div key={social.id}>
                <a href={social.href} className='d-block'>
                  <i className={social.className}></i>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
