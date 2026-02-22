import AppBreadcrumb from '@/components/common/navigation/AppBreadcrumb';
import { toursContent } from '@/content/features/tours';

export default function PageHeader() {
  const { pageHeader } = toursContent;

  return (
    <section className='pageHeader -type-3'>
      <div className='container'>
        <div className='row'>
          <div className='col-auto'>
            <AppBreadcrumb
              items={pageHeader.breadcrumbs}
              className='breadcrumbs'
              listClassName='d-flex items-center flex-wrap'
              itemClassName='d-flex items-center breadcrumbs__item'
              separatorClassName='ml-10 mr-10'
            />
          </div>
        </div>

        <div className='pt-30 row'>
          <div className='col-auto'>
            <h1 className='pageHeader__title'>{pageHeader.title}</h1>
          </div>
        </div>
      </div>
    </section>
  );
}
