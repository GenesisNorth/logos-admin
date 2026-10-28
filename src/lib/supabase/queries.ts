import { createSupabaseServerClient } from "./server";

export type ModerationPost = {
  id: string;
  user_handle: string;
  room_name: string;
  phrase: string;
  reflection: string;
  created_at: string;
};

export type PastoralRequest = {
  id: string;
  seeker_name: string;
  status: "received" | "in_review" | "resolved";
  request_text: string;
  created_at: string;
  sla_deadline: string;
};

export type ContentDrop = {
  id: string;
  title: string;
  type: "audio" | "reflection" | "scripture";
  status: "draft" | "scheduled" | "published";
  publish_at: string | null;
};

export type DashboardCounts = {
  moderationPending: number;
  pastoralAtRisk: number;
  contentDrafts: number;
};

export async function getDashboardCounts(): Promise<DashboardCounts> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { moderationPending: 0, pastoralAtRisk: 0, contentDrafts: 0 };
  }

  const [{ count: moderationPending }, { count: pastoralAtRisk }, { count: contentDrafts }] =
    await Promise.all([
      supabase
        .from("moderation_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("pastoral_requests")
        .select("*", { count: "exact", head: true })
        .in("status", ["received", "in_review"])
        .lt("sla_deadline", new Date(Date.now() + 60 * 60 * 1000).toISOString()),
      supabase
        .from("content_drops")
        .select("*", { count: "exact", head: true })
        .eq("status", "draft"),
    ]);

  return {
    moderationPending: moderationPending ?? 0,
    pastoralAtRisk: pastoralAtRisk ?? 0,
    contentDrafts: contentDrafts ?? 0,
  };
}

export async function getModerationQueue(): Promise<ModerationPost[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("moderation_queue")
    .select("id, user_handle, room_name, phrase, reflection, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(50);

  return data ?? [];
}

export async function getPastoralRequests(): Promise<PastoralRequest[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("pastoral_requests")
    .select("id, seeker_name, status, request_text, created_at, sla_deadline")
    .in("status", ["received", "in_review"])
    .order("sla_deadline", { ascending: true });

  return data ?? [];
}

export async function getContentDrops(): Promise<ContentDrop[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("content_drops")
    .select("id, title, type, status, publish_at")
    .order("publish_at", { ascending: true, nullsFirst: false });

  return data ?? [];
}