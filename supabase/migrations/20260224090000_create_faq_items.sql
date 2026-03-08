create table public.faq_items (
  id bigserial primary key,
  item_order integer not null check (item_order > 0),
  question text not null,
  answer text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint faq_items_unique_row unique (item_order)
);

create index faq_items_active_idx on public.faq_items (is_active, item_order);

alter table public.faq_items enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'faq_items' and policyname = 'faq_items_select_public'
  ) then
    create policy "faq_items_select_public"
    on public.faq_items
    for select
    to anon, authenticated
    using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'faq_items' and policyname = 'faq_items_write_admin_only'
  ) then
    create policy "faq_items_write_admin_only"
    on public.faq_items
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

create function public.set_faq_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_faq_items_updated_at
before update on public.faq_items
for each row
execute function public.set_faq_items_updated_at();
