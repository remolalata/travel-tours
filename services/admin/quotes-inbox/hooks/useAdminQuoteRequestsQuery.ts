'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { FetchAdminQuoteRequestsInput } from '@/services/admin/quotes-inbox/mutations/quoteRequestApi';
import { fetchAdminQuoteRequests } from '@/services/admin/quotes-inbox/mutations/quoteRequestApi';
import { adminQuoteRequestQueryKeys } from '@/services/admin/quotes-inbox/queries/quoteRequestQueryKeys';
import { createClient } from '@/utils/supabase/client';

export default function useAdminQuoteRequestsQuery(input: FetchAdminQuoteRequestsInput) {
  const supabase = useMemo(() => createClient(), []);

  return useQuery({
    queryKey: adminQuoteRequestQueryKeys.list(input),
    queryFn: () => fetchAdminQuoteRequests(supabase, input),
    placeholderData: keepPreviousData,
  });
}
