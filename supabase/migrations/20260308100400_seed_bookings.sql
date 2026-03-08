with seeded_customers as (
  select
    u.user_id,
    row_number() over (order by u.created_at, u.user_id) as customer_index,
    coalesce(
      nullif(trim(concat(p.first_name, ' ', p.last_name)), ''),
      initcap(split_part(coalesce(au.email, 'customer@example.com'), '@', 1))
    ) as full_name,
    coalesce(au.email, format('customer%s@example.com', row_number() over (order by u.created_at, u.user_id))) as email,
    coalesce(p.phone, format('+639%09s', ((row_number() over (order by u.created_at, u.user_id) * 4781) % 1000000000)::text)) as phone
  from public.users u
  left join public.profiles p
    on p.user_id = u.user_id
  left join auth.users au
    on au.id = u.user_id
  where u.role = 'customer'
),
departure_options as (
  select
    d.id as departure_id,
    d.tour_id,
    t.title as tour_title,
    d.start_date,
    d.end_date,
    d.price,
    coalesce(round(d.price * 0.30, 2), 0::numeric) as downpayment_per_pax,
    row_number() over (order by d.start_date, d.id) as departure_index
  from public.departures d
  join public.tours t
    on t.id = d.tour_id
  where d.status = 'open'
),
booking_seed as (
  select
    sc.user_id,
    sc.full_name,
    sc.email,
    sc.phone,
    dep.departure_id,
    dep.tour_id,
    dep.tour_title,
    dep.start_date,
    dep.end_date,
    dep.price,
    dep.downpayment_per_pax,
    sc.customer_index,
    format('BK-%s', lpad(sc.customer_index::text, 5, '0')) as reference_no,
    case
      when mod(sc.customer_index, 4) = 1 then 'full'
      when mod(sc.customer_index, 4) = 2 then 'downpayment'
      when mod(sc.customer_index, 4) = 3 then 'full'
      else 'downpayment'
    end as payment_option,
    case
      when mod(sc.customer_index, 4) in (1, 3) then 'confirmed'
      when mod(sc.customer_index, 4) = 2 then 'partially_paid'
      else 'pending_payment'
    end as booking_status,
    case
      when mod(sc.customer_index, 4) in (1, 3) then 'paid'
      when mod(sc.customer_index, 4) = 2 then 'partial'
      else 'unpaid'
    end as payment_status,
    case
      when mod(sc.customer_index, 4) in (1, 2, 3) then 'secured'
      else 'none'
    end as inventory_status,
    2 + mod(sc.customer_index, 3) as traveler_count,
    (
      timestamptz '2026-01-10 09:00:00+00'
      + ((sc.customer_index * 19)::text || ' hours')::interval
    ) as booked_at
  from seeded_customers sc
  join departure_options dep
    on dep.departure_index = sc.customer_index
  where sc.customer_index <= 12
),
normalized_booking_seed as (
  select
    bs.reference_no,
    bs.user_id,
    bs.tour_id,
    bs.departure_id,
    bs.tour_title,
    bs.start_date,
    bs.end_date,
    bs.full_name,
    bs.email,
    bs.phone,
    bs.traveler_count,
    bs.payment_option,
    bs.booking_status,
    bs.payment_status,
    bs.inventory_status,
    bs.price,
    case
      when bs.payment_option = 'downpayment' then bs.downpayment_per_pax
      else null
    end as downpayment_per_pax_snapshot,
    (bs.price * bs.traveler_count)::numeric(12,2) as total_amount,
    case
      when bs.payment_option = 'full' then (bs.price * bs.traveler_count)::numeric(12,2)
      when bs.payment_option = 'downpayment' then (bs.downpayment_per_pax * bs.traveler_count)::numeric(12,2)
      else 0::numeric(12,2)
    end as amount_due_now,
    case
      when bs.payment_option = 'full' and bs.payment_status = 'paid'
        then (bs.price * bs.traveler_count)::numeric(12,2)
      when bs.payment_option = 'downpayment' and bs.payment_status = 'partial'
        then (bs.downpayment_per_pax * bs.traveler_count)::numeric(12,2)
      when bs.payment_option = 'full' and bs.payment_status = 'unpaid'
        then 0::numeric(12,2)
      else 0::numeric(12,2)
    end as amount_paid,
    bs.booked_at,
    case
      when bs.booking_status = 'confirmed' then bs.booked_at + interval '45 minutes'
      else null
    end as confirmed_at,
    case
      when bs.inventory_status = 'secured' then bs.booked_at + interval '45 minutes'
      else null
    end as slots_confirmed_at,
    case
      when bs.booking_status = 'pending_payment' then 'Awaiting successful payment.'
      when bs.booking_status = 'partially_paid' then 'Downpayment received. Balance to follow.'
      else 'Seeded confirmed booking.'
    end as notes
  from booking_seed bs
),
inserted_bookings as (
  insert into public.bookings (
    reference_no,
    user_id,
    tour_id,
    departure_id,
    tour_title_snapshot,
    departure_start_date_snapshot,
    departure_end_date_snapshot,
    lead_traveler_name,
    lead_traveler_email,
    lead_traveler_phone,
    traveler_count,
    currency,
    payment_option,
    booking_status,
    payment_status,
    inventory_status,
    price_per_pax_snapshot,
    downpayment_per_pax_snapshot,
    total_amount,
    amount_due_now,
    amount_paid,
    balance_amount,
    refunded_amount,
    slots_confirmed_at,
    booked_at,
    confirmed_at,
    notes,
    created_at,
    updated_at
  )
  select
    nbs.reference_no,
    nbs.user_id,
    nbs.tour_id,
    nbs.departure_id,
    nbs.tour_title,
    nbs.start_date,
    nbs.end_date,
    nbs.full_name,
    nbs.email,
    nbs.phone,
    nbs.traveler_count,
    'PHP',
    nbs.payment_option,
    nbs.booking_status,
    nbs.payment_status,
    nbs.inventory_status,
    nbs.price,
    nbs.downpayment_per_pax_snapshot,
    nbs.total_amount,
    nbs.amount_due_now,
    nbs.amount_paid,
    (nbs.total_amount - nbs.amount_paid)::numeric(12,2),
    0::numeric(12,2),
    nbs.slots_confirmed_at,
    nbs.booked_at,
    nbs.confirmed_at,
    nbs.notes,
    nbs.booked_at,
    nbs.booked_at
  from normalized_booking_seed nbs
  on conflict (reference_no) do nothing
  returning id, reference_no
)
select 1;

