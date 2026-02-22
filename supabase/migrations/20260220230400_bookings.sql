-- Bookings table + seed data

create table if not exists public.bookings (
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

alter table public.bookings drop column if exists customer_first_name;
alter table public.bookings drop column if exists customer_last_name;
alter table public.bookings drop column if exists customer_email;
alter table public.bookings drop column if exists customer_phone;

create index if not exists bookings_destination_status_idx on public.bookings (destination_id, booking_status);
create index if not exists bookings_destination_booked_idx on public.bookings (destination_id, booked_at desc);
create index if not exists bookings_booked_at_idx on public.bookings (booked_at desc);
create index if not exists bookings_customer_user_idx on public.bookings (customer_user_id);

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

insert into public.bookings (
  booking_reference,
  customer_user_id,
  destination_id,
  package_title,
  booking_status,
  payment_status,
  currency,
  total_amount,
  amount_paid,
  refunded_amount,
  number_of_travelers,
  travel_start_date,
  travel_end_date,
  booked_at,
  approved_at,
  cancelled_at,
  notes
)
with seeded_customers as (
  select
    au.id as customer_user_id,
    row_number() over (order by au.email) as customer_index
  from auth.users au
  join public.users u
    on u.user_id = au.id
  where u.role = 'customer'
),
destination_map as (
  select * from (
    values
      (1, 'boracay', 'Boracay Island Hopping and White Beach Leisure Escape'),
      (2, 'palawan', 'El Nido Lagoons and Island Hopping Adventure'),
      (3, 'cebu', 'Cebu City Heritage Tour and Southern Coast Getaway'),
      (4, 'bohol', 'Chocolate Hills, Tarsier Sanctuary and Loboc River Cruise'),
      (5, 'siargao', 'Siargao Surf and Sohoton Cove Island Experience'),
      (6, 'baguio', 'Baguio Highlands Escape with City and Nature Sights'),
      (7, 'singapore', 'Singapore City Highlights and Sentosa Fun Adventure'),
      (8, 'bangkok', 'Bangkok City Tour with Floating Market and Railway Experience')
  ) as t(destination_index, slug, package_title)
),
seeded_rows_base as (
  select
    row_number() over (order by c.customer_index, n.trip_no) as row_id,
    c.customer_user_id,
    n.trip_no,
    d.slug,
    d.package_title,
    mod(
      abs(
        hashtextextended(
          c.customer_user_id::text || '-' || d.slug || '-' || n.trip_no::text,
          42
        )
      ),
      100
    ) as status_bucket
  from seeded_customers c
  cross join lateral (
    select generate_series(1, 15) as trip_no
  ) n
  join destination_map d
    on d.destination_index = (((c.customer_index - 1) * 15 + n.trip_no - 1) % 8) + 1
),
seeded_rows as (
  select
    sb.*,
    row_number() over (order by sb.status_bucket, sb.row_id) as status_rank
  from seeded_rows_base sb
)
select
  format('BK-%s', lpad(row_id::text, 5, '0')) as booking_reference,
  customer_user_id,
  dest.id as destination_id,
  seeded_rows.package_title,
  case
    when status_rank <= 50 then 'completed'
    when status_rank <= 80 then 'approved'
    when status_rank <= 95 then 'pending'
    else 'cancelled'
  end as booking_status,
  case
    when status_rank <= 80 then 'paid'
    when status_rank <= 95 then 'partial'
    else 'refunded'
  end as payment_status,
  'PHP'::char(3) as currency,
  (8500 + ((row_id * 739) % 29000))::numeric(12,2) as total_amount,
  case
    when (row_id % 10) < 6 then (8500 + ((row_id * 739) % 29000))::numeric(12,2)
    when (row_id % 10) < 8 then round(((8500 + ((row_id * 739) % 29000))::numeric(12,2)) * 0.35, 2)
    when (row_id % 10) = 8 then (8500 + ((row_id * 739) % 29000))::numeric(12,2)
    else (8500 + ((row_id * 739) % 29000))::numeric(12,2)
  end as amount_paid,
  case
    when (row_id % 10) = 9 then (8500 + ((row_id * 739) % 29000))::numeric(12,2)
    else 0::numeric
  end as refunded_amount,
  (((row_id % 4) + 1)::int) as number_of_travelers,
  (date '2025-08-01' + (((row_id * 3) % 170)::int)) as travel_start_date,
  (date '2025-08-01' + (((row_id * 3) % 170)::int) + (((row_id % 6) + 2)::int)) as travel_end_date,
  (
    timestamptz '2025-08-01 09:00:00+00'
    + ((((row_id * 19) % (24 * 183)))::text || ' hours')::interval
  ) as booked_at,
  case
    when status_rank <= 80
      then (
        timestamptz '2025-08-01 09:00:00+00'
        + ((((row_id * 19) % (24 * 183)) + 6)::text || ' hours')::interval
      )
    else null
  end as approved_at,
  case
    when status_rank > 95
      then (
        timestamptz '2025-08-01 09:00:00+00'
        + ((((row_id * 19) % (24 * 183)) + 8)::text || ' hours')::interval
      )
    else null
  end as cancelled_at,
  case
    when status_rank > 95 then 'Cancelled by customer request; refund issued in full.'
    when status_rank <= 50 then 'Trip completed successfully with positive feedback.'
    when status_rank <= 80 then 'Booking approved and fully paid. Travel support is in progress.'
    else 'Booking pending final payment confirmation.'
  end as notes
from seeded_rows
join public.destinations dest
  on dest.slug = seeded_rows.slug
on conflict (booking_reference) do update
set
  customer_user_id = excluded.customer_user_id,
  destination_id = excluded.destination_id,
  package_title = excluded.package_title,
  booking_status = excluded.booking_status,
  payment_status = excluded.payment_status,
  currency = excluded.currency,
  total_amount = excluded.total_amount,
  amount_paid = excluded.amount_paid,
  refunded_amount = excluded.refunded_amount,
  number_of_travelers = excluded.number_of_travelers,
  travel_start_date = excluded.travel_start_date,
  travel_end_date = excluded.travel_end_date,
  booked_at = excluded.booked_at,
  approved_at = excluded.approved_at,
  cancelled_at = excluded.cancelled_at,
  notes = excluded.notes,
  updated_at = now();
