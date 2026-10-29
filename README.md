# logos-admin

## Supabase demo data

The dashboard reads from `moderation_queue`, `pastoral_requests`, and
`content_drops`. The SQL setup in `supabase/seed.sql` creates those tables,
adds row-level security, and inserts clearly marked fictional demo rows. It is
safe to rerun: seed inserts use fixed IDs and do not overwrite reviewed rows.
Rerun the script after updating it so existing tables receive newer columns
and policies as well.

1. In Supabase Authentication, create the admin user first and confirm its
	email.
2. Open the project's SQL Editor, paste in `supabase/seed.sql`, and run it.
3. In the SQL Editor, add the Auth user to the admin allowlist. Replace the
	example address with the exact email used in step 1:

	```sql
	insert into public.admin_users (user_id)
	select id
	from auth.users
	where email = 'admin@example.com'
	on conflict (user_id) do update set is_active = true;
	```

4. Sign in to the dashboard again. The overview, moderation queue, pastoral
	requests, and content list will show the demo rows.

All sample rows have `is_demo = true`. To remove only the sample data, run:

```sql
delete from public.moderation_queue where is_demo;
delete from public.pastoral_requests where is_demo;
delete from public.content_drops where is_demo;
```

Do not add real credentials or passwords to this repository. Local Supabase
configuration belongs in `.env.local`, which is ignored by Git.
