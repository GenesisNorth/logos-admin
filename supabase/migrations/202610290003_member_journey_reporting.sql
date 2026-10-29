begin;

alter table public.admin_users
  add column if not exists role text not null default 'content_admin'
  check (role in ('content_admin', 'community_admin', 'pastoral_admin', 'member_support', 'super_admin'));

create or replace function public.can_manage_members()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users as admins
    where admins.user_id = (select auth.uid())
      and admins.is_active
      and admins.role in ('member_support', 'super_admin')
  );
$$;

revoke all on function public.can_manage_members() from public;
grant execute on function public.can_manage_members() to authenticated;

create table if not exists public.app_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  username text not null default '',
  display_name text not null default '',
  covenant_signed_at timestamptz,
  birth_month smallint check (birth_month between 1 and 12),
  birth_day smallint check (birth_day between 1 and 31),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_journey_progress (
  user_id uuid primary key references public.app_profiles (user_id) on delete cascade,
  active_week integer not null default 1 check (active_week > 0),
  active_day smallint not null default 1 check (active_day between 1 and 4),
  current_streak integer not null default 0 check (current_streak >= 0),
  roots_planted integer not null default 0 check (roots_planted >= 0),
  grace_tokens_balance integer not null default 0 check (grace_tokens_balance >= 0),
  day_completion jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_profiles enable row level security;
alter table public.user_journey_progress enable row level security;
grant select on public.app_profiles, public.user_journey_progress to authenticated;

drop policy if exists "Member support can read app profiles" on public.app_profiles;
create policy "Member support can read app profiles"
  on public.app_profiles for select to authenticated
  using ((select public.can_manage_members()));

drop policy if exists "Member support can read journey progress" on public.user_journey_progress;
create policy "Member support can read journey progress"
  on public.user_journey_progress for select to authenticated
  using ((select public.can_manage_members()));

commit;