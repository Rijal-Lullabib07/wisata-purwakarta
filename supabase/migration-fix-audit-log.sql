-- ============================================================================
-- MIGRATION 2026-09-11 (REVISI 2): perbaikan constraint admin_audit_logs
-- Cara pakai: Supabase Dashboard > SQL Editor > paste seluruh file ini > Run.
-- (Jalankan SEKALI. Memperbaiki error 400 "admin_audit_logs_status_check"
--  saat menyimpan destinasi dari panel admin.)
-- ============================================================================

-- 1. Buang check constraint lama (nama bawaan Postgres dari schema versi lama)
alter table public.admin_audit_logs
  drop constraint if exists admin_audit_logs_status_check;

-- 1b. Jaga-jaga: buang constraint CHECK lain pada kolom status bila namanya
--     berbeda. (REVISI: variabel r kini dideklarasikan — penyebab error
--     "loop variable of loop over rows must be a record variable".)
do $$
declare
  r record;
begin
  for r in
    select conname
    from pg_constraint
    where conrelid = 'public.admin_audit_logs'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.admin_audit_logs drop constraint if exists %I', r.conname);
  end loop;
end $$;

-- 2. Buat ulang constraint dengan daftar nilai lengkap (termasuk crud_*)
alter table public.admin_audit_logs
  add constraint admin_audit_logs_status_check
  check (status in (
    'success', 'failure', 'locked', 'mfa_failure',
    'crud_create', 'crud_update', 'crud_delete'
  ));

-- 3. Pastikan kolom meta SEO ada (untuk DB yang dibuat sebelum kolom ini ada).
alter table public.destinations add column if not exists is_published boolean not null default true;
alter table public.destinations add column if not exists meta_title    text;
alter table public.destinations add column if not exists meta_description text;
alter table public.destinations add column if not exists storage_paths jsonb default '[]'::jsonb;

-- 4. Fungsi audit trigger dengan daftar status yang sama.
create or replace function public.log_destinations_change()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  -- Hanya admin yang sudah lolos MFA (AAL2) yang dicatat — sesuai desain keamanan.
  if coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2' then
    insert into public.admin_audit_logs (user_id, ip_address, user_agent, status)
    values (
      auth.uid(),
      null,
      'CRUD: ' || (case tg_op when 'DELETE' then old.slug else new.slug end),
      case tg_op
        when 'INSERT' then 'crud_create'
        when 'UPDATE' then 'crud_update'
        else 'crud_delete'
      end
    );
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end $$;

drop trigger if exists trg_destinations_audit on public.destinations;
create trigger trg_destinations_audit
after insert or update or delete on public.destinations
for each row execute function public.log_destinations_change();
