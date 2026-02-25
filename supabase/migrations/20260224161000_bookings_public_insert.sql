-- Allow simulated booking submissions from guest/authenticated users.

alter table public.bookings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_insert_public'
  ) then
    create policy "bookings_insert_public"
    on public.bookings
    for insert
    to anon, authenticated
    with check (
      customer_user_id is null
      or auth.uid() = customer_user_id
    );
  end if;
end
$$;

