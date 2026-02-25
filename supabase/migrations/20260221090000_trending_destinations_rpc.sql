create or replace function public.list_trending_destinations(max_items integer default 12)
returns table (
  id bigint,
  slug text,
  name text,
  image_src text,
  tour_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    d.id,
    d.slug,
    d.name,
    d.image_src,
    count(b.id)::bigint as tour_count
  from public.destinations d
  left join public.bookings b
    on b.destination_id = d.id
  where d.is_active = true
    and d.image_src is not null
  group by d.id, d.slug, d.name, d.image_src
  order by count(b.id) desc, d.name asc
  limit greatest(coalesce(max_items, 12), 1);
$$;

revoke all on function public.list_trending_destinations(integer) from public;
grant execute on function public.list_trending_destinations(integer) to anon;
grant execute on function public.list_trending_destinations(integer) to authenticated;
