-- Quote requests table + seed data
-- Seeded dates are intentionally before 2026-02-24.

create table if not exists public.quote_requests (
  id bigserial primary key,
  user_id uuid references public.users(user_id) on update cascade on delete set null,
  destination_name text not null,
  travel_start_date date not null,
  travel_end_date date not null,
  travel_date_range text not null,
  tour_type_name text not null,
  adults_count integer not null check (adults_count > 0),
  children_count integer not null default 0 check (children_count >= 0),
  budget_range text not null,
  preferred_hotel text not null,
  contact_full_name text not null,
  contact_email text not null,
  contact_phone text not null,
  notes text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quote_requests_travel_date_range_check check (travel_end_date >= travel_start_date)
);

create index if not exists quote_requests_user_idx on public.quote_requests (user_id);
create index if not exists quote_requests_submitted_at_idx on public.quote_requests (submitted_at desc);
create index if not exists quote_requests_destination_submitted_idx
  on public.quote_requests (destination_name, submitted_at desc);

alter table public.quote_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'quote_requests' and policyname = 'quote_requests_insert_public'
  ) then
    create policy "quote_requests_insert_public"
    on public.quote_requests
    for insert
    to anon, authenticated
    with check (
      user_id is null
      or auth.uid() = user_id
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'quote_requests' and policyname = 'quote_requests_select_admin_only'
  ) then
    create policy "quote_requests_select_admin_only"
    on public.quote_requests
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
    where schemaname = 'public' and tablename = 'quote_requests' and policyname = 'quote_requests_write_admin_only'
  ) then
    create policy "quote_requests_write_admin_only"
    on public.quote_requests
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

create or replace function public.set_quote_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_quote_requests_updated_at on public.quote_requests;
create trigger set_quote_requests_updated_at
before update on public.quote_requests
for each row
execute function public.set_quote_requests_updated_at();

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

