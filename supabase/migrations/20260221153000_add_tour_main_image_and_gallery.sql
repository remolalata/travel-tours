alter table if exists public.tours
add column if not exists main_image_src text;

alter table if exists public.tours
add column if not exists images text[] not null default '{}';

update public.tours
set main_image_src = image_src
where main_image_src is null;

update public.tours
set images = array[coalesce(main_image_src, image_src)]::text[]
where images is null or cardinality(images) = 0;

alter table if exists public.tours
alter column main_image_src set not null;
