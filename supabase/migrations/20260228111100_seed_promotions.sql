insert into public.promotions (slug, label, badge_class, description)
values
  ('promo-20-off', '20% OFF', 'bg-accent-1', 'Seeded from existing home/listing hardcoded promo badge')
on conflict (slug) do update
set
  label = excluded.label,
  badge_class = excluded.badge_class,
  description = excluded.description,
  is_active = true,
  updated_at = now();
