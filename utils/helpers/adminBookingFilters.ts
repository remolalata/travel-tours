import type { AdminBookingContent } from '@/types/admin';

export type AdminBookingStatusFilter =
  | 'confirmed'
  | 'pending_payment'
  | 'partially_paid'
  | 'cancelled'
  | 'expired'
  | 'completed';

export function getAdminBookingStatusFilterOptions(content: AdminBookingContent) {
  return [
    { value: 'confirmed', label: content.filters.groups.status.options.confirmed },
    { value: 'pending_payment', label: content.filters.groups.status.options.pendingPayment },
    { value: 'partially_paid', label: content.filters.groups.status.options.partiallyPaid },
    { value: 'cancelled', label: content.filters.groups.status.options.cancelled },
    { value: 'expired', label: content.filters.groups.status.options.expired },
    { value: 'completed', label: content.filters.groups.status.options.completed },
  ] satisfies Array<{ value: AdminBookingStatusFilter; label: string }>;
}
