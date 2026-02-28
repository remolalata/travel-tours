create table public.tour_types (
  id bigserial primary key,
  slug text not null unique,
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tour_types_active_idx on public.tour_types (is_active);

alter table public.tour_types enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_types' and policyname = 'tour_types_select_public'
  ) then
    create policy "tour_types_select_public"
    on public.tour_types
    for select
    to anon, authenticated
    using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_types' and policyname = 'tour_types_write_admin_only'
  ) then
    create policy "tour_types_write_admin_only"
    on public.tour_types
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

create function public.set_tour_types_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_tour_types_updated_at
before update on public.tour_types
for each row
execute function public.set_tour_types_updated_at();
