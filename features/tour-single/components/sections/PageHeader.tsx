import AppBreadcrumb from '@/components/common/navigation/AppBreadcrumb';

type PageHeaderProps = {
  breadcrumbs: {
    label: string;
    href?: string;
  }[];
};

export default function PageHeader({ breadcrumbs }: PageHeaderProps) {
  return (
    <div className='container'>
      <div className='mt-80 py-30 row'>
        <div className='col-auto'>
          <AppBreadcrumb
            items={breadcrumbs}
            className='breadcrumbs text-14'
            listClassName='d-flex items-center flex-wrap'
            itemClassName='d-flex items-center breadcrumbs__item'
            separatorClassName='ml-10 mr-10'
          />
        </div>
      </div>
    </div>
  );
}
