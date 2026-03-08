create table public.tours (
  id bigint primary key,
  destination_id bigint not null references public.destinations(id) on update cascade on delete restrict,
  tour_type_id bigint references public.tour_types(id) on update cascade on delete set null,
  slug text not null unique,
  title text not null,
  location text not null,
  image_src text not null,
  images text[] not null default '{}',
  terms text not null default '<p>Standard tour terms and conditions apply.</p>',
  description text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  is_featured boolean not null default false,
  is_popular boolean not null default false,
  is_top_trending boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tours_destination_idx on public.tours (destination_id);
create index tours_tour_type_idx on public.tours (tour_type_id);
create index tours_popular_idx on public.tours (is_popular) where is_popular = true;
create index tours_top_trending_idx on public.tours (is_top_trending) where is_top_trending = true;
create index tours_status_idx on public.tours (status);

alter table public.tours enable row level security;

create policy "tours_select_public"
on public.tours
for select
to anon, authenticated
using (status = 'active');

create policy "tours_write_admin_only"
on public.tours
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

create function public.set_tours_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_tours_updated_at
before update on public.tours
for each row
execute function public.set_tours_updated_at();
