'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchCurrentAdminProfile } from '@/api/admin/profile/mutations/profileApi';
import { adminProfileQueryKeys } from '@/api/admin/profile/queries/profileQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useAdminProfileQuery() {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: adminProfileQueryKeys.detail(),
    queryFn: () => fetchCurrentAdminProfile(supabase),
  });
}
