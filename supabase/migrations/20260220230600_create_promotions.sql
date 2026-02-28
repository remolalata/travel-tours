create table public.promotions (
  id bigserial primary key,
  slug text not null unique,
  label text not null,
  badge_class text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index promotions_active_idx on public.promotions (is_active);

alter table public.promotions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'promotions' and policyname = 'promotions_select_public'
  ) then
    create policy "promotions_select_public"
    on public.promotions
    for select
    to anon, authenticated
    using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'promotions' and policyname = 'promotions_write_admin_only'
  ) then
    create policy "promotions_write_admin_only"
    on public.promotions
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

create function public.set_promotions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_promotions_updated_at
before update on public.promotions
for each row
execute function public.set_promotions_updated_at();
