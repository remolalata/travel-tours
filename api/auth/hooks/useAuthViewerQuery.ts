'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import type { AuthViewerState } from '@/api/auth/mutations/authApi';
import { fetchAuthViewerState } from '@/api/auth/mutations/authApi';
import { authQueryKeys } from '@/api/auth/queries/authQueryKeys';
import { createClient } from '@/utils/supabase/client';

type UseAuthViewerQueryOptions = {
  initialData: AuthViewerState;
};

export default function useAuthViewerQuery({ initialData }: UseAuthViewerQueryOptions) {
  const supabase = useMemo(() => createClient(), []);
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void queryClient.invalidateQueries({ queryKey: authQueryKeys.viewer() });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, supabase]);

  return useQuery({
    queryKey: authQueryKeys.viewer(),
    queryFn: () => fetchAuthViewerState(supabase),
    initialData,
  });
}
