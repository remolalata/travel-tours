alter table public.destinations enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public' and tablename = 'destinations' and policyname = 'destinations_write_admin_only'
  ) then
    create policy "destinations_write_admin_only"
    on public.destinations
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

insert into storage.buckets (id, name, public)
values ('destination-photos', 'destination-photos', true)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'destination_photos_select_public'
  ) then
    create policy "destination_photos_select_public"
    on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'destination-photos');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'destination_photos_write_admin_only'
  ) then
    create policy "destination_photos_write_admin_only"
    on storage.objects
    for all
    to authenticated
    using (
      bucket_id = 'destination-photos'
      and exists (
        select 1
        from public.users u
        where u.user_id = auth.uid()
          and u.role = 'admin'
      )
    )
    with check (
      bucket_id = 'destination-photos'
      and exists (
        select 1
        from public.users u
        where u.user_id = auth.uid()
          and u.role = 'admin'
      )
    );
  end if;
end
$$;
