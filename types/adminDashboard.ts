export type AdminDashboardBookingStatus = 'approved' | 'pending' | 'cancelled' | 'completed';

export type AdminDashboardTimeRange = '90d' | '180d' | 'all';

export type AdminDashboardBooking = {
  id: number;
  bookingStatus: AdminDashboardBookingStatus;
  totalAmount: number;
  amountPaid: number;
  refundedAmount: number;
  bookedAt: string;
  travelStartDate: string;
  cancelledAt: string | null;
  destinationName: string | null;
  tourTitle: string | null;
};

export type AdminDashboardReview = {
  id: number;
  rating: number;
  createdAt: string;
  isPublished: boolean;
};

export type AdminDashboardDataset = {
  bookings: AdminDashboardBooking[];
  reviews: AdminDashboardReview[];
  activeToursCount: number;
  totalToursCount: number;
};

export type AdminDashboardKpi = {
  id: string;
  label: string;
  value: number;
  format: 'currency' | 'integer' | 'percent';
  subtitle: string;
  iconClass: string;
  accentColor: string;
  backgroundColor: string;
};

export type AdminDashboardTrendPoint = {
  label: string;
  revenue: number;
  bookings: number;
};

export type AdminDashboardStatusBreakdown = {
  key: AdminDashboardBookingStatus;
  label: string;
  count: number;
  color: string;
};

export type AdminDashboardDestinationPerformance = {
  name: string;
  bookings: number;
  revenue: number;
};

export type AdminDashboardTopTour = {
  title: string;
  destinationName: string;
  bookings: number;
  revenue: number;
};

export type AdminDashboardRatingDistribution = {
  label: string;
  rating: number;
  count: number;
};

export type AdminDashboardViewModel = {
  kpis: AdminDashboardKpi[];
  revenueTrend: AdminDashboardTrendPoint[];
  statusBreakdown: AdminDashboardStatusBreakdown[];
  topDestinations: AdminDashboardDestinationPerformance[];
  topTours: AdminDashboardTopTour[];
  ratingDistribution: AdminDashboardRatingDistribution[];
  averageRating: number;
  totalFilteredBookings: number;
  totalFilteredRevenue: number;
};
