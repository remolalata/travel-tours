create table public.tour_promotions (
  id bigserial primary key,
  tour_id bigint not null references public.tours(id) on update cascade on delete cascade,
  promotion_id bigint not null references public.promotions(id) on update cascade on delete cascade,
  created_at timestamptz not null default now(),
  constraint tour_promotions_unique unique (tour_id, promotion_id)
);

create index tour_promotions_tour_idx on public.tour_promotions (tour_id);
create index tour_promotions_promotion_idx on public.tour_promotions (promotion_id);

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
