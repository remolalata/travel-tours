-- Tours + single-page content tables + seed data

create table if not exists public.tour_types (
  id bigserial primary key,
  slug text not null unique,
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tour_types_active_idx on public.tour_types (is_active);

alter table public.tour_types enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_types' and policyname = 'tour_types_select_public'
  ) then
    create policy "tour_types_select_public"
    on public.tour_types
    for select
    to anon, authenticated
    using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_types' and policyname = 'tour_types_write_admin_only'
  ) then
    create policy "tour_types_write_admin_only"
    on public.tour_types
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

create or replace function public.set_tour_types_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tour_types_updated_at on public.tour_types;
create trigger set_tour_types_updated_at
before update on public.tour_types
for each row
execute function public.set_tour_types_updated_at();

create table if not exists public.promotions (
  id bigserial primary key,
  slug text not null unique,
  label text not null,
  badge_class text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promotions_active_idx on public.promotions (is_active);

alter table public.promotions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'promotions' and policyname = 'promotions_select_public'
  ) then
    create policy "promotions_select_public"
    on public.promotions
    for select
    to anon, authenticated
    using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'promotions' and policyname = 'promotions_write_admin_only'
  ) then
    create policy "promotions_write_admin_only"
    on public.promotions
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

create or replace function public.set_promotions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_promotions_updated_at on public.promotions;
create trigger set_promotions_updated_at
before update on public.promotions
for each row
execute function public.set_promotions_updated_at();

create table if not exists public.tours (
  id bigint primary key,
  slug text not null unique,
  destination_id bigint not null references public.destinations(id) on update cascade on delete restrict,
  tour_type_id bigint references public.tour_types(id) on update cascade on delete set null,
  title text not null,
  location text not null,
  image_src text not null,
  main_image_src text not null,
  images text[] not null default '{}',
  duration_label text not null,
  price numeric(12,2) not null check (price >= 0),
  original_price numeric(12,2) check (original_price >= 0),
  description text,
  is_featured boolean not null default false,
  is_popular boolean not null default false,
  is_top_trending boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reconcile schema if an earlier failed run created old columns.
alter table public.tours add column if not exists tour_type_id bigint;
alter table public.tours add column if not exists is_featured boolean not null default false;
alter table public.tours add column if not exists is_popular boolean not null default false;
alter table public.tours add column if not exists is_top_trending boolean not null default false;
alter table public.tours add column if not exists is_active boolean not null default true;
alter table public.tours add column if not exists created_at timestamptz not null default now();
alter table public.tours add column if not exists updated_at timestamptz not null default now();
alter table public.tours add column if not exists main_image_src text;
alter table public.tours add column if not exists images text[] not null default '{}';

alter table public.tours drop column if exists rating;
alter table public.tours drop column if exists rating_count;
alter table public.tours drop column if exists badge_text;
alter table public.tours drop column if exists badge_class;
alter table public.tours drop column if exists category;
alter table public.tours drop column if exists category_id;
alter table public.tours drop column if exists pace;
alter table public.tours drop column if exists pace_id;
alter table public.tours drop column if exists tour_type;
alter table public.tours drop column if exists latitude;
alter table public.tours drop column if exists longitude;

update public.tours
set main_image_src = image_src
where main_image_src is null;

update public.tours
set images = array[coalesce(main_image_src, image_src)]::text[]
where images is null or cardinality(images) = 0;

alter table public.tours alter column main_image_src set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tours_tour_type_id_fkey'
      and conrelid = 'public.tours'::regclass
  ) then
    alter table public.tours
    add constraint tours_tour_type_id_fkey
    foreign key (tour_type_id) references public.tour_types(id)
    on update cascade on delete set null;
  end if;
end
$$;

create index if not exists tours_destination_idx on public.tours (destination_id);
create index if not exists tours_tour_type_idx on public.tours (tour_type_id);
create index if not exists tours_popular_idx on public.tours (is_popular) where is_popular = true;
create index if not exists tours_top_trending_idx on public.tours (is_top_trending) where is_top_trending = true;
create index if not exists tours_active_idx on public.tours (is_active);