with traveler_source as (
  select
    b.id as booking_id,
    b.reference_no,
    b.lead_traveler_name,
    b.lead_traveler_email,
    b.lead_traveler_phone,
    b.traveler_count,
    row_number() over (partition by b.id order by gs.traveler_no) as traveler_no
  from public.bookings b
  join generate_series(1, 4) as gs(traveler_no)
    on gs.traveler_no <= b.traveler_count
  where b.reference_no like 'BK-%'
),
normalized_travelers as (
  select
    ts.booking_id,
    ts.traveler_no,
    case
      when ts.traveler_no = 1 then split_part(ts.lead_traveler_name, ' ', 1)
      else format('Traveler%s', ts.traveler_no)
    end as first_name,
    case
      when ts.traveler_no = 1 then nullif(substring(ts.lead_traveler_name from position(' ' in ts.lead_traveler_name) + 1), '')
      else format('Guest%s', right(ts.reference_no, 2))
    end as last_name,
    case when ts.traveler_no = 1 then ts.lead_traveler_email else null end as email,
    case when ts.traveler_no = 1 then ts.lead_traveler_phone else null end as phone,
    case when ts.traveler_no = 1 then true else false end as is_lead,
    case when ts.traveler_no = ts.traveler_count and ts.traveler_count > 2 then 'child' else 'adult' end as traveler_type,
    (
      date '1990-01-01'
      + (((ts.booking_id + ts.traveler_no) * 173 % 9000))::integer
    ) as birthdate
  from traveler_source ts
)
insert into public.booking_travelers (
  booking_id,
  traveler_type,
  is_lead,
  first_name,
  last_name,
  middle_name,
  birthdate,
  gender,
  nationality,
  email,
  phone,
  passport_no,
  passport_expiry,
  special_requests,
  created_at,
  updated_at
)
select
  nt.booking_id,
  nt.traveler_type,
  nt.is_lead,
  nt.first_name,
  coalesce(nt.last_name, 'Traveler'),
  null,
  nt.birthdate,
  case when mod(nt.booking_id + nt.traveler_no, 2) = 0 then 'female' else 'male' end,
  'Filipino',
  nt.email,
  nt.phone,
  case when nt.traveler_type = 'adult' then format('P%s%s', nt.booking_id, lpad(nt.traveler_no::text, 2, '0')) else null end,
  case
    when nt.traveler_type = 'adult'
      then date '2031-12-31' - (((nt.booking_id + nt.traveler_no) % 365))::integer
    else null
  end,
  case when nt.is_lead then 'Primary booking contact.' else null end,
  now(),
  now()
from normalized_travelers nt
where not exists (
  select 1
  from public.booking_travelers bt
  where bt.booking_id = nt.booking_id
);

