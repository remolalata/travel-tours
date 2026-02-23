create table if not exists public.faq_items (
  id bigserial primary key,
  item_order integer not null check (item_order > 0),
  question text not null,
  answer text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint faq_items_unique_row unique (item_order)
);

create index if not exists faq_items_active_idx on public.faq_items (is_active, item_order);

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

create or replace function public.set_faq_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_faq_items_updated_at on public.faq_items;
create trigger set_faq_items_updated_at
before update on public.faq_items
for each row
execute function public.set_faq_items_updated_at();

insert into public.faq_items (item_order, question, answer, is_active)
values
  (
    1,
    'How soon will I receive booking confirmation?',
    'Most bookings are confirmed within minutes. Some partner activities may need manual confirmation within 24 hours.',
    true
  ),
  (
    2,
    'Can I change my travel dates after booking?',
    'Date changes depend on supplier policy. If your booking is flexible, we can help process date updates subject to availability.',
    true
  ),
  (
    3,
    'What happens if weather affects my tour?',
    'If an activity is cancelled due to weather, we will help arrange a rebooking or refund based on the operator terms.',
    true
  ),
  (
    4,
    'How do I request an official receipt?',
    'Send your booking reference to support and our team will provide an official receipt using the billing details on file.',
    true
  )
on conflict (item_order) do update
set
  question = excluded.question,
  answer = excluded.answer,
  is_active = excluded.is_active,
  updated_at = now();