alter table public.tours enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tours' and policyname = 'tours_select_public'
  ) then
    create policy "tours_select_public"
    on public.tours
    for select
    to anon, authenticated
    using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tours' and policyname = 'tours_write_admin_only'
  ) then
    create policy "tours_write_admin_only"
    on public.tours
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

create or replace function public.set_tours_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tours_updated_at on public.tours;
create trigger set_tours_updated_at
before update on public.tours
for each row
execute function public.set_tours_updated_at();

create table if not exists public.tour_promotions (
  id bigserial primary key,
  tour_id bigint not null references public.tours(id) on update cascade on delete cascade,
  promotion_id bigint not null references public.promotions(id) on update cascade on delete cascade,
  created_at timestamptz not null default now(),
  constraint tour_promotions_unique unique (tour_id, promotion_id)
);

create index if not exists tour_promotions_tour_idx on public.tour_promotions (tour_id);
create index if not exists tour_promotions_promotion_idx on public.tour_promotions (promotion_id);

alter table public.tour_promotions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_promotions' and policyname = 'tour_promotions_select_public'
  ) then
    create policy "tour_promotions_select_public"
    on public.tour_promotions
    for select
    to anon, authenticated
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_promotions' and policyname = 'tour_promotions_write_admin_only'
  ) then
    create policy "tour_promotions_write_admin_only"
    on public.tour_promotions
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

create table if not exists public.tour_itinerary_steps (
  id bigserial primary key,
  tour_id bigint not null references public.tours(id) on update cascade on delete cascade,
  is_summary boolean not null default false,
  day_number integer not null check (day_number > 0),
  title text not null,
  content text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tour_itinerary_steps_unique_row unique (tour_id, is_summary, day_number)
);

create index if not exists tour_itinerary_steps_tour_idx on public.tour_itinerary_steps (tour_id, is_summary, day_number);

alter table public.tour_itinerary_steps enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_itinerary_steps' and policyname = 'tour_itinerary_steps_select_public'
  ) then
    create policy "tour_itinerary_steps_select_public"
    on public.tour_itinerary_steps
    for select
    to anon, authenticated
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tour_itinerary_steps' and policyname = 'tour_itinerary_steps_write_admin_only'
  ) then
    create policy "tour_itinerary_steps_write_admin_only"
    on public.tour_itinerary_steps
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

create or replace function public.set_tour_itinerary_steps_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tour_itinerary_steps_updated_at on public.tour_itinerary_steps;
create trigger set_tour_itinerary_steps_updated_at
before update on public.tour_itinerary_steps
for each row
execute function public.set_tour_itinerary_steps_updated_at();

create table if not exists public.tour_inclusions (
  id bigserial primary key,
  tour_id bigint not null references public.tours(id) on update cascade on delete cascade,
  item_type text not null check (item_type in ('included', 'excluded')),
  item_order integer not null check (item_order > 0),
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tour_inclusions_unique_row unique (tour_id, item_type, item_order)
);

create index if not exists tour_inclusions_tour_idx on public.tour_inclusions (tour_id, item_type, item_order);

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

create or replace function public.set_tour_inclusions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tour_inclusions_updated_at on public.tour_inclusions;
create trigger set_tour_inclusions_updated_at
before update on public.tour_inclusions
for each row
execute function public.set_tour_inclusions_updated_at();

do $$
begin
  if to_regclass('public.tour_reviews') is not null and to_regclass('public.reviews') is null then
    alter table public.tour_reviews rename to reviews;
  end if;
end
$$;

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

alter table public.reviews add column if not exists rating integer;
alter table public.reviews add column if not exists booking_id bigint;
alter table public.reviews add column if not exists destination_id bigint;
alter table public.reviews drop column if exists reviewer_name;
alter table public.reviews drop column if exists reviewer_avatar_url;
alter table public.reviews drop column if exists review_month;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reviews'
      and column_name = 'stars'
  ) then
    execute 'update public.reviews set rating = coalesce(rating, stars)';
    execute 'alter table public.reviews drop column stars';
  end if;
end
$$;

update public.reviews
set rating = 5
where rating is null;

update public.reviews r
set destination_id = b.destination_id
from public.bookings b
where b.id = r.booking_id
  and r.destination_id is null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reviews'
      and column_name = 'tour_id'
  ) then
    execute '
      update public.reviews r
      set destination_id = t.destination_id
      from public.tours t
      where t.id = r.tour_id
        and r.destination_id is null
    ';
  end if;
