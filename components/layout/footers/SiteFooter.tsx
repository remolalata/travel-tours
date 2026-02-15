import React, { useId } from 'react';
import FooterLinks from '@/components/layout/components/FooterLinks';
import Socials from '@/components/layout/components/Socials';
import Image from 'next/image';

export default function SiteFooter() {
  const footerNewsletterEmailId = useId();

  return (
    <footer className='footer -type-1'>
      <div className='footer__main'>
        <div className='footer__bg'>
          <Image width='1800' height='627' src='/img/footer/1/bg.svg' alt='image' />
        </div>

        <div className='container'>
          <div className='footer__info'>
            <div className='justify-between y-gap-20 row'>
              <div className='col-auto'>
                <div className='items-center y-gap-20 row'>
                  <div className='col-auto'>
                    <i className='text-50 icon-headphone'></i>
                  </div>

                  <div className='col-auto'>
                    <div className='text-20 fw-500'>
                      Speak to our expert at &nbsp;
                      <span className='text-accent-1'>+63 970 551 7169</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-auto'>
                <div className='footerSocials'>
                  <div className='footerSocials__title'>Follow Us</div>

                  <div className='footerSocials__icons'>
                    <Socials />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='footer__content'>
            <div className='justify-between y-gap-40 row'>
              <div className='col-lg-4 col-md-6'>
                <h3 className='text-20 fw-500'>Contact</h3>

                <div className='y-gap-10 mt-20'>
                  <a className='d-block' href='#'>
                    Pangasinan, Manaoag, Philippines, 2430
                  </a>
                  <a className='d-flex items-center' href='tel:+639705517169'>
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      style={{ marginRight: '8px' }}
                    >
                      <path d='M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' />
                    </svg>
                    +63 970 551 7169
                  </a>
                  <a
                    className='d-flex items-center'
                    href='https://wa.me/639705517169'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='WhatsApp'
                  >
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      style={{ marginRight: '8px' }}
                    >
                      <path d='M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.94L0 24l6.35-1.67a11.83 11.83 0 0 0 5.7 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.44-8.4zM12.06 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.77.99 1-3.67-.24-.38a9.86 9.86 0 0 1-1.52-5.28c0-5.44 4.43-9.87 9.88-9.87a9.8 9.8 0 0 1 6.99 2.9 9.8 9.8 0 0 1 2.88 6.98c0 5.45-4.43 9.88-9.87 9.88zm5.42-7.39c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.25-.46-2.39-1.46-.88-.79-1.47-1.76-1.64-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.24-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.18-1.44-.08-.12-.28-.2-.58-.35z' />
                    </svg>
                    WhatsApp: +63 970 551 7169
                  </a>
                  <a
                    className='d-flex items-center'
                    href='viber://chat?number=%2B639705517169'
                    aria-label='Viber'
                  >
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      style={{ marginRight: '8px' }}
                    >
                      <path d='M12.02 2C6.68 2 2.36 5.9 2.36 10.74c0 2.75 1.4 5.2 3.58 6.8l-.73 3.65 3.88-.94c.93.24 1.92.37 2.93.37 5.34 0 9.66-3.9 9.66-8.74C21.68 5.9 17.36 2 12.02 2zm5.52 11.64c-.2.56-1.1 1.03-1.49 1.08-.39.06-.86.09-2.78-.67-2.3-.91-3.78-3.14-3.89-3.29-.11-.15-.93-1.24-.93-2.37s.59-1.69.8-1.92c.2-.23.44-.29.59-.29h.42c.13 0 .31-.05.49.38.19.45.64 1.56.7 1.67.06.11.1.24.02.39-.08.15-.11.24-.22.36-.11.12-.23.27-.33.36-.11.11-.22.22-.09.43.13.2.59.97 1.26 1.57.87.78 1.6 1.02 1.82 1.13.22.11.34.09.46-.06.13-.15.54-.63.68-.84.15-.2.29-.17.49-.1.2.07 1.3.61 1.52.72.22.11.37.17.42.27.06.11.06.62-.14 1.18z' />
                    </svg>
                    Viber: +63 970 551 7169
                  </a>
                </div>
              </div>

              <FooterLinks />

              <div className='col-lg-3 col-md-6'>
                <h3 className='text-20 fw-500'>Newsletter</h3>
                <p className='mt-20'>Subscribe to the free newsletter and stay up to date</p>

                <div className='footer__newsletter'>
                  <label className='visually-hidden' htmlFor={footerNewsletterEmailId}>
                    Newsletter email address
                  </label>
                  <input
                    id={footerNewsletterEmailId}
                    type='Email'
                    placeholder='Your email address'
                  />
                  <button>Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container'>
        <div className='footer__bottom'>
          <div className='justify-between items-center y-gap-5 row'>
            <div className='col-auto'>
              <div>© Copyright Gr8 Escapes Travel & Tours 2026</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
