create table if not exists public.reviews (
  id bigserial primary key,
  destination_id bigint not null references public.destinations(id) on update cascade on delete cascade,
  booking_id bigint not null references public.bookings(id) on update cascade on delete cascade,
  user_id uuid not null references public.users(user_id) on update cascade on delete cascade,
  review_title text not null,
  review_text text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_booking_unique unique (booking_id)
);

create index if not exists reviews_destination_idx on public.reviews (destination_id, created_at desc);
create index if not exists reviews_user_idx on public.reviews (user_id);
create index if not exists reviews_booking_idx on public.reviews (booking_id);

create or replace function public.validate_review_booking()
returns trigger
language plpgsql
as $$
declare
  booking_customer_id uuid;
  booking_status_value text;
  booking_destination_id bigint;
begin
  select
    b.user_id,
    b.booking_status,
    t.destination_id
  into
    booking_customer_id,
    booking_status_value,
    booking_destination_id
  from public.bookings b
  join public.tours t
    on t.id = b.tour_id
  where b.id = new.booking_id;

  if booking_customer_id is null then
    raise exception 'Booking % is missing or not linked to a customer', new.booking_id;
  end if;

  if booking_status_value <> 'completed' then
    raise exception 'Reviews are only allowed for completed bookings';
  end if;

  if booking_customer_id <> new.user_id then
    raise exception 'Review user must match the booking customer';
  end if;

  if booking_destination_id <> new.destination_id then
    raise exception 'Review destination must match the booking destination';
  end if;

  return new;
end;
$$;

alter table public.reviews enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'reviews' and policyname = 'reviews_select_public'
  ) then
    create policy "reviews_select_public"
    on public.reviews
    for select
    to anon, authenticated
    using (is_published = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'reviews' and policyname = 'reviews_insert_own_or_admin'
  ) then
    create policy "reviews_insert_own_or_admin"
    on public.reviews
    for insert
    to authenticated
    with check (
      auth.uid() = user_id
      or exists (
        select 1 from public.users u
        where u.user_id = auth.uid() and u.role = 'admin'
      )
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'reviews' and policyname = 'reviews_update_own_or_admin'
  ) then
    create policy "reviews_update_own_or_admin"
    on public.reviews
    for update
    to authenticated
    using (
      auth.uid() = user_id
      or exists (
        select 1 from public.users u
        where u.user_id = auth.uid() and u.role = 'admin'
      )
    )
    with check (
      auth.uid() = user_id
      or exists (
        select 1 from public.users u
        where u.user_id = auth.uid() and u.role = 'admin'
      )
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'reviews' and policyname = 'reviews_delete_own_or_admin'
  ) then
    create policy "reviews_delete_own_or_admin"
    on public.reviews
    for delete
    to authenticated
    using (
      auth.uid() = user_id
      or exists (
        select 1 from public.users u
        where u.user_id = auth.uid() and u.role = 'admin'
      )
    );
  end if;
end
$$;

create or replace function public.set_reviews_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
before update on public.reviews
for each row
execute function public.set_reviews_updated_at();

drop trigger if exists validate_review_booking on public.reviews;
create trigger validate_review_booking
before insert or update of booking_id, destination_id, user_id
on public.reviews
for each row
execute function public.validate_review_booking();
