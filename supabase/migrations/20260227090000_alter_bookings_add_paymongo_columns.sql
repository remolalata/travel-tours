-- Add payment gateway tracking fields for PayMongo checkout integration.

alter table public.bookings
add column if not exists payment_provider text,
add column if not exists paymongo_checkout_session_id text,
add column if not exists paymongo_payment_id text,
add column if not exists paymongo_last_event_id text;

create index if not exists bookings_payment_provider_idx on public.bookings (payment_provider);
create index if not exists bookings_paymongo_checkout_session_idx
  on public.bookings (paymongo_checkout_session_id);
create index if not exists bookings_paymongo_last_event_idx
  on public.bookings (paymongo_last_event_id);

