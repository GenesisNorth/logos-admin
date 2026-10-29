begin;

create table if not exists public.admin_activity_log (
  id bigint generated always as identity primary key,
  actor_user_id uuid not null references auth.users (id) on delete restrict,
  actor_email text,
  actor_role text not null,
  action text not null check (action in ('created', 'updated', 'deleted')),
  target_table text not null,
  target_id uuid not null,
  summary jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists admin_activity_log_occurred_at_idx
  on public.admin_activity_log (occurred_at desc);
create index if not exists admin_activity_log_actor_idx
  on public.admin_activity_log (actor_user_id, occurred_at desc);

alter table public.admin_activity_log enable row level security;
revoke all on public.admin_activity_log from anon, authenticated;
grant select on public.admin_activity_log to authenticated;

create or replace function public.is_super_admin()
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
      and admins.role = 'super_admin'
  );
$$;

revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

drop policy if exists "Super admins can read admin activity" on public.admin_activity_log;
create policy "Super admins can read admin activity"
  on public.admin_activity_log for select to authenticated
  using ((select public.is_super_admin()));

create or replace function public.capture_admin_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  row_data jsonb;
  previous_data jsonb;
  target_uuid uuid;
  actor_email_value text := auth.jwt() ->> 'email';
  actor_role_value text;
  safe_summary jsonb := '{}'::jsonb;
  event_action text;
begin
  if actor_id is null then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  select admins.role into actor_role_value
  from public.admin_users as admins
  where admins.user_id = actor_id and admins.is_active;

  if actor_role_value is null then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    row_data := to_jsonb(old);
    previous_data := row_data;
    event_action := 'deleted';
  elsif tg_op = 'INSERT' then
    row_data := to_jsonb(new);
    event_action := 'created';
  else
    row_data := to_jsonb(new);
    previous_data := to_jsonb(old);
    event_action := 'updated';
  end if;

  target_uuid := (row_data ->> 'id')::uuid;

  if tg_table_name = 'moderation_queue' then
    safe_summary := jsonb_build_object('status', row_data ->> 'status');
  elsif tg_table_name = 'pastoral_requests' then
    safe_summary := jsonb_build_object('status', row_data ->> 'status');
  elsif tg_table_name = 'content_drops' then
    safe_summary := jsonb_build_object('title', row_data ->> 'title', 'status', row_data ->> 'status');
  elsif tg_table_name = 'scripture_drops' then
    safe_summary := jsonb_build_object('week_number', row_data ->> 'week_number', 'title', row_data ->> 'title', 'status', row_data ->> 'status');
  elsif tg_table_name = 'community_spaces' then
    safe_summary := jsonb_build_object('space_type', row_data ->> 'space_type', 'title', row_data ->> 'title', 'status', row_data ->> 'status');
  elsif tg_table_name = 'voice_submissions' then
    safe_summary := jsonb_build_object('status', row_data ->> 'status', 'scripture_reference', row_data ->> 'scripture_reference');
  end if;

  if tg_op = 'UPDATE' then
    safe_summary := safe_summary || jsonb_build_object('previous_status', previous_data ->> 'status');
  end if;

  insert into public.admin_activity_log (
    actor_user_id, actor_email, actor_role, action, target_table, target_id, summary
  ) values (
    actor_id, actor_email_value, actor_role_value, event_action, tg_table_name, target_uuid, safe_summary
  );

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function public.capture_admin_activity() from public;

drop trigger if exists audit_moderation_queue on public.moderation_queue;
create trigger audit_moderation_queue
  after insert or update or delete on public.moderation_queue
  for each row execute function public.capture_admin_activity();

drop trigger if exists audit_pastoral_requests on public.pastoral_requests;
create trigger audit_pastoral_requests
  after insert or update or delete on public.pastoral_requests
  for each row execute function public.capture_admin_activity();

drop trigger if exists audit_content_drops on public.content_drops;
create trigger audit_content_drops
  after insert or update or delete on public.content_drops
  for each row execute function public.capture_admin_activity();

drop trigger if exists audit_scripture_drops on public.scripture_drops;
create trigger audit_scripture_drops
  after insert or update or delete on public.scripture_drops
  for each row execute function public.capture_admin_activity();

drop trigger if exists audit_community_spaces on public.community_spaces;
create trigger audit_community_spaces
  after insert or update or delete on public.community_spaces
  for each row execute function public.capture_admin_activity();

drop trigger if exists audit_voice_submissions on public.voice_submissions;
create trigger audit_voice_submissions
  after insert or update or delete on public.voice_submissions
  for each row execute function public.capture_admin_activity();

commit;