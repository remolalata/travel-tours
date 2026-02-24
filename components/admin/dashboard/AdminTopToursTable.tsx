import type { AdminDashboardTopTour } from '@/types/adminDashboard';

type AdminTopToursTableLabels = {
  tour: string;
  destination: string;
  bookings: string;
  revenue: string;
  empty: string;
};

type AdminTopToursTableProps = {
  rows: AdminDashboardTopTour[];
  labels: AdminTopToursTableLabels;
  formatCurrency: (value: number) => string;
};

export default function AdminTopToursTable({
  rows,
  labels,
  formatCurrency,
}: AdminTopToursTableProps) {
  if (rows.length === 0) {
    return (
      <div className='text-14 text-dark-1' style={{ opacity: 0.68 }}>
        {labels.empty}
      </div>
    );
  }

  return (
    <div className='overflow-auto'>
      <table style={{ width: '100%', minWidth: '100%' }}>
        <thead>
          <tr className='border-bottom text-13 text-dark-1' style={{ opacity: 0.72 }}>
            <th className='py-15 text-left fw-500'>{labels.tour}</th>
            <th className='py-15 text-left fw-500'>{labels.destination}</th>
            <th className='py-15 text-right fw-500'>{labels.bookings}</th>
            <th className='py-15 text-right fw-500'>{labels.revenue}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.title}-${row.destinationName}`} className='border-bottom'>
              <td className='py-15 pr-15'>
                <div className='text-14 text-dark-1 fw-500'>{row.title}</div>
              </td>
              <td className='py-15 pr-15'>
                <div className='text-13 text-dark-1' style={{ opacity: 0.68 }}>
                  {row.destinationName}
                </div>
              </td>
              <td className='py-15 text-right'>
                <span
                  className='px-10 py-5 rounded-200 text-12 text-dark-1 fw-500'
                  style={{ backgroundColor: 'rgba(47, 128, 237, 0.1)' }}
                >
                  {row.bookings}
                </span>
              </td>
              <td className='py-15 text-14 text-right fw-600'>{formatCurrency(row.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
