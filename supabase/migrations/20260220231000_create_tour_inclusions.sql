create table public.tour_inclusions (
  id bigserial primary key,
  tour_id bigint not null references public.tours(id) on update cascade on delete cascade,
  item_type text not null check (item_type in ('included', 'excluded')),
  item_order integer not null check (item_order > 0),
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tour_inclusions_unique_row unique (tour_id, item_type, item_order)
);

create index tour_inclusions_tour_idx on public.tour_inclusions (tour_id, item_type, item_order);

alter table public.tour_inclusions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_inclusions' and policyname = 'tour_inclusions_select_public'
  ) then
    create policy "tour_inclusions_select_public"
    on public.tour_inclusions
    for select
    to anon, authenticated
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_inclusions' and policyname = 'tour_inclusions_write_admin_only'
  ) then
    create policy "tour_inclusions_write_admin_only"
    on public.tour_inclusions
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

create function public.set_tour_inclusions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_tour_inclusions_updated_at
before update on public.tour_inclusions
for each row
execute function public.set_tour_inclusions_updated_at();
