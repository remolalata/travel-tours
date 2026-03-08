do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'departures_id_tour_id_key'
      and conrelid = 'public.departures'::regclass
  ) then
    alter table public.departures
    add constraint departures_id_tour_id_key unique (id, tour_id);
  end if;
end
$$;

create table if not exists public.bookings (
  id bigserial primary key,
  reference_no text not null unique,
  user_id uuid references public.users(user_id) on update cascade on delete set null,
  tour_id bigint not null references public.tours(id) on update cascade on delete restrict,
  departure_id bigint not null,
  tour_title_snapshot text not null,
  departure_start_date_snapshot date not null,
  departure_end_date_snapshot date not null,
  lead_traveler_name text not null,
  lead_traveler_email text not null,
  lead_traveler_phone text,
  traveler_count integer not null check (traveler_count > 0),
  currency char(3) not null default 'PHP',
  payment_option text not null check (payment_option in ('full', 'downpayment', 'reserve')),
  booking_status text not null check (
    booking_status in ('draft', 'pending_payment', 'partially_paid', 'confirmed', 'cancelled', 'expired', 'completed')
  ),
  payment_status text not null check (
    payment_status in ('unpaid', 'pending', 'partial', 'paid', 'failed', 'refunded', 'partially_refunded')
  ),
  inventory_status text not null default 'none' check (
    inventory_status in ('none', 'held', 'secured', 'released', 'expired')
  ),
  price_per_pax_snapshot numeric(12,2) not null check (price_per_pax_snapshot >= 0),
  downpayment_per_pax_snapshot numeric(12,2) check (downpayment_per_pax_snapshot >= 0),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  amount_due_now numeric(12,2) not null check (amount_due_now >= 0),
  amount_paid numeric(12,2) not null default 0 check (amount_paid >= 0),
  balance_amount numeric(12,2) not null check (balance_amount >= 0),
  refunded_amount numeric(12,2) not null default 0 check (refunded_amount >= 0),
  reserved_until timestamptz,
  slots_confirmed_at timestamptz,
  booked_at timestamptz not null default now(),
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  expired_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_departure_tour_fkey
    foreign key (departure_id, tour_id)
    references public.departures(id, tour_id)
    on update cascade
    on delete restrict,
  constraint bookings_amounts_check check (
    amount_due_now <= total_amount
    and amount_paid <= total_amount
    and refunded_amount <= amount_paid
  ),
  constraint bookings_departure_date_range_check check (
    departure_end_date_snapshot >= departure_start_date_snapshot
  )
);

create index if not exists bookings_user_id_idx on public.bookings (user_id);
create index if not exists bookings_tour_id_idx on public.bookings (tour_id);
create index if not exists bookings_departure_id_idx on public.bookings (departure_id);
create index if not exists bookings_booking_status_idx on public.bookings (booking_status);
create index if not exists bookings_payment_status_idx on public.bookings (payment_status);
create index if not exists bookings_inventory_status_idx on public.bookings (inventory_status);
create index if not exists bookings_booked_at_idx on public.bookings (booked_at desc);

alter table public.bookings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_insert_public'
  ) then
    create policy "bookings_insert_public"
    on public.bookings
    for insert
    to anon, authenticated
    with check (
      user_id is null
      or auth.uid() = user_id
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_select_own'
  ) then
    create policy "bookings_select_own"
    on public.bookings
    for select
    to authenticated
    using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_select_admin_only'
  ) then
    create policy "bookings_select_admin_only"
    on public.bookings
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
    where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_write_admin_only'
  ) then
    create policy "bookings_write_admin_only"
    on public.bookings
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

create or replace function public.set_bookings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row
execute function public.set_bookings_updated_at();