end
$$;

delete from public.reviews
where booking_id is null or destination_id is null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reviews'
      and column_name = 'tour_id'
  ) then
    alter table public.reviews drop column tour_id;
  end if;
end
$$;

alter table public.reviews
alter column rating set not null;
alter table public.reviews
alter column booking_id set not null;
alter table public.reviews
alter column destination_id set not null;

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'tour_reviews_unique_seed'
      and conrelid = 'public.reviews'::regclass
  ) then
    alter table public.reviews drop constraint tour_reviews_unique_seed;
  end if;

  if exists (
    select 1 from pg_constraint
    where conname = 'tour_reviews_booking_unique'
      and conrelid = 'public.reviews'::regclass
  ) then
    alter table public.reviews drop constraint tour_reviews_booking_unique;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'reviews_booking_unique'
      and conrelid = 'public.reviews'::regclass
  ) then
    alter table public.reviews add constraint reviews_booking_unique unique (booking_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'reviews_rating_check'
      and conrelid = 'public.reviews'::regclass
  ) then
    alter table public.reviews add constraint reviews_rating_check check (rating >= 1 and rating <= 5);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'reviews_booking_id_fkey'
      and conrelid = 'public.reviews'::regclass
  ) then
    alter table public.reviews
    add constraint reviews_booking_id_fkey
    foreign key (booking_id) references public.bookings(id)
    on update cascade on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'reviews_destination_id_fkey'
      and conrelid = 'public.reviews'::regclass
  ) then
    alter table public.reviews
    add constraint reviews_destination_id_fkey
    foreign key (destination_id) references public.destinations(id)
    on update cascade on delete cascade;
  end if;
end
$$;

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

drop trigger if exists set_tour_reviews_updated_at on public.reviews;
drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
before update on public.reviews
for each row
execute function public.set_reviews_updated_at();

drop trigger if exists validate_tour_review_booking on public.reviews;
drop trigger if exists validate_review_booking on public.reviews;
create trigger validate_review_booking
before insert or update of booking_id, destination_id, user_id
on public.reviews
for each row
execute function public.validate_review_booking();

insert into public.tour_types (slug, name)
values
  ('island-hopping', 'Island Hopping'),
  ('beach-getaway', 'Beach Getaway'),
  ('city-tour', 'City Tour'),
  ('cultural-heritage', 'Cultural & Heritage'),
  ('family-package', 'Family Package'),
  ('honeymoon-package', 'Honeymoon Package'),
  ('international-tour', 'International Tour'),
  ('adventure-tour', 'Adventure Tour')
on conflict (slug) do update
set
  name = excluded.name,
  is_active = true,
  updated_at = now();

insert into public.promotions (slug, label, badge_class, description)
values
  ('promo-20-off', '20% OFF', 'bg-accent-1', 'Seeded from existing home/listing hardcoded promo badge')
on conflict (slug) do update
set
  label = excluded.label,
  badge_class = excluded.badge_class,
  description = excluded.description,
  is_active = true,
  updated_at = now();

