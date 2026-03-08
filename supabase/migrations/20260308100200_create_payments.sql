create table if not exists public.payments (
  id bigserial primary key,
  booking_id bigint not null references public.bookings(id) on update cascade on delete cascade,
  payment_reference text not null unique,
  payment_type text not null check (payment_type in ('full', 'downpayment', 'balance', 'refund')),
  payment_method text,
  provider text,
  provider_reference text unique,
  provider_checkout_session_id text unique,
  provider_payment_intent_id text unique,
  amount numeric(12,2) not null check (amount >= 0),
  currency char(3) not null default 'PHP',
  payment_status text not null check (
    payment_status in ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')
  ),
  attempted_at timestamptz not null default now(),
  paid_at timestamptz,
  failed_at timestamptz,
  refunded_at timestamptz,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_booking_id_idx on public.payments (booking_id);
create index if not exists payments_booking_status_idx on public.payments (booking_id, payment_status);
create index if not exists payments_provider_idx on public.payments (provider);
create index if not exists payments_attempted_at_idx on public.payments (attempted_at desc);

alter table public.payments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'payments' and policyname = 'payments_select_own'
  ) then
    create policy "payments_select_own"
    on public.payments
    for select
    to authenticated
    using (
      exists (
        select 1
        from public.bookings b
        where b.id = payments.booking_id
          and b.user_id = auth.uid()
      )
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'payments' and policyname = 'payments_select_admin_only'
  ) then
    create policy "payments_select_admin_only"
    on public.payments
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
    where schemaname = 'public' and tablename = 'payments' and policyname = 'payments_write_admin_only'
  ) then
    create policy "payments_write_admin_only"
    on public.payments
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

create or replace function public.set_payments_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row
execute function public.set_payments_updated_at();
