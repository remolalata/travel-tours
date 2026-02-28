-- Ensure profile rows are created automatically for new auth users.
-- This supports sign-up flows where email confirmation is enabled and no session
-- is returned to the client (so client-side profile inserts cannot pass RLS).

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (user_id, role)
  values (new.id, 'customer')
  on conflict (user_id) do nothing;

  insert into public.profiles (user_id, first_name, last_name, phone, avatar_url)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data->>'first_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'last_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'phone', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'avatar_url', '')), '')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Backfill profiles for any existing users that do not have one yet.
insert into public.profiles (user_id, first_name, last_name, phone, avatar_url)
select
  au.id as user_id,
  nullif(trim(coalesce(au.raw_user_meta_data->>'first_name', '')), '') as first_name,
  nullif(trim(coalesce(au.raw_user_meta_data->>'last_name', '')), '') as last_name,
  nullif(trim(coalesce(au.raw_user_meta_data->>'phone', '')), '') as phone,
  nullif(trim(coalesce(au.raw_user_meta_data->>'avatar_url', '')), '') as avatar_url
from auth.users au
join public.users u
  on u.user_id = au.id
left join public.profiles p
  on p.user_id = au.id
where p.user_id is null;
