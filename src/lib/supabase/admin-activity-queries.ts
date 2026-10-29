import { createSupabaseServerClient } from "./server";

export type AdminActivity = {
  id: number;
  actor_user_id: string;
  actor_email: string | null;
  actor_role: string;
  action: "created" | "updated" | "deleted";
  target_table: string;
  target_id: string;
  summary: Record<string, string | null>;
  occurred_at: string;
};

export type AdminActivityResult = {
  authorized: boolean;
  events: AdminActivity[];
};

export async function getIsSuperAdmin(): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("is_super_admin");
  return !error && data === true;
}

export async function getAdminActivity(): Promise<AdminActivityResult> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { authorized: false, events: [] };

  const { data: authorized, error: authorizationError } = await supabase.rpc("is_super_admin");
  if (authorizationError || authorized !== true) return { authorized: false, events: [] };

  const { data, error } = await supabase
    .from("admin_activity_log")
    .select("id, actor_user_id, actor_email, actor_role, action, target_table, target_id, summary, occurred_at")
    .order("occurred_at", { ascending: false })
    .limit(250);

  return {
    authorized: true,
    events: error ? [] : (data ?? []) as AdminActivity[],
  };
}