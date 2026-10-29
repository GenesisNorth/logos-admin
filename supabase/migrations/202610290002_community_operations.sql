begin;

create table if not exists public.community_spaces (
  id uuid primary key default gen_random_uuid(),
  space_type text not null check (space_type in ('valley_room', 'study_pod', 'prayer_circle')),
  title text not null,
  description text not null default '',
  schedule_text text,
  member_capacity integer check (member_capacity is null or member_capacity > 0),
  expiration_days integer check (expiration_days is null or expiration_days > 0),
  fixed_phrases jsonb not null default '[]'::jsonb,
  discussion_questions jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'paused')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.voice_submissions (
  id uuid primary key default gen_random_uuid(),
  reader_name text not null,
  scripture_reference text not null,
  season text not null,
  audio_url text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.community_spaces enable row level security;
alter table public.voice_submissions enable row level security;
grant select, insert, update on public.community_spaces to authenticated;
grant select, update on public.voice_submissions to authenticated;

drop policy if exists "Admins can read community spaces" on public.community_spaces;
create policy "Admins can read community spaces"
  on public.community_spaces for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can insert community spaces" on public.community_spaces;
create policy "Admins can insert community spaces"
  on public.community_spaces for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins can update community spaces" on public.community_spaces;
create policy "Admins can update community spaces"
  on public.community_spaces for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can read voice submissions" on public.voice_submissions;
create policy "Admins can read voice submissions"
  on public.voice_submissions for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can update voice submissions" on public.voice_submissions;
create policy "Admins can update voice submissions"
  on public.voice_submissions for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

commit;