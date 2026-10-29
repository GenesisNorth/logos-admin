begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.moderation_queue (
  id uuid primary key default gen_random_uuid(),
  user_handle text not null,
  room_name text not null,
  phrase text not null,
  reflection text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  is_demo boolean not null default false
);

create table if not exists public.pastoral_requests (
  id uuid primary key default gen_random_uuid(),
  seeker_name text not null,
  status text not null default 'received'
    check (status in ('received', 'in_review', 'resolved')),
  request_text text not null,
  response_text text,
  response_audio_url text,
  created_at timestamptz not null default now(),
  sla_deadline timestamptz not null,
  resolved_at timestamptz,
  is_demo boolean not null default false
);

create table if not exists public.content_drops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('audio', 'reflection', 'scripture')),
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published')),
  content text,
  media_url text,
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  is_demo boolean not null default false
);

alter table public.moderation_queue
  add column if not exists is_demo boolean not null default false;
alter table public.pastoral_requests
  add column if not exists is_demo boolean not null default false;
alter table public.pastoral_requests
  add column if not exists response_text text;
alter table public.pastoral_requests
  add column if not exists response_audio_url text;
alter table public.content_drops
  add column if not exists is_demo boolean not null default false;
alter table public.content_drops
  add column if not exists content text;
alter table public.content_drops
  add column if not exists media_url text;

create or replace function public.is_admin()
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
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

grant select on public.admin_users to authenticated;
grant select, update on public.moderation_queue to authenticated;
grant select, update on public.pastoral_requests to authenticated;
grant select, insert, update on public.content_drops to authenticated;

alter table public.admin_users enable row level security;
alter table public.moderation_queue enable row level security;
alter table public.pastoral_requests enable row level security;
alter table public.content_drops enable row level security;

drop policy if exists "Admins can read their own admin record" on public.admin_users;
create policy "Admins can read their own admin record"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Admins can read moderation queue" on public.moderation_queue;
create policy "Admins can read moderation queue"
  on public.moderation_queue for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can update moderation queue" on public.moderation_queue;
create policy "Admins can update moderation queue"
  on public.moderation_queue for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can read pastoral requests" on public.pastoral_requests;
create policy "Admins can read pastoral requests"
  on public.pastoral_requests for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can update pastoral requests" on public.pastoral_requests;
create policy "Admins can update pastoral requests"
  on public.pastoral_requests for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can read content drops" on public.content_drops;
create policy "Admins can read content drops"
  on public.content_drops for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can update content drops" on public.content_drops;
create policy "Admins can update content drops"
  on public.content_drops for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can create content drops" on public.content_drops;
create policy "Admins can create content drops"
  on public.content_drops for insert to authenticated
  with check ((select public.is_admin()));

insert into public.moderation_queue (
  id, user_handle, room_name, phrase, reflection, created_at, is_demo
) values
  (
    'd1000000-0000-4000-8000-000000000001',
    'Seeker_719',
    'Navigating Grief in the Psalms',
    'Praying for comfort in the silence',
    'Lost my grandfather this week. Remembering that the Lord is near to the brokenhearted.',
    now() - interval '18 minutes',
    true
  ),
  (
    'd1000000-0000-4000-8000-000000000002',
    'JordanM',
    'Faith in the Corporate Workplace',
    'Seeking wisdom for difficult meetings',
    'Facing uncertainty at work and praying for peace and ethical clarity.',
    now() - interval '42 minutes',
    true
  ),
  (
    'd1000000-0000-4000-8000-000000000003',
    'Miriam_L',
    'Community Prayer Rhythm',
    'Learning to rest in God’s timing',
    'I have been waiting on several answers and am learning to trust the Father’s pace.',
    now() - interval '1 hour',
    true
  )
on conflict (id) do nothing;

insert into public.pastoral_requests (
  id, seeker_name, status, request_text, created_at, sla_deadline, is_demo
) values
  (
    'd2000000-0000-4000-8000-000000000001',
    'Demo Seeker A',
    'received',
    'I am feeling overwhelmed by anxiety around work and family. I would appreciate prayer and scripture for tonight.',
    now() - interval '2 hours',
    now() + interval '45 minutes',
    true
  ),
  (
    'd2000000-0000-4000-8000-000000000002',
    'Demo Seeker B',
    'in_review',
    'I am struggling to feel hopeful and would value a pastoral check-in and an audio prayer.',
    now() - interval '45 minutes',
    now() + interval '3 hours',
    true
  )
on conflict (id) do nothing;

insert into public.content_drops (id, title, type, status, content, media_url, publish_at, is_demo)
values
  (
    'd3000000-0000-4000-8000-000000000001',
    'Week 1: Abiding in Christ',
    'audio',
    'published',
    'Audio reflection about remaining connected to Christ through the week.',
    null,
    now() - interval '7 days',
    true
  ),
  (
    'd3000000-0000-4000-8000-000000000002',
    'Week 2: Strength in Waiting',
    'reflection',
    'draft',
    'A guided reflection on finding strength and patience while waiting.',
    null,
    null,
    true
  ),
  (
    'd3000000-0000-4000-8000-000000000003',
    'Week 3: Light in the Wilderness',
    'scripture',
    'scheduled',
    '“The Lord is my light and my salvation; whom shall I fear?” Psalm 27:1',
    null,
    now() + interval '7 days',
    true
  )
on conflict (id) do nothing;

update public.content_drops
set content = case id
  when 'd3000000-0000-4000-8000-000000000001' then 'Audio reflection about remaining connected to Christ through the week.'
  when 'd3000000-0000-4000-8000-000000000002' then 'A guided reflection on finding strength and patience while waiting.'
  when 'd3000000-0000-4000-8000-000000000003' then '“The Lord is my light and my salvation; whom shall I fear?” Psalm 27:1'
end
where id in (
  'd3000000-0000-4000-8000-000000000001',
  'd3000000-0000-4000-8000-000000000002',
  'd3000000-0000-4000-8000-000000000003'
)
and is_demo
and content is null;

commit;
