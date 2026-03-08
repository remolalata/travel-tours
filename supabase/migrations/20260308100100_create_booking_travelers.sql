create table if not exists public.booking_travelers (
  id bigserial primary key,
  booking_id bigint not null references public.bookings(id) on update cascade on delete cascade,
  traveler_type text not null check (traveler_type in ('adult', 'child', 'infant')),
  is_lead boolean not null default false,
  first_name text not null,
  last_name text not null,
  middle_name text,
  birthdate date,
  gender text,
  nationality text,
  email text,
  phone text,
  passport_no text,
  passport_expiry date,
  special_requests text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_travelers_passport_expiry_check check (
    passport_expiry is null
    or birthdate is null
    or passport_expiry >= birthdate
  )
);

create index if not exists booking_travelers_booking_id_idx on public.booking_travelers (booking_id);
create index if not exists booking_travelers_traveler_type_idx on public.booking_travelers (traveler_type);
create unique index if not exists booking_travelers_one_lead_per_booking_idx
  on public.booking_travelers (booking_id)
  where is_lead = true;

alter table public.booking_travelers enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'booking_travelers' and policyname = 'booking_travelers_select_own'
  ) then
    create policy "booking_travelers_select_own"
    on public.booking_travelers
    for select
    to authenticated
    using (
      exists (
        select 1
        from public.bookings b
        where b.id = booking_travelers.booking_id
          and b.user_id = auth.uid()
      )
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'booking_travelers' and policyname = 'booking_travelers_select_admin_only'
  ) then
    create policy "booking_travelers_select_admin_only"
    on public.booking_travelers
    for select
    to authenticated
    using (
      exists (
        select 1
        from public.users u
        where u.user_id = auth.uid()
          and u.role = 'admin'
      )
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'booking_travelers' and policyname = 'booking_travelers_write_admin_only'
  ) then
    create policy "booking_travelers_write_admin_only"
    on public.booking_travelers
    for all
    to authenticated
    using (
      exists (
        select 1
        from public.users u
        where u.user_id = auth.uid()
          and u.role = 'admin'
      )
    )
    with check (
      exists (
        select 1
        from public.users u
        where u.user_id = auth.uid()
          and u.role = 'admin'
      )
    );
  end if;
end
$$;

create or replace function public.set_booking_travelers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_booking_travelers_updated_at on public.booking_travelers;
create trigger set_booking_travelers_updated_at
before update on public.booking_travelers
for each row
execute function public.set_booking_travelers_updated_at();
