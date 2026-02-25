'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import useAuthViewerQuery from '@/services/auth/hooks/useAuthViewerQuery';
import type { AuthViewerState } from '@/services/auth/mutations/authApi';
import HeaderAccountMenu from '@/components/layout/header/HeaderAccountMenu';
import HeaderSerch from '@/components/layout/shared/HeaderSerch';
import { headerAccountContent } from '@/content/shared/layoutHeaderAccount';

type SiteHeaderClientProps = {
  initialAuthState: AuthViewerState;
};

export default function SiteHeaderClient({ initialAuthState }: SiteHeaderClientProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [addClass, setAddClass] = useState(false);

  const authQuery = useAuthViewerQuery({ initialData: initialAuthState });
  const authState = authQuery.data;

  // Add a class to the element when scrolled 50px
  const handleScroll = () => {
    if (window.scrollY >= 50) {
      setAddClass(true);
    } else {
      setAddClass(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setMobileSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <header className={`header -type-1 js-header ${addClass ? '-is-sticky' : ''}`}>
        <div className='header__container container'>
          <div className='header__logo'>
            <Link href='/' className='header__logo'>
              <Image width='167' height='32' src='/img/logo.svg' alt='logo icon' priority />
            </Link>

            <div className='xl:d-none ml-30'>
              <HeaderSerch />
            </div>
          </div>

          <div className='headerMobile__right'>
            <button
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              className='d-flex'
              aria-label={headerAccountContent.aria.toggleSearch}
              aria-expanded={mobileSearchOpen}
            >
              <i className='icon-search text-18'></i>
            </button>
          </div>

          <div className='header__right'>
            <HeaderAccountMenu authState={authState} />
          </div>
        </div>

        <div className={`headerMobileSearch ${mobileSearchOpen ? 'is-active' : ''}`}>
          <HeaderSerch />
        </div>
      </header>
    </>
  );
}
