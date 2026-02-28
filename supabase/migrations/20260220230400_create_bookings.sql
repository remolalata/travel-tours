create table public.bookings (
  id bigserial primary key,
  booking_reference text not null unique,
  customer_user_id uuid references public.users(user_id) on delete set null,
  destination_id bigint not null references public.destinations(id) on update cascade on delete restrict,
  package_title text not null,
  booking_status text not null check (booking_status in ('approved', 'pending', 'cancelled', 'completed')),
  payment_status text not null check (payment_status in ('unpaid', 'partial', 'paid', 'refunded')),
  currency char(3) not null default 'PHP',
  total_amount numeric(12,2) not null check (total_amount >= 0),
  amount_paid numeric(12,2) not null default 0 check (amount_paid >= 0),
  refunded_amount numeric(12,2) not null default 0 check (refunded_amount >= 0),
  number_of_travelers integer not null check (number_of_travelers > 0),
  travel_start_date date not null,
  travel_end_date date not null,
  booked_at timestamptz not null default now(),
  approved_at timestamptz,
  cancelled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_date_range_check check (travel_end_date >= travel_start_date),
  constraint bookings_amounts_check check (amount_paid <= total_amount)
);

create index bookings_destination_status_idx on public.bookings (destination_id, booking_status);
create index bookings_destination_booked_idx on public.bookings (destination_id, booked_at desc);
create index bookings_booked_at_idx on public.bookings (booked_at desc);
create index bookings_customer_user_idx on public.bookings (customer_user_id);

alter table public.bookings enable row level security;

do $$
begin
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

create function public.set_bookings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_bookings_updated_at
before update on public.bookings
for each row
execute function public.set_bookings_updated_at();