insert into public.tours (
  id,
  slug,
  destination_id,
  tour_type_id,
  title,
  location,
  image_src,
  main_image_src,
  images,
  duration_label,
  price,
  original_price,
  description,
  is_featured,
  is_popular,
  is_top_trending,
  is_active
)
with tour_seed as (
  select * from (
    values
      (1, 'boracay-island-hopping-and-white-beach-leisure-escape', 'boracay', 'island-hopping', 'Boracay Island Hopping and White Beach Leisure Escape', 'Boracay, Philippines', '/img/tourCards/boracay.webp', '4 days', 10888.00::numeric, null::numeric, null::text, false, true, true, true),
      (2, 'el-nido-lagoons-and-island-hopping-adventure', 'palawan', 'island-hopping', 'El Nido Lagoons and Island Hopping Adventure', 'Palawan, Philippines', '/img/tourCards/el-nido.webp', '4 days', 14500.00::numeric, null::numeric, null::text, false, true, true, true),
      (3, 'cebu-city-heritage-tour-and-southern-coast-getaway', 'cebu', 'cultural-heritage', 'Cebu City Heritage Tour and Southern Coast Getaway', 'Cebu, Philippines', '/img/tourCards/cebu-heritage.webp', '4 days', 12890.00::numeric, null::numeric, null::text, false, true, true, true),
      (4, 'chocolate-hills-tarsier-sanctuary-and-loboc-river-cruise', 'bohol', 'adventure-tour', 'Chocolate Hills, Tarsier Sanctuary and Loboc River Cruise', 'Bohol, Philippines', '/img/tourCards/chocolate-hills.webp', '4 days', 11990.00::numeric, null::numeric, null::text, false, true, true, true),
      (5, 'siargao-surf-and-sohoton-cove-island-experience', 'siargao', 'adventure-tour', 'Siargao Surf and Sohoton Cove Island Experience', 'Siargao, Philippines', '/img/tourCards/siargao-surf.webp', '4 days', 13950.00::numeric, null::numeric, null::text, false, true, true, true),
      (6, 'baguio-highlands-escape-with-city-and-nature-sights', 'baguio', 'city-tour', 'Baguio Highlands Escape with City and Nature Sights', 'Baguio, Philippines', '/img/tourCards/baguio-highlands.webp', '4 days', 8990.00::numeric, null::numeric, null::text, false, true, true, true),
      (7, 'singapore-city-highlights-and-sentosa-fun-adventure', 'singapore', 'city-tour', 'Singapore City Highlights and Sentosa Fun Adventure', 'Singapore', '/img/tourCards/singapore-city.webp', '4 days', 23888.00::numeric, null::numeric, null::text, false, true, true, true),
      (8, 'bangkok-city-tour-with-floating-market-and-railway-experience', 'bangkok', 'city-tour', 'Bangkok City Tour with Floating Market and Railway Experience', 'Bangkok, Thailand', '/img/tourCards/bangkok-city.webp', '4 days', 25888.00::numeric, null::numeric, null::text, false, true, true, true),
      (9, 'boracay-island-hopping-adventure-with-beachside-lunch', 'boracay', 'island-hopping', 'Boracay Island Hopping Adventure with Beachside Lunch', 'Boracay, Philippines', '/img/tourCards/3/1.png', '2 Days 1 Night', 9888.00::numeric, 12360.00::numeric, 'A must-try Boracay escape with island hopping, crystal-clear waters, and chill beach vibes.', false, false, false, true),
      (10, 'el-nido-lagoons-and-island-stops-with-lunch-tour', 'palawan', 'island-hopping', 'El Nido Lagoons and Island Stops with Lunch Tour', 'Palawan, Philippines', '/img/tourCards/3/2.png', '2 Days 1 Night', 11200.00::numeric, 12800.00::numeric, 'Discover El Nido''s iconic lagoons and beaches in one unforgettable island-hopping experience.', false, false, false, true),
      (11, 'bangkok-city-and-floating-market-day-tour-experience', 'bangkok', 'city-tour', 'Bangkok City and Floating Market Day Tour Experience', 'Bangkok, Thailand', '/img/tourCards/3/3.png', '2 Days 1 Night', 15888.00::numeric, 17950.00::numeric, 'Explore Bangkok''s city highlights and cultural markets with a smooth, guided tour plan.', true, false, false, true),
      (12, 'singapore-city-highlights-and-marina-bay-experience', 'singapore', 'city-tour', 'Singapore City Highlights and Marina Bay Experience', 'Singapore', '/img/tourCards/3/4.png', '2 Days 1 Night', 18250.00::numeric, 19900.00::numeric, 'Enjoy modern city attractions, iconic skyline views, and curated stops across Singapore.', false, false, false, true),
      (13, 'cebu-heritage-and-coastal-day-adventure-with-transfers', 'cebu', 'cultural-heritage', 'Cebu Heritage and Coastal Day Adventure with Transfers', 'Cebu, Philippines', '/img/tourCards/3/5.png', '2 Days 1 Night', 8600.00::numeric, 9800.00::numeric, 'Mix of culture, city sights, and coastal spots - perfect for quick but meaningful getaways.', false, false, false, true),
      (14, 'bohol-countryside-tour-with-river-cruise-and-tarsier-stop', 'bohol', 'cultural-heritage', 'Bohol Countryside Tour with River Cruise and Tarsier Stop', 'Bohol, Philippines', '/img/tourCards/3/6.png', '2 Days 1 Night', 9250.00::numeric, 10600.00::numeric, 'Visit Bohol''s top attractions including countryside views, heritage sites, and relaxing cruise.', false, false, false, true),
      (15, 'boracay-island-hopping-and-sunset-paraw-cruise', 'boracay', 'island-hopping', 'Boracay Island Hopping and Sunset Paraw Cruise', 'Boracay, Philippines', '/img/tourCards/1/1.png', '4 days', 10888.00::numeric, null::numeric, null::text, false, false, false, true),
      (16, 'white-beach-leisure-and-station-hopping-experience', 'boracay', 'beach-getaway', 'White Beach Leisure and Station Hopping Experience', 'Boracay, Philippines', '/img/tourCards/1/2.png', '4 days', 9988.00::numeric, null::numeric, null::text, false, false, false, true),
      (17, 'crystal-cove-and-snorkeling-adventure-day', 'boracay', 'adventure-tour', 'Crystal Cove and Snorkeling Adventure Day', 'Boracay, Philippines', '/img/tourCards/1/3.png', '4 days', 11250.00::numeric, null::numeric, null::text, false, false, false, true),
      (18, 'puka-beach-chill-and-scenic-coastal-tour', 'boracay', 'beach-getaway', 'Puka Beach Chill and Scenic Coastal Tour', 'Boracay, Philippines', '/img/tourCards/1/4.png', '4 days', 9650.00::numeric, null::numeric, null::text, false, false, false, true),
      (19, 'bulabog-beach-water-activities-and-fun-escape', 'boracay', 'adventure-tour', 'Bulabog Beach Water Activities and Fun Escape', 'Boracay, Philippines', '/img/tourCards/1/5.png', '4 days', 11990.00::numeric, null::numeric, null::text, false, false, false, true),
      (20, 'boracay-cafe-trail-and-sunset-viewpoints', 'boracay', 'city-tour', 'Boracay Cafe Trail and Sunset Viewpoints', 'Boracay, Philippines', '/img/tourCards/1/6.png', '4 days', 8990.00::numeric, null::numeric, null::text, false, false, false, true),
      (21, 'boracay-family-fun-with-beachfront-activities', 'boracay', 'family-package', 'Boracay Family Fun with Beachfront Activities', 'Boracay, Philippines', '/img/tourCards/1/7.png', '4 days', 12500.00::numeric, null::numeric, null::text, false, false, false, true),
      (22, 'boracay-inland-tour-and-local-culture-experience', 'boracay', 'city-tour', 'Boracay Inland Tour and Local Culture Experience', 'Boracay, Philippines', '/img/tourCards/1/8.png', '4 days', 9300.00::numeric, null::numeric, null::text, false, false, false, true),
      (23, 'boracay-nightlife-and-dinner-by-the-beach', 'boracay', 'city-tour', 'Boracay Nightlife and Dinner by the Beach', 'Boracay, Philippines', '/img/tourCards/1/9.png', '4 days', 10450.00::numeric, null::numeric, null::text, false, false, false, true),
      (24, 'ariels-point-day-trip-and-cliff-jump-adventure', 'boracay', 'adventure-tour', 'Ariel''s Point Day Trip and Cliff Jump Adventure', 'Boracay, Philippines', '/img/tourCards/1/10.png', '4 days', 13400.00::numeric, null::numeric, null::text, false, false, false, true),
      (25, 'boracay-couple-escape-with-romantic-sunset-cruise', 'boracay', 'honeymoon-package', 'Boracay Couple Escape with Romantic Sunset Cruise', 'Boracay, Philippines', '/img/tourCards/1/11.png', '4 days', 11888.00::numeric, null::numeric, null::text, false, false, false, true),
      (26, 'all-in-boracay-best-of-island-experience', 'boracay', 'adventure-tour', 'All-In Boracay Best of Island Experience', 'Boracay, Philippines', '/img/tourCards/1/12.png', '4 days', 13888.00::numeric, null::numeric, null::text, false, false, false, true)
  ) as s(
    id,
    slug,
    destination_slug,
    tour_type_slug,
    title,
    location,
    image_src,
    duration_label,
    price,
    original_price,
    description,
    is_featured,
    is_popular,
    is_top_trending,
    is_active
  )
)
select
  s.id,
  s.slug,
  d.id as destination_id,
  tt.id as tour_type_id,
  s.title,
  s.location,
  s.image_src,
  s.image_src as main_image_src,
  array[
    s.image_src,
    '/img/tourSingle/1/1.png',
    '/img/tourSingle/1/2.png',
    '/img/tourSingle/1/3.png',
    '/img/tourSingle/1/4.png'
  ]::text[] as images,
  s.duration_label,
  s.price,
  s.original_price,
  s.description,
  s.is_featured,
  s.is_popular,
  s.is_top_trending,
  s.is_active
