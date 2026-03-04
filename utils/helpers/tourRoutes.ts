export function buildAdminTourEditPath(tourId: number): string {
  return `/admin/tours/edit/${tourId}`;
}

export function buildPublicTourPath(routeValue: string | number): string {
  return `/tour/${routeValue}`;
}
