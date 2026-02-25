import type {
  AdminDashboardBooking,
  AdminDashboardBookingStatus,
  AdminDashboardDataset,
  AdminDashboardTimeRange,
  AdminDashboardViewModel,
} from '@/types/adminDashboard';

const STATUS_LABEL_MAP: Record<AdminDashboardBookingStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

const STATUS_COLOR_MAP: Record<AdminDashboardBookingStatus, string> = {
  approved: '#2F80ED',
  pending: '#F2994A',
  cancelled: '#EB5757',
  completed: '#27AE60',
};

const KPI_ACCENTS = {
  revenue: { accent: '#05073c', background: 'rgba(5, 7, 60, 0.06)' },
  bookings: { accent: '#eb662b', background: 'rgba(235, 102, 43, 0.08)' },
  completion: { accent: '#27AE60', background: 'rgba(39, 174, 96, 0.1)' },
  cancellation: { accent: '#EB5757', background: 'rgba(235, 87, 87, 0.08)' },
  average: { accent: '#2F80ED', background: 'rgba(47, 128, 237, 0.08)' },
  tours: { accent: '#9B51E0', background: 'rgba(155, 81, 224, 0.08)' },
} as const;

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getRangeStart(range: AdminDashboardTimeRange, now = new Date()): Date | null {
  if (range === 'all') return null;

  const base = new Date(now);
  base.setHours(0, 0, 0, 0);
  const days = range === '90d' ? 90 : 180;
  base.setDate(base.getDate() - (days - 1));
  return base;
}

function isWithinRange(value: string, rangeStart: Date | null): boolean {
  if (!rangeStart) return true;
  const date = toDate(value);
  if (!date) return false;
  return date >= rangeStart;
}

function getNetRevenue(booking: AdminDashboardBooking): number {
  return Math.max(0, booking.amountPaid - booking.refundedAmount);
}

function getRecognizedRevenue(booking: AdminDashboardBooking): number {
  if (booking.bookingStatus !== 'approved' && booking.bookingStatus !== 'completed') {
    return 0;
  }

  return getNetRevenue(booking);
}

