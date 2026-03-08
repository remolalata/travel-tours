'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchCurrentProfile } from '@/services/profile/mutations/profileApi';
import { profileQueryKeys } from '@/services/profile/queries/profileQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useProfileQuery() {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: profileQueryKeys.detail(),
    queryFn: () => fetchCurrentProfile(supabase),
  });
}
