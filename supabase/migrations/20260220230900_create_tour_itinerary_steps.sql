create table public.tour_itinerary_steps (
  id bigserial primary key,
  tour_id bigint not null references public.tours(id) on update cascade on delete cascade,
  is_summary boolean not null default false,
  day_number integer not null check (day_number > 0),
  title text not null,
  content text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tour_itinerary_steps_unique_row unique (tour_id, is_summary, day_number)
);

create index tour_itinerary_steps_tour_idx on public.tour_itinerary_steps (tour_id, is_summary, day_number);

alter table public.tour_itinerary_steps enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_itinerary_steps' and policyname = 'tour_itinerary_steps_select_public'
  ) then
    create policy "tour_itinerary_steps_select_public"
    on public.tour_itinerary_steps
    for select
    to anon, authenticated
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_itinerary_steps' and policyname = 'tour_itinerary_steps_write_admin_only'
  ) then
    create policy "tour_itinerary_steps_write_admin_only"
    on public.tour_itinerary_steps
    for all
    to authenticated
    using (
      exists (
        select 1 from public.users u
        where u.user_id = auth.uid() and u.role = 'admin'
      )
    )
    with check (
      exists (
        select 1 from public.users u
        where u.user_id = auth.uid() and u.role = 'admin'
      )
    );
  end if;
end
$$;

create function public.set_tour_itinerary_steps_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_tour_itinerary_steps_updated_at
before update on public.tour_itinerary_steps
for each row
execute function public.set_tour_itinerary_steps_updated_at();
