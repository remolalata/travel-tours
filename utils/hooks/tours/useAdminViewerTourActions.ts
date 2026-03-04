'use client';

import useAuthViewerQuery from '@/services/auth/hooks/useAuthViewerQuery';
import { unauthenticatedAuthViewerState } from '@/services/auth/mutations/authApi';
import { buildAdminTourEditPath, buildPublicTourPath } from '@/utils/helpers/tourRoutes';

type UseAdminViewerTourActionsInput = {
  tourId?: number | null;
  publicRouteValue?: string | number | null;
};

export default function useAdminViewerTourActions({
  tourId,
  publicRouteValue,
}: UseAdminViewerTourActionsInput) {
  const authQuery = useAuthViewerQuery({ initialData: unauthenticatedAuthViewerState });
  const isAdminViewer = authQuery.data.isAuthenticated && authQuery.data.role === 'admin';

  return {
    isAdminViewer,
    editHref: typeof tourId === 'number' ? buildAdminTourEditPath(tourId) : null,
    viewHref:
      publicRouteValue !== null && publicRouteValue !== undefined
        ? buildPublicTourPath(publicRouteValue)
        : typeof tourId === 'number'
          ? buildPublicTourPath(tourId)
          : null,
  };
}
