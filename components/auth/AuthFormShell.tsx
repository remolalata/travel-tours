import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthFormShellProps = {
  heading: string;
  subheading: string;
  helpPrefix: string;
  helpLinkLabel: string;
  helpLinkHref: string;
  children: ReactNode;
};

export default function AuthFormShell({
  heading,
  subheading,
  helpPrefix,
  helpLinkLabel,
  helpLinkHref,
  children,
}: AuthFormShellProps) {
  return (
    <section className='mt-header layout-pt-lg layout-pb-lg'>
      <div className='container'>
        <div className='justify-center row'>
          <div className='col-xl-6 col-lg-7 col-md-9'>
            <div className='mb-60 md:mb-30 text-center'>
              <h1 className='text-30'>{heading}</h1>
              <div className='mt-20 md:mt-15 text-18 fw-500'>{subheading}</div>
              <div className='mt-5'>
                {helpPrefix}{' '}
                <Link href={helpLinkHref} className='text-accent-1'>
                  {helpLinkLabel}
                </Link>
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
