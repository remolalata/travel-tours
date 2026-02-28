create table public.departures (
  id bigserial primary key,
  tour_id bigint not null references public.tours(id) on update cascade on delete cascade,
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  maximum_capacity integer not null check (maximum_capacity > 0),
  confirmed_pax integer not null default 0 check (confirmed_pax >= 0 and confirmed_pax <= maximum_capacity),
  booking_deadline date not null check (booking_deadline <= start_date),
  original_price numeric(12,2) check (original_price >= 0),
  price numeric(12,2) not null check (price >= 0),
  status text not null default 'open' check (status in ('open', 'sold_out', 'closed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint departures_tour_start_date_key unique (tour_id, start_date)
);

create index departures_tour_id_idx on public.departures (tour_id);
create index departures_status_idx on public.departures (status);
create index departures_start_date_idx on public.departures (start_date);

alter table public.departures enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'departures' and policyname = 'departures_select_public'
  ) then
    create policy "departures_select_public"
    on public.departures
    for select
    to anon, authenticated
    using (status = 'open');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'departures' and policyname = 'departures_write_admin_only'
  ) then
    create policy "departures_write_admin_only"
    on public.departures
    for all
    to authenticated
    using (
      exists (
        select 1 from public.users u
        where u.user_id = auth.uid() and u.role = 'admin'
      )
    )
    with check (
      exists (
        select 1 from public.users u
        where u.user_id = auth.uid() and u.role = 'admin'
      )
    );
  end if;
end
$$;

create function public.set_departures_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_departures_updated_at
before update on public.departures
for each row
execute function public.set_departures_updated_at();
