-- Profiles table (linked to public.users)

create table if not exists public.profiles (
  user_id uuid primary key references public.users(user_id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_select_own'
  ) then
    create policy "profiles_select_own"
    on public.profiles
    for select
    to authenticated
    using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_insert_own'
  ) then
    create policy "profiles_insert_own"
    on public.profiles
    for insert
    to authenticated
    with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_update_own'
  ) then
    create policy "profiles_update_own"
    on public.profiles
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;
end
$$;

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

insert into public.profiles (user_id, first_name, last_name, phone, avatar_url)
with all_users as (
  select
    u.user_id,
    au.email,
    au.raw_user_meta_data,
    row_number() over (order by u.user_id) as user_index
  from public.users u
  left join auth.users au
    on au.id = u.user_id
),
profile_seed as (
  select
    user_id,
    coalesce(
      nullif(raw_user_meta_data->>'first_name', ''),
      initcap(split_part(coalesce(email, 'user@example.com'), '@', 1))
    ) as first_name,
    coalesce(
      nullif(raw_user_meta_data->>'last_name', ''),
      'User'
    ) as last_name,
    format('+639%09s', ((user_index * 3791) % 1000000000)::text) as phone,
    case (user_index - 1) % 5
      when 0 then '/img/avatars/animal-cat.svg'
      when 1 then '/img/avatars/animal-fox.svg'
      when 2 then '/img/avatars/animal-frog.svg'
      when 3 then '/img/avatars/animal-owl.svg'
      else '/img/avatars/animal-panda.svg'
    end as avatar_url
  from all_users
)
select
  user_id,
  first_name,
  last_name,
  phone,
  avatar_url
from profile_seed
on conflict (user_id) do update
set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  phone = excluded.phone,
  avatar_url = excluded.avatar_url,
  updated_at = now();
