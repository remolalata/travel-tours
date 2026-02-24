import type { AdminDashboardKpi } from '@/types/adminDashboard';

type AdminDashboardKpiCardProps = {
  item: AdminDashboardKpi;
  valueLabel: string;
};

export default function AdminDashboardKpiCard({ item, valueLabel }: AdminDashboardKpiCardProps) {
  return (
    <div
      className='h-full px-20 py-20 bg-white shadow-2 position-relative overflow-hidden'
      style={{ borderRadius: 20 }}
    >
      <div className='d-flex items-start justify-between position-relative'>
        <div className='min-w-0'>
          <div className='text-13 text-dark-1 lh-14' style={{ opacity: 0.68 }}>
            {item.label}
          </div>
          <div className='mt-15 text-24 fw-700 lh-12 text-dark-1'>{valueLabel}</div>
          <div className='mt-15 text-12 lh-14' style={{ color: item.accentColor }}>
            {item.subtitle}
          </div>
        </div>

        <div className='flex-center size-48' style={{ borderRadius: 14, color: item.accentColor }}>
          <i className={`${item.iconClass} text-20`}></i>
        </div>
      </div>
    </div>
  );
}
