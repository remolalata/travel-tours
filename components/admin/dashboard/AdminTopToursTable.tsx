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
          <tr className='border-1-bottom text-13 text-dark-1' style={{ opacity: 0.72 }}>
            <th className='text-left py-15 fw-500'>{labels.tour}</th>
            <th className='text-left py-15 fw-500'>{labels.destination}</th>
            <th className='text-right py-15 fw-500'>{labels.bookings}</th>
            <th className='text-right py-15 fw-500'>{labels.revenue}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.title}-${row.destinationName}`} className='border-1-bottom'>
              <td className='py-15 pr-15'>
                <div className='text-14 fw-500 text-dark-1'>{row.title}</div>
              </td>
              <td className='py-15 pr-15'>
                <div className='text-13 text-dark-1' style={{ opacity: 0.68 }}>
                  {row.destinationName}
                </div>
              </td>
              <td className='py-15 text-right'>
                <span
                  className='px-10 py-5 rounded-200 text-12 fw-500 text-dark-1'
                  style={{ backgroundColor: 'rgba(47, 128, 237, 0.1)' }}
                >
                  {row.bookings}
                </span>
              </td>
              <td className='py-15 text-right text-14 fw-600'>{formatCurrency(row.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