function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${year}-${month}`;
}

function getMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
}

function buildMonthBuckets(range: AdminDashboardTimeRange, now = new Date()): Date[] {
  const monthCount = range === '90d' ? 4 : range === '180d' ? 6 : 12;
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  const buckets: Date[] = [];

  for (let index = monthCount - 1; index >= 0; index -= 1) {
    buckets.push(new Date(end.getFullYear(), end.getMonth() - index, 1));
  }

  return buckets;
}

function safeDivide(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return numerator / denominator;
}

export function buildAdminDashboardViewModel(
  dataset: AdminDashboardDataset,
  range: AdminDashboardTimeRange,
): AdminDashboardViewModel {
  const now = new Date();
  const rangeStart = getRangeStart(range, now);
  const filteredBookings = dataset.bookings.filter((booking) =>
    isWithinRange(booking.bookedAt, rangeStart),
  );
  const filteredReviews = dataset.reviews.filter(
    (review) => review.isPublished && isWithinRange(review.createdAt, rangeStart),
  );

  const totalBookings = filteredBookings.length;
  const approvedOrCompletedBookings = filteredBookings.filter(
    (booking) => booking.bookingStatus === 'approved' || booking.bookingStatus === 'completed',
  );
  const completedBookings = filteredBookings.filter(
    (booking) => booking.bookingStatus === 'completed',
  );
  const cancelledBookings = filteredBookings.filter(
    (booking) => booking.bookingStatus === 'cancelled',
  );

  const totalRevenue = approvedOrCompletedBookings.reduce(
    (sum, booking) => sum + getRecognizedRevenue(booking),
    0,
  );
  const averageOrderValue = approvedOrCompletedBookings.length
    ? totalRevenue / approvedOrCompletedBookings.length
    : 0;
  const completionRate = safeDivide(completedBookings.length, totalBookings) * 100;
  const cancellationRate = safeDivide(cancelledBookings.length, totalBookings) * 100;

  const monthBuckets = buildMonthBuckets(range, now);
  const monthMap = new Map(
    monthBuckets.map((date) => [
      getMonthKey(date),
      {
        label: getMonthLabel(date),
        revenue: 0,
        bookings: 0,
      },
    ]),
  );

  for (const booking of filteredBookings) {
    const bookedDate = toDate(booking.bookedAt);
    if (!bookedDate) continue;
    const key = getMonthKey(new Date(bookedDate.getFullYear(), bookedDate.getMonth(), 1));
    const bucket = monthMap.get(key);
    if (!bucket) continue;

    bucket.bookings += 1;
    bucket.revenue += getRecognizedRevenue(booking);
  }

  const statusCounts = new Map<AdminDashboardBookingStatus, number>([
    ['approved', 0],
    ['pending', 0],
    ['cancelled', 0],
    ['completed', 0],
  ]);

  for (const booking of filteredBookings) {
    statusCounts.set(booking.bookingStatus, (statusCounts.get(booking.bookingStatus) ?? 0) + 1);
  }

  const destinationMap = new Map<string, { name: string; bookings: number; revenue: number }>();
  for (const booking of filteredBookings) {
    const destinationName = booking.destinationName || 'Unknown Destination';
    const current = destinationMap.get(destinationName) ?? {
      name: destinationName,
      bookings: 0,
      revenue: 0,
    };
    current.bookings += 1;
    current.revenue += getRecognizedRevenue(booking);
    destinationMap.set(destinationName, current);
  }

  const topToursMap = new Map<
    string,
    { title: string; destinationName: string; bookings: number; revenue: number }
  >();
  for (const booking of filteredBookings) {
    const title = booking.tourTitle || 'Unknown Tour';
    const key = `${title}::${booking.destinationName ?? 'Unknown Destination'}`;
    const current = topToursMap.get(key) ?? {
      title,
      destinationName: booking.destinationName || 'Unknown Destination',
      bookings: 0,
      revenue: 0,
    };
    current.bookings += 1;
    current.revenue += getRecognizedRevenue(booking);
    topToursMap.set(key, current);
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    label: `${rating}★`,
    rating,
    count: filteredReviews.filter((review) => review.rating === rating).length,
  }));

  const totalRatings = filteredReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = filteredReviews.length ? totalRatings / filteredReviews.length : 0;

  return {
    kpis: [
      {
        id: 'revenue',
        label: 'Net Revenue',
        value: totalRevenue,
        format: 'currency',
        subtitle: `${approvedOrCompletedBookings.length} confirmed bookings`,
        iconClass: 'icon-wallet',
        accentColor: KPI_ACCENTS.revenue.accent,
        backgroundColor: KPI_ACCENTS.revenue.background,
      },
      {
        id: 'bookings',
        label: 'Total Bookings',
        value: totalBookings,
        format: 'integer',
        subtitle: `${filteredBookings.filter((booking) => booking.bookingStatus === 'pending').length} pending`,
        iconClass: 'icon-booking',
        accentColor: KPI_ACCENTS.bookings.accent,
        backgroundColor: KPI_ACCENTS.bookings.background,
      },
      {
        id: 'completion-rate',
        label: 'Completion Rate',
        value: completionRate,
        format: 'percent',
        subtitle: `${completedBookings.length} completed`,
        iconClass: 'icon-calendar',
        accentColor: KPI_ACCENTS.completion.accent,
        backgroundColor: KPI_ACCENTS.completion.background,
      },
      {
        id: 'cancellation-rate',
        label: 'Cancellation Rate',
        value: cancellationRate,
        format: 'percent',
        subtitle: `${cancelledBookings.length} cancelled`,
        iconClass: 'icon-payment',
        accentColor: KPI_ACCENTS.cancellation.accent,
        backgroundColor: KPI_ACCENTS.cancellation.background,
      },
      {
        id: 'average-order',
        label: 'Average Order Value',
        value: averageOrderValue,
        format: 'currency',
        subtitle: 'Approved + completed',
        iconClass: 'icon-review',
        accentColor: KPI_ACCENTS.average.accent,
        backgroundColor: KPI_ACCENTS.average.background,
      },
      {
        id: 'active-tours',
        label: 'Active Tours',
        value: dataset.activeToursCount,
        format: 'integer',
        subtitle: `${dataset.totalToursCount} total tours`,
        iconClass: 'icon-menu',
        accentColor: KPI_ACCENTS.tours.accent,
        backgroundColor: KPI_ACCENTS.tours.background,
      },
    ],
    revenueTrend: monthBuckets.map((date) => {
      const key = getMonthKey(date);
      const point = monthMap.get(key);
      return {
        label: point?.label ?? getMonthLabel(date),
        revenue: point?.revenue ?? 0,
        bookings: point?.bookings ?? 0,
      };
    }),
    statusBreakdown: (Object.keys(STATUS_LABEL_MAP) as AdminDashboardBookingStatus[]).map(
      (statusKey) => ({
        key: statusKey,
        label: STATUS_LABEL_MAP[statusKey],
        count: statusCounts.get(statusKey) ?? 0,
        color: STATUS_COLOR_MAP[statusKey],
      }),
    ),
    topDestinations: [...destinationMap.values()]
      .sort((left, right) => right.bookings - left.bookings || right.revenue - left.revenue)
      .slice(0, 6),
    topTours: [...topToursMap.values()]
      .sort((left, right) => right.bookings - left.bookings || right.revenue - left.revenue)
      .slice(0, 6),
    ratingDistribution,
    averageRating,
    totalFilteredBookings: totalBookings,
    totalFilteredRevenue: totalRevenue,
  };
}
