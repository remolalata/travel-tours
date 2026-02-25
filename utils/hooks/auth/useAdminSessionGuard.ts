'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { createClient } from '@/utils/supabase/client';

export default function useAdminSessionGuard() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const validateSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
      }
    };

    const handlePageShow = () => {
      void validateSession();
    };

    void validateSession();
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [router, supabase]);
}