from tour_seed s
join public.destinations d on d.slug = s.destination_slug
left join public.tour_types tt on tt.slug = s.tour_type_slug
on conflict (id) do update
set
  slug = excluded.slug,
  destination_id = excluded.destination_id,
  tour_type_id = excluded.tour_type_id,
  title = excluded.title,
  location = excluded.location,
  image_src = excluded.image_src,
  main_image_src = excluded.main_image_src,
  images = excluded.images,
  duration_label = excluded.duration_label,
  price = excluded.price,
  original_price = excluded.original_price,
  description = excluded.description,
  is_featured = excluded.is_featured,
  is_popular = excluded.is_popular,
  is_top_trending = excluded.is_top_trending,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.tour_promotions (tour_id, promotion_id)
select
  t.id as tour_id,
  pr.id as promotion_id
from public.tours t
join public.promotions pr
  on pr.slug = 'promo-20-off'
where t.id = 9
on conflict (tour_id, promotion_id) do nothing;

insert into public.tour_inclusions (tour_id, item_type, item_order, content)
with inclusion_templates as (
  select * from (
    values
      ('included', 1, 'Roundtrip airfare, baggage allowance, and terminal fees'),
      ('included', 2, 'Local taxes and environmental fees'),
      ('included', 3, 'Hotel pick-up and drop-off via air-conditioned van'),
      ('included', 4, 'Travel insurance and transfer to private pier'),
      ('included', 5, 'Daily breakfast and bottled water during tours'),
      ('included', 6, 'DOT-accredited tour guide'),
      ('excluded', 1, 'Personal expenses and souvenirs'),
      ('excluded', 2, 'Tips and gratuities'),
      ('excluded', 3, 'Alcoholic beverages')
  ) as t(item_type, item_order, content)
)
select
  tr.id as tour_id,
  it.item_type,
  it.item_order,
  it.content
