import { createClient } from '@/utils/supabase/server';

export async function getServerAuthState() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, isAdmin: false };
  }

  const { data: adminUser, error } = await supabase
    .from('users')
    .select('user_id, role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  return { user, isAdmin: !error && Boolean(adminUser) };
}
