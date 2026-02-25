'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchAdminDashboardDataset } from '@/api/admin/dashboard/mutations/dashboardApi';
import { adminDashboardQueryKeys } from '@/api/admin/dashboard/queries/dashboardQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useAdminDashboardQuery() {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: adminDashboardQueryKeys.summary(),
    queryFn: () => fetchAdminDashboardDataset(supabase),
    staleTime: 60_000,
  });
}
