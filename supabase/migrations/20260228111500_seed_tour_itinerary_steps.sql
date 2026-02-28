insert into public.tour_itinerary_steps (tour_id, is_summary, day_number, title, content, icon)
with seeded_tours as (
  select
    t.id,
    t.title,
    t.location,
    coalesce(nullif(split_part(t.location, ',', 1), ''), t.location) as destination_name
  from public.tours t
),
itinerary_templates as (
  select * from (
    values
      (true, 1, 'Day 1: Airport Pick-Up and Hotel Check-In', null::text, 'icon-pin'),
      (true, 2, 'Day 2: City Highlights and Cultural Tour', 'Pagdating sa destination, we''ll handle your transfers para hassle-free. On Day 2, enjoy a guided city and culture experience with photo stops, local food options, and free time for shopping.', null::text),
      (true, 3, 'Day 3: Island Hopping and Beach Time', null::text, null::text),
      (true, 4, 'Day 4: Nature Adventure and Local Experience', null::text, null::text),
      (true, 5, 'Day 5: Leisure Morning and Optional Activities', null::text, null::text),
      (true, 6, 'Day 6: Free Day and Sunset Experience', null::text, null::text),
      (true, 7, 'Day 7: Check-Out and Airport Transfer', null::text, 'icon-flag'),
      (false, 1, 'Day 1: Airport Pick-Up and Hotel Check-In', 'Welcome to your destination! Our team will meet you at the airport and transfer you directly to your hotel. First day is for rest, quick orientation, and light exploration at your own pace.', 'icon-pin'),
      (false, 2, 'Day 2: City Highlights and Cultural Tour', 'Start your day with breakfast, then join a guided city tour covering key landmarks, heritage spots, and local favorites. May free time din for cafe hopping or pasalubong shopping.', null::text),
      (false, 3, 'Day 3: Island Hopping and Beach Time', 'Enjoy a full-day island hopping adventure with scenic stops, swimming spots, and lunch by the beach. Perfect day for photos, relaxation, and bonding with family or barkada.', null::text),
      (false, 4, 'Day 4: Nature Adventure and Local Experience', 'Explore nature attractions such as hills, rivers, caves, or eco parks depending on your package. Includes guided activities and local cultural immersion for a more meaningful trip.', null::text),
      (false, 5, 'Day 5: Leisure Morning and Optional Activities', 'This is your flexible day-sleep in, enjoy hotel amenities, or add optional tours like spa, food crawl, or water activities. Great time to personalize your getaway.', null::text),
      (false, 6, 'Day 6: Free Day and Sunset Experience', 'Spend your final full day your way. Chill at the beach, explore nearby spots, or enjoy a sunset cruise experience. Relax mode before heading home.', null::text),
      (false, 7, 'Day 7: Check-Out and Airport Transfer', 'After breakfast, check out from the hotel and enjoy your scheduled transfer to the airport. Salamat and we hope to see you again on your next Travel & Tours escape!', 'icon-flag')
  ) as t(is_summary, day_number, title, content, icon)
)
select
  tr.id as tour_id,
  it.is_summary,
  it.day_number,
  case
    when it.day_number = 1 then format('Day 1: Arrival in %s and Check-In', tr.destination_name)
    when it.day_number = 2 and it.is_summary then format('Day 2: %s Highlights and Guided Tour', tr.destination_name)
    when it.day_number = 3 and it.is_summary then format('Day 3: Explore %s and Signature Activities', tr.destination_name)
    when it.day_number = 7 then format('Day 7: Check-Out and Departure from %s', tr.destination_name)
    else it.title
  end as title,
  case
    when it.content is null then null::text
    when it.is_summary and it.day_number = 2 then
      format(
        'Enjoy a guided day around %s with curated stops, local experiences, and free time for photos and shopping.',
        tr.destination_name
      )
    when not it.is_summary and it.day_number = 1 then
      format(
        'Welcome to %s! Our team will assist with arrival coordination and transfer arrangements so you can settle in comfortably before the activities begin.',
        tr.destination_name
      )
    when not it.is_summary and it.day_number = 2 then
      format(
        'Start your day with a guided experience across %s featuring key highlights, local favorites, and time to explore at your own pace.',
        tr.destination_name
      )
    when not it.is_summary and it.day_number = 3 then
      format(
        'Today focuses on signature activities in %s, with scenic stops and a balanced schedule for sightseeing, photos, and relaxation.',
        tr.destination_name
      )
    when not it.is_summary and it.day_number = 4 then
      format(
        'Discover more of %s through nature, culture, or leisure activities depending on your package schedule and local availability.',
        tr.destination_name
      )
    when not it.is_summary and it.day_number = 5 then
      format(
        'Use this flexible day to enjoy optional add-ons, rest at your accommodation, or revisit favorite spots in %s.',
        tr.destination_name
      )
    when not it.is_summary and it.day_number = 6 then
      format(
        'Spend your final full day in %s at your own pace before preparing for departure the next day.',
        tr.destination_name
      )
    when not it.is_summary and it.day_number = 7 then
      format(
        'After check-out, our team will assist with departure coordination from %s based on your confirmed travel schedule.',
        tr.destination_name
      )
    else it.content
  end as content,
  it.icon
from seeded_tours tr
cross join itinerary_templates it
on conflict (tour_id, is_summary, day_number) do update
set
  title = excluded.title,
  content = excluded.content,
  icon = excluded.icon,
  updated_at = now();
