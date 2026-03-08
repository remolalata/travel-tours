insert into public.tour_types (slug, name)
values
  ('island-hopping', 'Island Hopping'),
  ('beach-getaway', 'Beach Getaway'),
  ('city-tour', 'City Tour'),
  ('cultural-heritage', 'Cultural & Heritage'),
  ('family-package', 'Family Package'),
  ('honeymoon-package', 'Honeymoon Package'),
  ('international-tour', 'International Tour'),
  ('adventure-tour', 'Adventure Tour')
on conflict (slug) do update
set
  name = excluded.name,
  is_active = true,
  updated_at = now();
