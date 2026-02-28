create table public.destinations (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  image_src text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index destinations_active_idx on public.destinations (is_active);

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

create function public.set_destinations_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_destinations_updated_at
before update on public.destinations
for each row
execute function public.set_destinations_updated_at();
