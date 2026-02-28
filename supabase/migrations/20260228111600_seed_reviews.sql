delete from public.reviews r
using public.bookings b
where b.id = r.booking_id
  and (
    b.booking_status <> 'completed'
    or b.customer_user_id is null
  );

delete from public.reviews r
where not exists (
  select 1
  from public.bookings b
  where b.id = r.booking_id
);

insert into public.reviews (
  destination_id,
  booking_id,
  user_id,
  review_title,
  review_text,
  rating,
  is_published,
  created_at
)
with review_templates as (
  select * from (
    values
      (1, 'Excellent planning and smooth execution', 'Everything was organized from airport pickup to the final transfer. The itinerary was clear, the schedule was on time, and communication was fast throughout the trip.'),
      (2, 'Great value and professional support', 'The package delivered exactly what was promised. The hotel, transport, and tour coordination were reliable, and the support team quickly answered every question we had.'),
      (3, 'Memorable experience with no hassle', 'This was one of our easiest trips to date. The destination highlights were well chosen, logistics were seamless, and the overall experience felt premium and stress-free.')
  ) as t(reviewer_order, review_title, review_text)
),
eligible_bookings as (
  select
    b.id as booking_id,
    b.customer_user_id as user_id,
    b.destination_id,
    row_number() over (order by b.booked_at desc nulls last, b.id desc) as row_id
  from public.bookings b
  where b.booking_status = 'completed'
    and b.customer_user_id is not null
),
seed_rows as (
  select
    eb.destination_id,
    eb.booking_id,
    eb.user_id,
    eb.row_id,
    rt.review_title,
    rt.review_text
  from eligible_bookings eb
  join review_templates rt
    on rt.reviewer_order = ((eb.row_id - 1) % 3) + 1
)
select
  sr.destination_id,
  sr.booking_id,
  sr.user_id,
  sr.review_title,
  sr.review_text,
  case
    when mod(abs(hashtextextended(sr.booking_id::text, 42)), 10) < 7 then 5
    when mod(abs(hashtextextended(sr.booking_id::text, 42)), 10) < 9 then 4
    else 3
  end as rating,
  true as is_published,
  (b.booked_at + interval '2 days') as created_at
from seed_rows sr
join public.bookings b
  on b.id = sr.booking_id
on conflict (booking_id) do update
set
  destination_id = excluded.destination_id,
  user_id = excluded.user_id,
  review_title = excluded.review_title,
  review_text = excluded.review_text,
  rating = excluded.rating,
  is_published = excluded.is_published,
  updated_at = now();
