insert into public.quote_requests (
  user_id,
  destination_name,
  travel_start_date,
  travel_end_date,
  travel_date_range,
  tour_type_name,
  adults_count,
  children_count,
  budget_range,
  preferred_hotel,
  contact_full_name,
  contact_email,
  contact_phone,
  notes,
  submitted_at,
  created_at,
  updated_at
)
with seeded_customers as (
  select
    u.user_id,
    row_number() over (order by u.user_id) as customer_index,
    coalesce(
      nullif(trim(concat(p.first_name, ' ', p.last_name)), ''),
      'Customer ' || row_number() over (order by u.user_id)::text
    ) as full_name,
    coalesce(au.email, format('customer%s@example.com', row_number() over (order by u.user_id))) as email,
    coalesce(p.phone, format('+639%09s', ((row_number() over (order by u.user_id) * 4171) % 1000000000)::text)) as phone
  from public.users u
  left join public.profiles p
    on p.user_id = u.user_id
  left join auth.users au
    on au.id = u.user_id
  where u.role = 'customer'
),
destination_options as (
  select * from (
    values
      (1, 'Boracay'),
      (2, 'Palawan'),
      (3, 'Cebu'),
      (4, 'Bohol'),
      (5, 'Siargao'),
      (6, 'Baguio'),
      (7, 'Singapore'),
      (8, 'Bangkok'),
      (9, 'Bali'),
      (10, 'Phuket')
  ) as t(option_index, label)
),
tour_type_options as (
  select * from (
    values
      (1, 'Island Hopping'),
      (2, 'Beach Getaway'),
      (3, 'City Tour'),
      (4, 'Cultural & Heritage'),
      (5, 'Family Package'),
      (6, 'Honeymoon Package'),
      (7, 'International Tour'),
      (8, 'Adventure Tour')
  ) as t(option_index, label)
),
budget_options as (
  select * from (
    values
      (1, 'Below ₱20,000'),
      (2, '₱20,000 - ₱50,000'),
      (3, '₱50,000 - ₱100,000'),
      (4, '₱100,000+')
  ) as t(option_index, label)
),
hotel_options as (
  select * from (
    values
      (1, '3-Star'),
      (2, '4-Star'),
      (3, '5-Star'),
      (4, 'Flexible')
  ) as t(option_index, label)
),
seed_rows as (
  select
    gs as row_id,
    (date '2025-05-20' + (((gs * 11) % 245)::int)) as travel_start_date,
    (((gs % 5) + 2)::int) as duration_days,
    (
      timestamptz '2025-09-01 08:00:00+00'
      + ((((gs * 97) % (24 * 175)))::text || ' hours')::interval
    ) as submitted_at
  from generate_series(1, 20) gs
)
select
  case when sr.row_id <= 12 then sc.user_id else null end as user_id,
  d.label as destination_name,
  sr.travel_start_date,
  (sr.travel_start_date + sr.duration_days) as travel_end_date,
  to_char(sr.travel_start_date, 'FMMonth DD') || ' - ' ||
    to_char(sr.travel_start_date + sr.duration_days, 'FMMonth DD') as travel_date_range,
  tt.label as tour_type_name,
  ((sr.row_id % 4) + 1)::int as adults_count,
  (sr.row_id % 3)::int as children_count,
  b.label as budget_range,
  h.label as preferred_hotel,
  coalesce(
    case when sr.row_id <= 12 then sc.full_name end,
    format('Guest Traveler %s', lpad(sr.row_id::text, 2, '0'))
  ) as contact_full_name,
  coalesce(
    case when sr.row_id <= 12 then sc.email end,
    format('guest.quote.%s@example.com', lpad(sr.row_id::text, 2, '0'))
  ) as contact_email,
  coalesce(
    case when sr.row_id <= 12 then sc.phone end,
    format('+639%09s', ((sr.row_id * 5281) % 1000000000)::text)
  ) as contact_phone,
  case
    when sr.row_id % 5 = 0 then 'Needs airport pickup and flexible check-in time.'
    when sr.row_id % 4 = 0 then 'Prefers family-friendly activities and hotel near city center.'
    when sr.row_id % 3 = 0 then 'Interested in snorkeling / island activities if available.'
    else 'Please send package options and inclusions.'
  end as notes,
  sr.submitted_at,
  sr.submitted_at,
  sr.submitted_at
from seed_rows sr
left join seeded_customers sc
  on sc.customer_index = sr.row_id
join destination_options d
  on d.option_index = ((sr.row_id - 1) % 10) + 1
join tour_type_options tt
  on tt.option_index = ((sr.row_id - 1) % 8) + 1
join budget_options b
  on b.option_index = ((sr.row_id - 1) % 4) + 1
join hotel_options h
  on h.option_index = ((sr.row_id + 1) % 4) + 1
where not exists (
  select 1 from public.quote_requests
);
