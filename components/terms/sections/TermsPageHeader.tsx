import Link from 'next/link';

import { termsPageContent } from '@/content/features/terms';

export default function TermsPageHeader() {
  const { pageHeader } = termsPageContent;

  return (
    <section className='pageHeader -type-3'>
      <div className='container'>
        <div className='row justify-between'>
          <div className='col-auto'>
            <div className='breadcrumbs'>
              {pageHeader.breadcrumbs.map((crumb, index) => (
                <span key={crumb.id} className='breadcrumbs__item'>
                  {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                  {index < pageHeader.breadcrumbs.length - 1 ? <span className='ml-10 mr-10'>{'>'}</span> : null}
                </span>
              ))}
            </div>
          </div>

          <div className='col-auto'>
            <div className='pageHeader__subtitle'>{pageHeader.subtitle}</div>
          </div>
        </div>

        <div className='row pt-30'>
          <div className='col-auto'>
            <h1 className='pageHeader__title'>{pageHeader.title}</h1>
          </div>
        </div>
      </div>
    </section>
  );
}