from public.tours tr
cross join inclusion_templates it
on conflict (tour_id, item_type, item_order) do update
set
  content = excluded.content,
  updated_at = now();

insert into public.tour_itinerary_steps (tour_id, is_summary, day_number, title, content, icon)
with itinerary_templates as (
  select * from (
    values
      (true, 1, 'Day 1: Airport Pick-Up and Hotel Check-In', null::text, 'icon-pin'),
      (true, 2, 'Day 2: City Highlights and Cultural Tour', 'Pagdating sa destination, we''ll handle your transfers para hassle-free. On Day 2, enjoy a guided city and culture experience with photo stops, local food options, and free time for shopping.', null::text),
      (true, 3, 'Day 3: Island Hopping and Beach Time', null::text, null::text),
      (true, 4, 'Day 4: Nature Adventure and Local Experience', null::text, null::text),
      (true, 5, 'Day 5: Leisure Morning and Optional Activities', null::text, null::text),
      (true, 6, 'Day 6: Free Day and Sunset Experience', null::text, null::text),
      (true, 7, 'Day 7: Check-Out and Airport Transfer', null::text, 'icon-flag'),
      (false, 1, 'Day 1: Airport Pick-Up and Hotel Check-In', 'Welcome to your destination! Our team will meet you at the airport and transfer you directly to your hotel. First day is for rest, quick orientation, and light exploration at your own pace.', 'icon-pin'),
      (false, 2, 'Day 2: City Highlights and Cultural Tour', 'Start your day with breakfast, then join a guided city tour covering key landmarks, heritage spots, and local favorites. May free time din for cafe hopping or pasalubong shopping.', null::text),
      (false, 3, 'Day 3: Island Hopping and Beach Time', 'Enjoy a full-day island hopping adventure with scenic stops, swimming spots, and lunch by the beach. Perfect day for photos, relaxation, and bonding with family or barkada.', null::text),
      (false, 4, 'Day 4: Nature Adventure and Local Experience', 'Explore nature attractions such as hills, rivers, caves, or eco parks depending on your package. Includes guided activities and local cultural immersion for a more meaningful trip.', null::text),
      (false, 5, 'Day 5: Leisure Morning and Optional Activities', 'This is your flexible day-sleep in, enjoy hotel amenities, or add optional tours like spa, food crawl, or water activities. Great time to personalize your getaway.', null::text),
      (false, 6, 'Day 6: Free Day and Sunset Experience', 'Spend your final full day your way. Chill at the beach, explore nearby spots, or enjoy a sunset cruise experience. Relax mode before heading home.', null::text),
      (false, 7, 'Day 7: Check-Out and Airport Transfer', 'After breakfast, check out from the hotel and enjoy your scheduled transfer to the airport. Salamat and we hope to see you again on your next Travel & Tours escape!', 'icon-flag')
  ) as t(is_summary, day_number, title, content, icon)
)
select
  tr.id as tour_id,
  it.is_summary,
  it.day_number,
  it.title,
  it.content,
  it.icon
