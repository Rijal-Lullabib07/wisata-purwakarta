-- Tambah kolom untuk mencatat sumber foto dari Google Places API
alter table public.destinations
  add column if not exists google_place_id  text,
  add column if not exists google_maps_url  text,
  add column if not exists photo_count      integer default 0;
