-- Destinations table + seed data

create table if not exists public.destinations (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  image_src text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists destinations_active_idx on public.destinations (is_active);

alter table public.destinations enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'destinations' and policyname = 'destinations_select_public'
  ) then
    create policy "destinations_select_public"
    on public.destinations
    for select
    to anon, authenticated
    using (true);
  end if;
end
$$;

create or replace function public.set_destinations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_destinations_updated_at on public.destinations;
create trigger set_destinations_updated_at
before update on public.destinations
for each row
execute function public.set_destinations_updated_at();

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
