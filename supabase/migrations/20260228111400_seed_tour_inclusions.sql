insert into public.tour_inclusions (tour_id, item_type, item_order, content)
with seeded_tours as (
  select
    t.id,
    t.title,
    t.location,
    coalesce(nullif(split_part(t.location, ',', 1), ''), t.location) as destination_name
  from public.tours t
),
inclusion_templates as (
  select * from (
    values
      ('included', 1),
      ('included', 2),
      ('included', 3),
      ('included', 4),
      ('included', 5),
      ('included', 6),
      ('excluded', 1),
      ('excluded', 2),
      ('excluded', 3)
  ) as t(item_type, item_order)
)
select
  tr.id as tour_id,
  it.item_type,
  it.item_order,
  case
    when it.item_type = 'included' and it.item_order = 1 then
      format('Coordinated transfers and arrival assistance within %s.', tr.destination_name)
    when it.item_type = 'included' and it.item_order = 2 then
      format('Selected guided activities and destination highlights in %s.', tr.destination_name)
    when it.item_type = 'included' and it.item_order = 3 then
      'Tour coordination support and day-by-day itinerary briefing'
    when it.item_type = 'included' and it.item_order = 4 then
      'Applicable local taxes and standard service handling fees'
    when it.item_type = 'included' and it.item_order = 5 then
      'Bottled water during guided activities (where available)'
    when it.item_type = 'included' and it.item_order = 6 then
      format('Travel & Tours support for the package: %s', tr.title)
    when it.item_type = 'excluded' and it.item_order = 1 then
      'Personal expenses, shopping, and optional add-on activities'
    when it.item_type = 'excluded' and it.item_order = 2 then
      'Tips and gratuities for guides, drivers, and hotel staff'
    when it.item_type = 'excluded' and it.item_order = 3 then
      format('Items not explicitly listed in the inclusions for the %s package', tr.destination_name)
    else
      'Refer to final booking confirmation for complete package coverage'
  end as content
from seeded_tours tr
cross join inclusion_templates it
on conflict (tour_id, item_type, item_order) do update
set
  content = excluded.content,
  updated_at = now();
