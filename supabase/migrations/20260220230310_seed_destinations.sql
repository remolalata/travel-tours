insert into public.destinations (slug, name, image_src)
values
  ('boracay', 'Boracay', '/img/destinations/boracay.webp'),
  ('palawan', 'Palawan', '/img/destinations/palawan.webp'),
  ('cebu', 'Cebu', '/img/destinations/cebu.webp'),
  ('bohol', 'Bohol', '/img/destinations/bohol.webp'),
  ('siargao', 'Siargao', '/img/destinations/siargao.webp'),
  ('baguio', 'Baguio', '/img/destinations/baguio.webp'),
  ('singapore', 'Singapore', '/img/destinations/singapore.webp'),
  ('bangkok', 'Bangkok', '/img/destinations/bangkok.webp')
on conflict (slug) do update
set
  name = excluded.name,
  image_src = excluded.image_src;
