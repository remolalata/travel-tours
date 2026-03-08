create table public.quote_requests (
  id bigserial primary key,
  user_id uuid references public.users(user_id) on update cascade on delete set null,
  destination_name text not null,
  travel_start_date date not null,
  travel_end_date date not null,
  travel_date_range text not null,
  tour_type_name text not null,
  adults_count integer not null check (adults_count > 0),
  children_count integer not null default 0 check (children_count >= 0),
  budget_range text not null,
  preferred_hotel text not null,
  contact_full_name text not null,
  contact_email text not null,
  contact_phone text not null,
  notes text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quote_requests_travel_date_range_check check (travel_end_date >= travel_start_date)
);

create index quote_requests_user_idx on public.quote_requests (user_id);
create index quote_requests_submitted_at_idx on public.quote_requests (submitted_at desc);
create index quote_requests_destination_submitted_idx
  on public.quote_requests (destination_name, submitted_at desc);

alter table public.quote_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'quote_requests' and policyname = 'quote_requests_insert_public'
  ) then
    create policy "quote_requests_insert_public"
    on public.quote_requests
    for insert
    to anon, authenticated
    with check (
      user_id is null
      or auth.uid() = user_id
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'quote_requests' and policyname = 'quote_requests_select_admin_only'
  ) then
    create policy "quote_requests_select_admin_only"
    on public.quote_requests
    for select
    to authenticated
    using (
      exists (
        select 1
        from public.users u
        where u.user_id = auth.uid()
          and u.role = 'admin'
      )
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'quote_requests' and policyname = 'quote_requests_write_admin_only'
  ) then
    create policy "quote_requests_write_admin_only"
    on public.quote_requests
    for all
    to authenticated
    using (
      exists (
        select 1
        from public.users u
        where u.user_id = auth.uid()
          and u.role = 'admin'
      )
    )
    with check (
      exists (
        select 1
        from public.users u
        where u.user_id = auth.uid()
          and u.role = 'admin'
      )
    );
  end if;
end
$$;

create function public.set_quote_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_quote_requests_updated_at
before update on public.quote_requests
for each row
execute function public.set_quote_requests_updated_at();
