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
      (1, 'boracay', 'Boracay Tour Package'),
      (2, 'palawan', 'Palawan Tour Package'),
      (3, 'cebu', 'Cebu Tour Package'),
      (4, 'bohol', 'Bohol Tour Package'),
      (5, 'siargao', 'Siargao Tour Package'),
      (6, 'baguio', 'Baguio Tour Package'),
      (7, 'singapore', 'Singapore Tour Package'),
      (8, 'bangkok', 'Bangkok Tour Package')
  ) as t(destination_index, slug, package_title)
),
destination_weight_slots as (
  select * from (
    values
      (1, 1),
      (2, 1),
      (3, 1),
      (4, 1),
      (5, 2),
      (6, 2),
      (7, 3),
      (8, 3),
      (9, 4),
      (10, 4),
      (11, 5),
      (12, 6),
      (13, 1),
      (14, 1),
      (15, 7),
      (16, 8),
      (17, 1),
      (18, 2),
      (19, 4),
      (20, 3)
  ) as t(slot_index, destination_index)
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
  join destination_weight_slots ws
    on ws.slot_index = (((c.customer_index - 1) * 15 + n.trip_no - 1) % 20) + 1
  join destination_map d
    on d.destination_index = ws.destination_index
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