from public.tours tr
cross join itinerary_templates it
on conflict (tour_id, is_summary, day_number) do update
set
  title = excluded.title,
  content = excluded.content,
  icon = excluded.icon,
  updated_at = now();

delete from public.reviews r
using public.bookings b
where b.id = r.booking_id
  and (
    b.booking_status <> 'completed'
    or b.customer_user_id is null
  );

delete from public.reviews r
where not exists (
  select 1
  from public.bookings b
  where b.id = r.booking_id
);

insert into public.reviews (
  destination_id,
  booking_id,
  user_id,
  review_title,
  review_text,
  rating,
  is_published,
  created_at
)
with review_templates as (
  select * from (
    values
      (1, 'Excellent planning and smooth execution', 'Everything was organized from airport pickup to the final transfer. The itinerary was clear, the schedule was on time, and communication was fast throughout the trip.'),
      (2, 'Great value and professional support', 'The package delivered exactly what was promised. The hotel, transport, and tour coordination were reliable, and the support team quickly answered every question we had.'),
      (3, 'Memorable experience with no hassle', 'This was one of our easiest trips to date. The destination highlights were well chosen, logistics were seamless, and the overall experience felt premium and stress-free.')
  ) as t(reviewer_order, review_title, review_text)
),
eligible_bookings as (
  select
    b.id as booking_id,
    b.customer_user_id as user_id,
    b.destination_id,
    row_number() over (order by b.booked_at desc nulls last, b.id desc) as row_id
  from public.bookings b
  where b.booking_status = 'completed'
    and b.customer_user_id is not null
),
seed_rows as (
  select
    eb.destination_id,
    eb.booking_id,
    eb.user_id,
    eb.row_id,
    rt.review_title,
    rt.review_text
  from eligible_bookings eb
  join review_templates rt
    on rt.reviewer_order = ((eb.row_id - 1) % 3) + 1
)
select
  sr.destination_id,
  sr.booking_id,
  sr.user_id,
  sr.review_title,
  sr.review_text,
  case
    when mod(abs(hashtextextended(sr.booking_id::text, 42)), 10) < 7 then 5
    when mod(abs(hashtextextended(sr.booking_id::text, 42)), 10) < 9 then 4
    else 3
  end as rating,
  true as is_published,
  (b.booked_at + interval '2 days') as created_at
from seed_rows sr
join public.bookings b
  on b.id = sr.booking_id
on conflict (booking_id) do update
set
  destination_id = excluded.destination_id,
  user_id = excluded.user_id,
  review_title = excluded.review_title,
  review_text = excluded.review_text,
  rating = excluded.rating,
  is_published = excluded.is_published,
  updated_at = now();
