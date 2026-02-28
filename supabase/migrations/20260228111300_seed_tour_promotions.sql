insert into public.tour_promotions (tour_id, promotion_id)
select
  t.id as tour_id,
  pr.id as promotion_id
from public.tours t
join public.promotions pr
  on pr.slug = 'promo-20-off'
where t.id = 9
on conflict (tour_id, promotion_id) do nothing;
