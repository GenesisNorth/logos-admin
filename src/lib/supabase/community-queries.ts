import { createSupabaseServerClient } from "./server";

export type CommunitySpace = {
  id: string;
  space_type: "valley_room" | "study_pod" | "prayer_circle";
  title: string;
  description: string;
  schedule_text: string | null;
  member_capacity: number | null;
  expiration_days: number | null;
  fixed_phrases: string[];
  discussion_questions: string[];
  status: "active" | "paused";
  sort_order: number;
};

export type VoiceSubmission = {
  id: string;
  reader_name: string;
  scripture_reference: string;
  season: string;
  audio_url: string;
  status: "pending" | "approved" | "rejected";
  reviewer_note: string | null;
  created_at: string;
};

export async function getCommunitySpaces(): Promise<CommunitySpace[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("community_spaces")
    .select("id, space_type, title, description, schedule_text, member_capacity, expiration_days, fixed_phrases, discussion_questions, status, sort_order")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  return (data ?? []) as CommunitySpace[];
}

export async function getVoiceSubmissions(): Promise<VoiceSubmission[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("voice_submissions")
    .select("id, reader_name, scripture_reference, season, audio_url, status, reviewer_note, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(100);

  return (data ?? []) as VoiceSubmission[];
}