import type { AdminDashboardDestinationPerformance } from '@/types/adminDashboard';

type AdminTopDestinationsSummaryProps = {
  items: AdminDashboardDestinationPerformance[];
  bookingsSuffix: string;
  formatCurrency: (value: number) => string;
};

export default function AdminTopDestinationsSummary({
  items,
  bookingsSuffix,
  formatCurrency,
}: AdminTopDestinationsSummaryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className='row y-gap-10 pt-15'>
      {items.map((item) => (
        <div key={item.name} className='col-sm-6 col-12'>
          <div className='border px-15 py-12' style={{ borderRadius: 16 }}>
            <div className='text-14 fw-500'>{item.name}</div>
            <div className='d-flex items-center justify-between mt-5'>
              <span className='text-12 text-dark-1' style={{ opacity: 0.68 }}>
                {item.bookings} {bookingsSuffix}
              </span>
              <span className='text-13 fw-600'>{formatCurrency(item.revenue)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
