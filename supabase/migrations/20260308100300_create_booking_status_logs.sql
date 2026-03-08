create table if not exists public.booking_status_logs (
  id bigserial primary key,
  booking_id bigint not null references public.bookings(id) on update cascade on delete cascade,
  old_booking_status text,
  new_booking_status text,
  old_payment_status text,
  new_payment_status text,
  old_inventory_status text,
  new_inventory_status text,
  trigger_source text not null default 'system' check (
    trigger_source in ('system', 'webhook', 'admin', 'customer')
  ),
  notes text,
  created_by uuid references public.users(user_id) on update cascade on delete set null,
  created_at timestamptz not null default now(),
  constraint booking_status_logs_change_present_check check (
    old_booking_status is distinct from new_booking_status
    or old_payment_status is distinct from new_payment_status
    or old_inventory_status is distinct from new_inventory_status
    or notes is not null
  )
);

create index if not exists booking_status_logs_booking_id_idx on public.booking_status_logs (booking_id);
create index if not exists booking_status_logs_created_at_idx on public.booking_status_logs (created_at desc);
create index if not exists booking_status_logs_trigger_source_idx on public.booking_status_logs (trigger_source);

alter table public.booking_status_logs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'booking_status_logs' and policyname = 'booking_status_logs_select_own'
  ) then
    create policy "booking_status_logs_select_own"
    on public.booking_status_logs
    for select
    to authenticated
    using (
      exists (
        select 1
        from public.bookings b
        where b.id = booking_status_logs.booking_id
          and b.user_id = auth.uid()
      )
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'booking_status_logs' and policyname = 'booking_status_logs_select_admin_only'
  ) then
    create policy "booking_status_logs_select_admin_only"
    on public.booking_status_logs
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
    where schemaname = 'public' and tablename = 'booking_status_logs' and policyname = 'booking_status_logs_write_admin_only'
  ) then
    create policy "booking_status_logs_write_admin_only"
    on public.booking_status_logs
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
