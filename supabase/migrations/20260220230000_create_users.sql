-- Users table + role model + auth sync seed/backfill

create table if not exists public.users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_role_idx on public.users (role);

alter table public.users enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'users_select_own'
  ) then
    create policy "users_select_own"
    on public.users
    for select
    to authenticated
    using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'users_insert_own'
  ) then
    create policy "users_insert_own"
    on public.users
    for insert
    to authenticated
    with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'users_update_own'
  ) then
    create policy "users_update_own"
    on public.users
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;
end
$$;

create or replace function public.set_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_users_updated_at();

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
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

-- Ensure pgcrypto functions are available for password hashing in auth seed.
create extension if not exists pgcrypto with schema extensions;

-- Seed one admin + 20 customers in auth.users.
with seeded_people as (
  select * from (
    values
      ('admin@admin.com', 'Admin', 'User', 'admin'),
      ('ava.santos@example.com', 'Ava', 'Santos', 'customer'),
      ('liam.reyes@example.com', 'Liam', 'Reyes', 'customer'),
      ('noah.cruz@example.com', 'Noah', 'Cruz', 'customer'),
      ('mia.garcia@example.com', 'Mia', 'Garcia', 'customer'),
      ('ethan.mendoza@example.com', 'Ethan', 'Mendoza', 'customer'),
      ('sophia.lopez@example.com', 'Sophia', 'Lopez', 'customer'),
      ('lucas.torres@example.com', 'Lucas', 'Torres', 'customer'),
      ('emma.navarro@example.com', 'Emma', 'Navarro', 'customer'),
      ('elijah.ramos@example.com', 'Elijah', 'Ramos', 'customer'),
      ('olivia.villanueva@example.com', 'Olivia', 'Villanueva', 'customer'),
      ('james.castillo@example.com', 'James', 'Castillo', 'customer'),
      ('amelia.aquino@example.com', 'Amelia', 'Aquino', 'customer'),
      ('benjamin.rivera@example.com', 'Benjamin', 'Rivera', 'customer'),
      ('isabella.fernandez@example.com', 'Isabella', 'Fernandez', 'customer'),
      ('henry.diaz@example.com', 'Henry', 'Diaz', 'customer'),
      ('charlotte.gonzales@example.com', 'Charlotte', 'Gonzales', 'customer'),
      ('jack.domingo@example.com', 'Jack', 'Domingo', 'customer'),
      ('harper.delacruz@example.com', 'Harper', 'Dela Cruz', 'customer'),
      ('leo.bautista@example.com', 'Leo', 'Bautista', 'customer'),
      ('grace.perez@example.com', 'Grace', 'Perez', 'customer')
  ) as t(email, first_name, last_name, role)
),
seeded_auth_ids as (
  select
    email,
    first_name,
    last_name,
    role,
    (
      substr(md5(email), 1, 8) || '-' ||
      substr(md5(email), 9, 4) || '-' ||
      substr(md5(email), 13, 4) || '-' ||
      substr(md5(email), 17, 4) || '-' ||
      substr(md5(email), 21, 12)
    )::uuid as generated_user_id
  from seeded_people
)
update auth.users au
set
  encrypted_password = extensions.crypt('password123', extensions.gen_salt('bf')),
  email_confirmed_at = now(),
  raw_app_meta_data = jsonb_build_object('provider', 'email', 'providers', array['email']),
  raw_user_meta_data = jsonb_build_object('first_name', s.first_name, 'last_name', s.last_name),
  updated_at = now()
from seeded_auth_ids s
where au.email = s.email;

