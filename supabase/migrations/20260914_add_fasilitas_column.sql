-- Kolom fasilitas destinasi (jsonb, bisa berisi object {toilet:true} atau
-- array ['Toilet',...]). Idempotent: aman dijalankan berulang.
--
-- Jalankan di Supabase Dashboard → SQL Editor HANYA jika kolomnya belum ada
-- (cek dulu: Table Editor → destinations → apakah ada kolom "fasilitas").
-- Gejala bila kolom belum ada: simpan destinasi dari panel admin gagal dengan
-- pesan "Could not find the 'fasilitas' column of 'destinations' in the
-- schema cache".

alter table public.destinations
  add column if not exists fasilitas jsonb default '[]'::jsonb;
