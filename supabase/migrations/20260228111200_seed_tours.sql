insert into public.tours (
  id,
  destination_id,
  tour_type_id,
  slug,
  title,
  location,
  image_src,
  images,
  terms,
  description,
  status,
  is_featured,
  is_popular,
  is_top_trending
)
with tour_seed as (
  select * from (
    values
      (1, 'boracay-island-hopping-and-white-beach-leisure-escape', 'boracay', 'island-hopping', 'Boracay Island Hopping and White Beach Leisure Escape', 'Boracay, Philippines', null::text, false, true, true),
      (2, 'el-nido-lagoons-and-island-hopping-adventure', 'palawan', 'island-hopping', 'El Nido Lagoons and Island Hopping Adventure', 'Palawan, Philippines', null::text, false, true, true),
      (3, 'cebu-city-heritage-tour-and-southern-coast-getaway', 'cebu', 'cultural-heritage', 'Cebu City Heritage Tour and Southern Coast Getaway', 'Cebu, Philippines', null::text, false, true, true),
      (4, 'chocolate-hills-tarsier-sanctuary-and-loboc-river-cruise', 'bohol', 'adventure-tour', 'Chocolate Hills, Tarsier Sanctuary and Loboc River Cruise', 'Bohol, Philippines', null::text, false, true, true),
      (5, 'siargao-surf-and-sohoton-cove-island-experience', 'siargao', 'adventure-tour', 'Siargao Surf and Sohoton Cove Island Experience', 'Siargao, Philippines', null::text, false, true, true),
      (6, 'baguio-highlands-escape-with-city-and-nature-sights', 'baguio', 'city-tour', 'Baguio Highlands Escape with City and Nature Sights', 'Baguio, Philippines', null::text, false, true, true),
      (7, 'singapore-city-highlights-and-sentosa-fun-adventure', 'singapore', 'city-tour', 'Singapore City Highlights and Sentosa Fun Adventure', 'Singapore', null::text, false, true, true),
      (8, 'bangkok-city-tour-with-floating-market-and-railway-experience', 'bangkok', 'city-tour', 'Bangkok City Tour with Floating Market and Railway Experience', 'Bangkok, Thailand', null::text, false, true, true),
      (9, 'boracay-island-hopping-adventure-with-beachside-lunch', 'boracay', 'island-hopping', 'Boracay Island Hopping Adventure with Beachside Lunch', 'Boracay, Philippines', 'A must-try Boracay escape with island hopping, crystal-clear waters, and chill beach vibes.', false, false, false),
      (10, 'el-nido-lagoons-and-island-stops-with-lunch-tour', 'palawan', 'island-hopping', 'El Nido Lagoons and Island Stops with Lunch Tour', 'Palawan, Philippines', 'Discover El Nido''s iconic lagoons and beaches in one unforgettable island-hopping experience.', false, false, false),
      (11, 'bangkok-city-and-floating-market-day-tour-experience', 'bangkok', 'city-tour', 'Bangkok City and Floating Market Day Tour Experience', 'Bangkok, Thailand', 'Explore Bangkok''s city highlights and cultural markets with a smooth, guided tour plan.', true, false, false),
      (12, 'singapore-city-highlights-and-marina-bay-experience', 'singapore', 'city-tour', 'Singapore City Highlights and Marina Bay Experience', 'Singapore', 'Enjoy modern city attractions, iconic skyline views, and curated stops across Singapore.', false, false, false),
      (13, 'cebu-heritage-and-coastal-day-adventure-with-transfers', 'cebu', 'cultural-heritage', 'Cebu Heritage and Coastal Day Adventure with Transfers', 'Cebu, Philippines', 'Mix of culture, city sights, and coastal spots - perfect for quick but meaningful getaways.', false, false, false),
      (14, 'bohol-countryside-tour-with-river-cruise-and-tarsier-stop', 'bohol', 'cultural-heritage', 'Bohol Countryside Tour with River Cruise and Tarsier Stop', 'Bohol, Philippines', 'Visit Bohol''s top attractions including countryside views, heritage sites, and relaxing cruise.', false, false, false),
      (15, 'boracay-island-hopping-and-sunset-paraw-cruise', 'boracay', 'island-hopping', 'Boracay Island Hopping and Sunset Paraw Cruise', 'Boracay, Philippines', null::text, false, false, false),
      (16, 'white-beach-leisure-and-station-hopping-experience', 'boracay', 'beach-getaway', 'White Beach Leisure and Station Hopping Experience', 'Boracay, Philippines', null::text, false, false, false),
      (17, 'crystal-cove-and-snorkeling-adventure-day', 'boracay', 'adventure-tour', 'Crystal Cove and Snorkeling Adventure Day', 'Boracay, Philippines', null::text, false, false, false),
      (18, 'puka-beach-chill-and-scenic-coastal-tour', 'boracay', 'beach-getaway', 'Puka Beach Chill and Scenic Coastal Tour', 'Boracay, Philippines', null::text, false, false, false),
      (19, 'bulabog-beach-water-activities-and-fun-escape', 'boracay', 'adventure-tour', 'Bulabog Beach Water Activities and Fun Escape', 'Boracay, Philippines', null::text, false, false, false),
      (20, 'boracay-cafe-trail-and-sunset-viewpoints', 'boracay', 'city-tour', 'Boracay Cafe Trail and Sunset Viewpoints', 'Boracay, Philippines', null::text, false, false, false),
      (21, 'boracay-family-fun-with-beachfront-activities', 'boracay', 'family-package', 'Boracay Family Fun with Beachfront Activities', 'Boracay, Philippines', null::text, false, false, false),
      (22, 'boracay-inland-tour-and-local-culture-experience', 'boracay', 'city-tour', 'Boracay Inland Tour and Local Culture Experience', 'Boracay, Philippines', null::text, false, false, false),
      (23, 'boracay-nightlife-and-dinner-by-the-beach', 'boracay', 'city-tour', 'Boracay Nightlife and Dinner by the Beach', 'Boracay, Philippines', null::text, false, false, false),
      (24, 'ariels-point-day-trip-and-cliff-jump-adventure', 'boracay', 'adventure-tour', 'Ariel''s Point Day Trip and Cliff Jump Adventure', 'Boracay, Philippines', null::text, false, false, false),
      (25, 'boracay-couple-escape-with-romantic-sunset-cruise', 'boracay', 'honeymoon-package', 'Boracay Couple Escape with Romantic Sunset Cruise', 'Boracay, Philippines', null::text, false, false, false),
      (26, 'all-in-boracay-best-of-island-experience', 'boracay', 'adventure-tour', 'All-In Boracay Best of Island Experience', 'Boracay, Philippines', null::text, false, false, false)
  ) as s(
    id,
    slug,
    destination_slug,
    tour_type_slug,
    title,
    location,
    description,
    is_featured,
    is_popular,
    is_top_trending
  )
)
select
  s.id,
  d.id as destination_id,
  tt.id as tour_type_id,
  s.slug,
  s.title,
  s.location,
  case s.destination_slug
    when 'boracay' then '/img/tours/boracay.webp'
    when 'palawan' then '/img/tours/el-nido.webp'
    when 'cebu' then '/img/tours/cebu-heritage.webp'
    when 'bohol' then '/img/tours/chocolate-hills.webp'
    when 'siargao' then '/img/tours/siargao-surf.webp'
    when 'baguio' then '/img/tours/baguio-highlands.webp'
    when 'singapore' then '/img/tours/singapore-city.webp'
    when 'bangkok' then '/img/tours/bangkok-city.webp'
    else '/img/tours/boracay.webp'
  end as image_src,
  array[
    '/img/tours/og-preview.webp',
    '/img/tours/baguio-highlands.webp',
    '/img/tours/bangkok-city.webp',
    '/img/tours/boracay.webp',
    '/img/tours/cebu-heritage.webp',
    '/img/tours/chocolate-hills.webp',
    '/img/tours/el-nido.webp',
    '/img/tours/siargao-surf.webp',
    '/img/tours/singapore-city.webp'
  ]::text[] as images,
  format(
    '<p>%s bookings are confirmed only after full guest details, required payments, and operator availability are completed.</p>',
    s.title
  ) as terms,
  format(
    '<p>%s</p>',
    coalesce(
      s.description,
      format('%s package with guided highlights, smooth transfers, and balanced free time.', s.title)
    )
  ) as description,
  'active' as status,
  s.is_featured,
  s.is_popular,
  s.is_top_trending
from tour_seed s
join public.destinations d on d.slug = s.destination_slug
left join public.tour_types tt on tt.slug = s.tour_type_slug
on conflict (id) do update
set
  slug = excluded.slug,
  destination_id = excluded.destination_id,
  tour_type_id = excluded.tour_type_id,
  title = excluded.title,
  location = excluded.location,
  image_src = excluded.image_src,
  images = excluded.images,
  terms = excluded.terms,
  description = excluded.description,
  status = excluded.status,
  is_featured = excluded.is_featured,
  is_popular = excluded.is_popular,
  is_top_trending = excluded.is_top_trending,
  updated_at = now();
