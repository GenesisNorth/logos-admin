import { createSupabaseServerClient } from "./server";

export type MemberJourneyRecord = {
  user_id: string;
  username: string;
  display_name: string;
  covenant_signed_at: string | null;
  created_at: string;
  journey: {
    active_week: number;
    active_day: number;
    current_streak: number;
    roots_planted: number;
    grace_tokens_balance: number;
    day_completion: Record<string, boolean>;
    updated_at: string;
  } | null;
};

export type MemberDirectoryResult = {
  authorized: boolean;
  members: MemberJourneyRecord[];
};

export async function getMemberDirectory(): Promise<MemberDirectoryResult> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { authorized: false, members: [] };

  const { data: authorized, error: authorizationError } = await supabase.rpc("can_manage_members");
  if (authorizationError || authorized !== true) return { authorized: false, members: [] };

  const { data: profiles, error: profileError } = await supabase
    .from("app_profiles")
    .select("user_id, username, display_name, covenant_signed_at, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (profileError || !profiles?.length) return { authorized: true, members: [] };

  const userIds = profiles.map((profile) => profile.user_id);
  const { data: progress } = await supabase
    .from("user_journey_progress")
    .select("user_id, active_week, active_day, current_streak, roots_planted, grace_tokens_balance, day_completion, updated_at")
    .in("user_id", userIds);

  const progressByUser = new Map((progress ?? []).map((record) => [record.user_id, record]));
  return {
    authorized: true,
    members: profiles.map((profile) => ({
      ...profile,
      journey: progressByUser.get(profile.user_id) ?? null,
    })) as MemberJourneyRecord[],
  };
}