with payment_seed as (
  select
    b.id as booking_id,
    b.reference_no,
    b.payment_option,
    b.payment_status,
    b.amount_due_now,
    b.total_amount,
    b.amount_paid,
    b.booked_at
  from public.bookings b
  where b.reference_no like 'BK-%'
),
normalized_payment_seed as (
  select
    ps.booking_id,
    format('PAY-%s-01', right(ps.reference_no, 5)) as payment_reference,
    case
      when ps.payment_option = 'downpayment' then 'downpayment'
      else 'full'
    end as payment_type,
    'paymongo' as provider,
    'gcash' as payment_method,
    format('pm-ref-%s-01', lower(replace(ps.reference_no, '-', ''))) as provider_reference,
    format('pm-checkout-%s-01', lower(replace(ps.reference_no, '-', ''))) as provider_checkout_session_id,
    format('pm-intent-%s-01', lower(replace(ps.reference_no, '-', ''))) as provider_payment_intent_id,
    case
      when ps.payment_status in ('paid', 'partial') then ps.amount_paid
      else ps.amount_due_now
    end as amount,
    case
      when ps.payment_status = 'paid' then 'paid'
      when ps.payment_status = 'partial' then 'paid'
      else 'pending'
    end as payment_record_status,
    ps.booked_at + interval '20 minutes' as attempted_at,
    case
      when ps.payment_status in ('paid', 'partial') then ps.booked_at + interval '35 minutes'
      else null
    end as paid_at
  from payment_seed ps
)
insert into public.payments (
  booking_id,
  payment_reference,
  payment_type,
  payment_method,
  provider,
  provider_reference,
  provider_checkout_session_id,
  provider_payment_intent_id,
  amount,
  currency,
  payment_status,
  attempted_at,
  paid_at,
  raw_response,
  created_at,
  updated_at
)
select
  nps.booking_id,
  nps.payment_reference,
  nps.payment_type,
  nps.payment_method,
  nps.provider,
  nps.provider_reference,
  nps.provider_checkout_session_id,
  nps.provider_payment_intent_id,
  nps.amount,
  'PHP',
  nps.payment_record_status,
  nps.attempted_at,
  nps.paid_at,
  jsonb_build_object(
    'source', 'seed',
    'booking_reference', b.reference_no,
    'payment_status', b.payment_status
  ),
  nps.attempted_at,
  coalesce(nps.paid_at, nps.attempted_at)
from normalized_payment_seed nps
join public.bookings b
  on b.id = nps.booking_id
on conflict (payment_reference) do nothing;

with status_log_seed as (
  select
    b.id as booking_id,
    b.booking_status,
    b.payment_status,
    b.inventory_status,
    b.booked_at,
    b.confirmed_at
  from public.bookings b
  where b.reference_no like 'BK-%'
)
insert into public.booking_status_logs (
  booking_id,
  old_booking_status,
  new_booking_status,
  old_payment_status,
  new_payment_status,
  old_inventory_status,
  new_inventory_status,
  trigger_source,
  notes,
  created_at
)
select
  sls.booking_id,
  null,
  'pending_payment',
  null,
  'unpaid',
  null,
  'none',
  'system',
  'Initial seeded booking creation.',
  sls.booked_at
from status_log_seed sls
where not exists (
  select 1
  from public.booking_status_logs existing
  where existing.booking_id = sls.booking_id
)
union all
select
  sls.booking_id,
  'pending_payment',
  sls.booking_status,
  'unpaid',
  sls.payment_status,
  'none',
  sls.inventory_status,
  'webhook',
  case
    when sls.booking_status = 'confirmed' then 'Seeded payment fully settled and seats secured.'
    when sls.booking_status = 'partially_paid' then 'Seeded downpayment received.'
    else 'Seeded booking remains unpaid.'
  end,
  coalesce(sls.confirmed_at, sls.booked_at + interval '30 minutes')
from status_log_seed sls
where sls.booking_status <> 'pending_payment'
  and not exists (
    select 1
    from public.booking_status_logs existing
    where existing.booking_id = sls.booking_id
      and existing.new_booking_status = sls.booking_status
      and existing.new_payment_status = sls.payment_status
  );

update public.departures d
set confirmed_pax = coalesce(secured.secured_pax, 0),
    updated_at = now()
from (
  select
    d2.id as departure_id,
    coalesce(sum(b.traveler_count), 0)::integer as secured_pax
  from public.departures d2
  left join public.bookings b
    on b.departure_id = d2.id
   and b.inventory_status = 'secured'
  group by d2.id
) secured
where d.id = secured.departure_id;
