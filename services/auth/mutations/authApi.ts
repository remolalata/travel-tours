import type { SupabaseClient } from '@supabase/supabase-js';

export type AuthRole = 'admin' | 'customer';

export type AuthViewerState = {
  isAuthenticated: boolean;
  role: AuthRole | null;
  avatarUrl: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
};

type UserRoleRow = {
  role: AuthRole;
};

type ProfileRow = {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
};

function buildFullName(firstName: string | null, lastName: string | null): string | null {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  return fullName || null;
}

export async function fetchAuthViewerState(supabase: SupabaseClient): Promise<AuthViewerState> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAuthenticated: false,
      role: null,
      avatarUrl: null,
      fullName: null,
      email: null,
      phone: null,
    };
  }

  const [{ data: roleData }, { data: profileData }] = await Promise.all([
    supabase.from('users').select('role').eq('user_id', user.id).maybeSingle<UserRoleRow>(),
    supabase
      .from('profiles')
      .select('first_name,last_name,avatar_url,phone')
      .eq('user_id', user.id)
      .maybeSingle<ProfileRow>(),
  ]);

  const role = roleData?.role ?? 'customer';

  return {
    isAuthenticated: true,
    role,
    avatarUrl: profileData?.avatar_url ?? null,
    fullName: buildFullName(profileData?.first_name ?? null, profileData?.last_name ?? null),
    email: user.email ?? null,
    phone: profileData?.phone ?? null,
  };
}
