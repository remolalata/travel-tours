-- Public-safe reviewer profile projection for read-only review UIs.
create or replace view public.public_reviewer_profiles as
select
  p.user_id,
  p.first_name,
  p.last_name,
  p.avatar_url
from public.profiles p;

grant select on public.public_reviewer_profiles to anon, authenticated;
