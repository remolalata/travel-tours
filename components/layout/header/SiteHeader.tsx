'use client';

import { useEffect, useState } from 'react';
import HeaderSerch from '../components/HeaderSerch';
import Destinations from '../components/Destinations';
import Activities from '../components/Activities';
import MobileMenu from '../components/MobileMenu';
import Image from 'next/image';
import Link from 'next/link';
export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [addClass, setAddClass] = useState(false);

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
          <div className='headerMobile__left'></div>

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
              aria-label='Toggle search'
              aria-expanded={mobileSearchOpen}
            >
              <i className='icon-search text-18'></i>
            </button>
          </div>

          <div className='header__right'>
            <Destinations />
            <Activities />
          </div>
        </div>

        <div className={`headerMobileSearch ${mobileSearchOpen ? 'is-active' : ''}`}>
          <HeaderSerch />
        </div>
      </header>
      <MobileMenu setMobileMenuOpen={setMobileMenuOpen} mobileMenuOpen={mobileMenuOpen} />
    </>
  );
}
