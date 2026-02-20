-- Admin authentication + profile schema

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin'))
);

alter table public.admin_users enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_users'
      and policyname = 'admin_users_select_own'
  ) then
    create policy "admin_users_select_own"
    on public.admin_users
    for select
    to authenticated
    using (auth.uid() = user_id);
  end if;
end
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
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
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_select_own'
  ) then
    create policy "profiles_select_own"
    on public.profiles
    for select
    to authenticated
    using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_insert_own'
  ) then
    create policy "profiles_insert_own"
    on public.profiles
    for insert
    to authenticated
    with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_update_own'
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

insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do update
set public = excluded.public;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'profile_photos_insert_own_folder'
  ) then
    create policy "profile_photos_insert_own_folder"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'profile-photos'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'profile_photos_update_own_folder'
  ) then
    create policy "profile_photos_update_own_folder"
    on storage.objects
    for update
    to authenticated
    using (
      bucket_id = 'profile-photos'
      and (storage.foldername(name))[1] = auth.uid()::text
    )
    with check (
      bucket_id = 'profile-photos'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'profile_photos_delete_own_folder'
  ) then
    create policy "profile_photos_delete_own_folder"
    on storage.objects
    for delete
    to authenticated
    using (
      bucket_id = 'profile-photos'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;
end
$$;
