'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { fetchAuthViewerState } from '@/services/auth/mutations/authApi';
import { createClient } from '@/utils/supabase/client';

type RouteAccessGuardMode = 'guest-only' | 'auth-required';

type RouteAccessGuardProps = {
  mode: RouteAccessGuardMode;
  children: ReactNode;
};

export default function RouteAccessGuard({ mode, children }: RouteAccessGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [isChecking, setIsChecking] = useState(true);
  const nextParam = searchParams.get('next');
  const redirectPath =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

  useEffect(() => {
    let isMounted = true;

    const validateAccess = async () => {
      try {
        const viewer = await fetchAuthViewerState(supabase);
        if (!isMounted) {
          return;
        }

        if (mode === 'guest-only' && viewer.isAuthenticated) {
          router.replace(redirectPath);
          return;
        }

        if (mode === 'auth-required' && !viewer.isAuthenticated) {
          router.replace('/login');
          return;
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    void validateAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      setIsChecking(true);
      void validateAccess();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [mode, redirectPath, router, supabase]);

  if (isChecking && mode === 'auth-required') {
    return null;
  }

  return <>{children}</>;
}
