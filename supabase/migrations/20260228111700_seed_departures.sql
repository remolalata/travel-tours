with departure_seed as (
  select
    t.id as tour_id,
    gs.departure_number,
    (
      current_date
      + (30 + (t.id * 3) + ((gs.departure_number - 1) * 21))::integer
    )::date as start_date,
    12 + (mod(t.id + gs.departure_number, 5) * 4) as maximum_capacity,
    (8950 + (mod(t.id, 7) * 1150))::numeric(12,2) as price,
    case
      when mod(t.id, 3) = 0 then (8950 + (mod(t.id, 7) * 1150) + 1800)::numeric(12,2)
      else null::numeric(12,2)
    end as original_price
  from public.tours t
  cross join generate_series(1, 2) as gs(departure_number)
)
insert into public.departures (
  tour_id,
  start_date,
  end_date,
  maximum_capacity,
  confirmed_pax,
  booking_deadline,
  original_price,
  price,
  status
)
select
  s.tour_id,
  s.start_date,
  case
    when mod(s.tour_id + s.departure_number, 2) = 0 then s.start_date + 2
    else s.start_date + 3
  end as end_date,
  s.maximum_capacity,
  0 as confirmed_pax,
  s.start_date - (5 + mod(s.departure_number, 2)) as booking_deadline,
  s.original_price,
  s.price,
  'open' as status
from departure_seed s
on conflict (tour_id, start_date) do update
set
  end_date = excluded.end_date,
  maximum_capacity = excluded.maximum_capacity,
  confirmed_pax = excluded.confirmed_pax,
  booking_deadline = excluded.booking_deadline,
  original_price = excluded.original_price,
  price = excluded.price,
  status = excluded.status,
  updated_at = now();