with seeded_people as (
  select * from (
    values
      ('admin@admin.com', 'Admin', 'User', 'admin'),
      ('ava.santos@example.com', 'Ava', 'Santos', 'customer'),
      ('liam.reyes@example.com', 'Liam', 'Reyes', 'customer'),
      ('noah.cruz@example.com', 'Noah', 'Cruz', 'customer'),
      ('mia.garcia@example.com', 'Mia', 'Garcia', 'customer'),
      ('ethan.mendoza@example.com', 'Ethan', 'Mendoza', 'customer'),
      ('sophia.lopez@example.com', 'Sophia', 'Lopez', 'customer'),
      ('lucas.torres@example.com', 'Lucas', 'Torres', 'customer'),
      ('emma.navarro@example.com', 'Emma', 'Navarro', 'customer'),
      ('elijah.ramos@example.com', 'Elijah', 'Ramos', 'customer'),
      ('olivia.villanueva@example.com', 'Olivia', 'Villanueva', 'customer'),
      ('james.castillo@example.com', 'James', 'Castillo', 'customer'),
      ('amelia.aquino@example.com', 'Amelia', 'Aquino', 'customer'),
      ('benjamin.rivera@example.com', 'Benjamin', 'Rivera', 'customer'),
      ('isabella.fernandez@example.com', 'Isabella', 'Fernandez', 'customer'),
      ('henry.diaz@example.com', 'Henry', 'Diaz', 'customer'),
      ('charlotte.gonzales@example.com', 'Charlotte', 'Gonzales', 'customer'),
      ('jack.domingo@example.com', 'Jack', 'Domingo', 'customer'),
      ('harper.delacruz@example.com', 'Harper', 'Dela Cruz', 'customer'),
      ('leo.bautista@example.com', 'Leo', 'Bautista', 'customer'),
      ('grace.perez@example.com', 'Grace', 'Perez', 'customer')
  ) as t(email, first_name, last_name, role)
),
seeded_auth_ids as (
  select
    email,
    first_name,
    last_name,
    role,
    (
      substr(md5(email), 1, 8) || '-' ||
      substr(md5(email), 9, 4) || '-' ||
      substr(md5(email), 13, 4) || '-' ||
      substr(md5(email), 17, 4) || '-' ||
      substr(md5(email), 21, 12)
    )::uuid as generated_user_id
  from seeded_people
)
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_token,
  email_change_token_new,
  email_change,
  confirmation_token,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
select
  '00000000-0000-0000-0000-000000000000'::uuid as instance_id,
  s.generated_user_id as id,
  'authenticated' as aud,
  'authenticated' as role,
  s.email,
  extensions.crypt('password123', extensions.gen_salt('bf')) as encrypted_password,
  now() as email_confirmed_at,
  '' as recovery_token,
  '' as email_change_token_new,
  '' as email_change,
  '' as confirmation_token,
  jsonb_build_object('provider', 'email', 'providers', array['email']) as raw_app_meta_data,
  jsonb_build_object('first_name', s.first_name, 'last_name', s.last_name) as raw_user_meta_data,
  now() as created_at,
  now() as updated_at
from seeded_auth_ids s
where not exists (
  select 1
  from auth.users au
  where au.email = s.email
);

-- Sync to app-level users table with correct role.
insert into public.users (user_id, role)
select
  au.id as user_id,
  case when sp.role = 'admin' then 'admin' else 'customer' end as role
from auth.users au
join (
  select * from (
    values
      ('admin@admin.com', 'admin'),
      ('ava.santos@example.com', 'customer'),
      ('liam.reyes@example.com', 'customer'),
      ('noah.cruz@example.com', 'customer'),
      ('mia.garcia@example.com', 'customer'),
      ('ethan.mendoza@example.com', 'customer'),
      ('sophia.lopez@example.com', 'customer'),
      ('lucas.torres@example.com', 'customer'),
      ('emma.navarro@example.com', 'customer'),
      ('elijah.ramos@example.com', 'customer'),
      ('olivia.villanueva@example.com', 'customer'),
      ('james.castillo@example.com', 'customer'),
      ('amelia.aquino@example.com', 'customer'),
      ('benjamin.rivera@example.com', 'customer'),
      ('isabella.fernandez@example.com', 'customer'),
      ('henry.diaz@example.com', 'customer'),
      ('charlotte.gonzales@example.com', 'customer'),
      ('jack.domingo@example.com', 'customer'),
      ('harper.delacruz@example.com', 'customer'),
      ('leo.bautista@example.com', 'customer'),
      ('grace.perez@example.com', 'customer')
  ) as seed(email, role)
) sp
  on sp.email = au.email
on conflict (user_id) do update
set
  role = excluded.role,
  updated_at = now();

-- Backfill any remaining auth users as customers.
insert into public.users (user_id, role)
select au.id, 'customer'
from auth.users au
left join public.users u on u.user_id = au.id
where u.user_id is null
on conflict (user_id) do nothing;
