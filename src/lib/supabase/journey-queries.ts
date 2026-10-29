import { createSupabaseServerClient } from "./server";

export type ScriptureDrop = {
  id: string;
  week_number: number;
  title: string;
  target_reference: string;
  verse_text: string;
  translation: string;
  day_1_video_url: string | null;
  day_1_encounter_lines: string[];
  day_2_context_cards: { title: string; subtitle: string; content: string }[];
  day_3_ambient_preset: string;
  day_3_ambient_label: string;
  status: "draft" | "scheduled" | "published";
  publish_at: string | null;
};

export async function getScriptureDrops(): Promise<ScriptureDrop[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("scripture_drops")
    .select("id, week_number, title, target_reference, verse_text, translation, day_1_video_url, day_1_encounter_lines, day_2_context_cards, day_3_ambient_preset, day_3_ambient_label, status, publish_at")
    .order("week_number", { ascending: true });

  return (data ?? []) as ScriptureDrop[];
}