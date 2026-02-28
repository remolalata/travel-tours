create table public.reviews (
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

create index reviews_destination_idx on public.reviews (destination_id, created_at desc);
create index reviews_user_idx on public.reviews (user_id);
create index reviews_booking_idx on public.reviews (booking_id);

create function public.validate_review_booking()
returns trigger
language plpgsql
as $$
declare
  booking_customer_id uuid;
  booking_status_value text;
  booking_destination_id bigint;
begin
  select
    b.customer_user_id,
    b.booking_status,
    b.destination_id
  into
    booking_customer_id,
    booking_status_value,
    booking_destination_id
  from public.bookings b
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

create policy "reviews_select_public"
on public.reviews
for select
to anon, authenticated
using (is_published = true);

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

create function public.set_reviews_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_reviews_updated_at
before update on public.reviews
for each row
execute function public.set_reviews_updated_at();

create trigger validate_review_booking
before insert or update of booking_id, destination_id, user_id
on public.reviews
for each row
execute function public.validate_review_booking();
