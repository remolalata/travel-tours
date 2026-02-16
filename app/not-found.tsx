import Image from 'next/image';

import SiteFooter from '@/components/layout/footers/SiteFooter';
import SiteHeader from '@/components/layout/header/SiteHeader';

export const metadata = {
  title: 'Not found || ViaTour - Travel & Tour React NextJS Template',
  description: 'ViaTour - Travel & Tour React NextJS Template',
};

export default function NotFound() {
  return (
    <>
      <main>
        <SiteHeader />
        <section className='mt-header nopage'>
          <div className='container'>
            <div className='justify-between items-center y-gap-30 row'>
              <div className='col-xl-6 col-lg-6'>
                <Image width='629' height='481' src='/img/404/1.svg' alt='image' />
              </div>

              <div className='col-xl-5 col-lg-6'>
                <div className='pr-30 lg:pr-0 nopage__content'>
                  <h1>
                    40<span className='text-accent-1'>4</span>
                  </h1>
                  <h2 className='text-30 md:text-24 fw-700'>
                    Oops! It looks like you&apos;re lost.
                  </h2>
                  <p>
                    The page you&apos;re looking for isn&apos;t available. Try to search again or
                    use the go to.
                  </p>

                  <button className='mt-25 text-white bg-accent-1 button -md -dark-1'>
                    Go back to homepage
                    <i className='icon-arrow-top-right ml-10'></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <SiteFooter />
      </main>
    </>
  );
}
