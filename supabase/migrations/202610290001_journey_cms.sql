begin;

create table if not exists public.scripture_drops (
  id uuid primary key default gen_random_uuid(),
  week_number integer not null unique check (week_number > 0),
  title text not null,
  target_reference text not null,
  verse_text text not null,
  translation text not null default 'ESV',
  day_1_video_url text,
  day_1_encounter_lines jsonb not null default '[]'::jsonb,
  day_2_context_cards jsonb not null default '[]'::jsonb,
  day_3_ambient_preset text not null default 'sanctuary_dawn',
  day_3_ambient_label text not null default 'Sanctuary Dawn',
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published')),
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.scripture_drops enable row level security;
grant select, insert, update on public.scripture_drops to authenticated;

drop policy if exists "Admins can read scripture drops" on public.scripture_drops;
create policy "Admins can read scripture drops"
  on public.scripture_drops for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can insert scripture drops" on public.scripture_drops;
create policy "Admins can insert scripture drops"
  on public.scripture_drops for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins can update scripture drops" on public.scripture_drops;
create policy "Admins can update scripture drops"
  on public.scripture_drops for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

commit;