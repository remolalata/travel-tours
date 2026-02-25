import { createClient } from '@/utils/supabase/server';

export type AuthRole = 'admin' | 'customer';

type UserRoleRow = {
  role: AuthRole;
};

type ProfileRow = {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

function buildFullName(firstName: string | null, lastName: string | null): string | null {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  return fullName || null;
}

export async function getServerAuthState() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      isAdmin: false,
      role: null,
      avatarUrl: null,
      fullName: null,
      email: null,
    };
  }

  const [{ data: roleData }, { data: profileData }] = await Promise.all([
    supabase.from('users').select('role').eq('user_id', user.id).maybeSingle<UserRoleRow>(),
    supabase
      .from('profiles')
      .select('first_name,last_name,avatar_url')
      .eq('user_id', user.id)
      .maybeSingle<ProfileRow>(),
  ]);

  const role = roleData?.role ?? 'customer';

  return {
    user,
    isAdmin: role === 'admin',
    role,
    avatarUrl: profileData?.avatar_url ?? null,
    fullName: buildFullName(profileData?.first_name ?? null, profileData?.last_name ?? null),
    email: user.email ?? null,
  };
}
