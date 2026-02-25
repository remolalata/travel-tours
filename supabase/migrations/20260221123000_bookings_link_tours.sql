-- Link bookings to tours and backfill seeded/existing rows

alter table public.bookings
add column if not exists tour_id bigint;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_tour_id_fkey'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
    add constraint bookings_tour_id_fkey
    foreign key (tour_id) references public.tours(id)
    on update cascade on delete set null;
  end if;
end
$$;

create index if not exists bookings_tour_id_idx on public.bookings (tour_id);

with destination_tours as (
  select
    t.id,
    t.destination_id,
    t.title,
    row_number() over (partition by t.destination_id order by t.id) as destination_tour_rank,
    count(*) over (partition by t.destination_id) as destination_tour_count
  from public.tours t
  where t.is_active = true
),
ranked_matches as (
  select
    b.id as booking_id,
    dt.id as tour_id,
    dt.title as tour_title,
    row_number() over (
      partition by b.id
      order by
        case when lower(dt.title) = lower(b.package_title) then 0 else 1 end,
        case
          when dt.destination_tour_rank = (((b.id - 1) % dt.destination_tour_count) + 1) then 0
          else 1
        end,
        dt.destination_tour_rank,
        dt.id
    ) as match_rank
  from public.bookings b
  join destination_tours dt
    on dt.destination_id = b.destination_id
)
update public.bookings b
set
  tour_id = rm.tour_id,
  package_title = rm.tour_title,
  updated_at = now()
from ranked_matches rm
where rm.booking_id = b.id
  and rm.match_rank = 1
  and (
    b.tour_id is distinct from rm.tour_id
    or b.package_title is distinct from rm.tour_title
  );
