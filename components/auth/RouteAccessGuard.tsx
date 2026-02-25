'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { fetchAuthViewerState } from '@/api/auth/mutations/authApi';
import { createClient } from '@/utils/supabase/client';

type RouteAccessGuardMode = 'guest-only' | 'auth-required';

type RouteAccessGuardProps = {
  mode: RouteAccessGuardMode;
  children: ReactNode;
};

export default function RouteAccessGuard({ mode, children }: RouteAccessGuardProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const validateAccess = async () => {
      try {
        const viewer = await fetchAuthViewerState(supabase);
        if (!isMounted) {
          return;
        }

        if (mode === 'guest-only' && viewer.isAuthenticated) {
          router.replace(viewer.role === 'admin' ? '/admin/dashboard' : '/');
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
  }, [mode, router, supabase]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
