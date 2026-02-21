'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchAdminTourReferences } from '@/api/admin/tours/mutations/tourReferenceApi';
import { adminTourQueryKeys } from '@/api/admin/tours/queries/tourQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useAdminTourReferencesQuery() {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: adminTourQueryKeys.references(),
    queryFn: () => fetchAdminTourReferences(supabase),
  });
}
