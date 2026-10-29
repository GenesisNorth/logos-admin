"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ContextCard = { title: string; subtitle: string; content: string };

type ScriptureDropInput = {
  id?: string;
  weekNumber: string;
  title: string;
  reference: string;
  verseText: string;
  translation: string;
  videoUrl: string;
  encounterLines: string;
  contextCards: string;
  ambientPreset: string;
  ambientLabel: string;
  status: string;
  publishAt: string;
};

const statuses = ["draft", "scheduled", "published"] as const;

export async function saveScriptureDrop(input: ScriptureDropInput) {
  const weekNumber = Number(input.weekNumber);
  const title = input.title.trim();
  const reference = input.reference.trim();
  const verseText = input.verseText.trim();
  const translation = input.translation.trim();
  const videoUrl = input.videoUrl.trim();
  const ambientPreset = input.ambientPreset.trim();
  const ambientLabel = input.ambientLabel.trim();

  if (!Number.isInteger(weekNumber) || weekNumber < 1) return { error: "Week number must be a positive whole number." };
  if (!title || title.length > 160) return { error: "Enter a title of 160 characters or fewer." };
  if (!reference || reference.length > 100) return { error: "Enter a Scripture reference of 100 characters or fewer." };
  if (!verseText || verseText.length > 10000) return { error: "Enter verse text of 10,000 characters or fewer." };
  if (!translation || translation.length > 40) return { error: "Enter a translation of 40 characters or fewer." };
  if (!ambientPreset || !ambientLabel) return { error: "Ambient preset and label are required." };
  if (videoUrl && !isValidHttpUrl(videoUrl)) return { error: "Video URL must be a valid http or https URL." };
  if (!statuses.includes(input.status as (typeof statuses)[number])) return { error: "Choose a valid status." };

  const encounterLines = input.encounterLines.split("\n").map((line) => line.trim()).filter(Boolean);
  if (encounterLines.length > 30 || encounterLines.some((line) => line.length > 500)) {
    return { error: "Use at most 30 encounter lines, with no line longer than 500 characters." };
  }

  let contextCards: ContextCard[];
  try {
    const parsed: unknown = JSON.parse(input.contextCards || "[]");
    if (!Array.isArray(parsed) || parsed.length > 20 || !parsed.every(isContextCard)) {
      return { error: "Context cards must be a JSON array with title, subtitle, and content fields (20 maximum)." };
    }
    contextCards = parsed;
  } catch {
    return { error: "Context cards must be valid JSON." };
  }

  const publishAt = input.publishAt ? new Date(input.publishAt) : null;
  if (input.status === "scheduled" && (!publishAt || Number.isNaN(publishAt.getTime()) || publishAt <= new Date())) {
    return { error: "Choose a future publish date and time." };
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const row = {
    week_number: weekNumber,
    title,
    target_reference: reference,
    verse_text: verseText,
    translation,
    day_1_video_url: videoUrl || null,
    day_1_encounter_lines: encounterLines,
    day_2_context_cards: contextCards,
    day_3_ambient_preset: ambientPreset,
    day_3_ambient_label: ambientLabel,
    status: input.status,
    publish_at: input.status === "published" ? new Date().toISOString() : input.status === "scheduled" ? publishAt?.toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const query = input.id
    ? supabase.from("scripture_drops").update(row).eq("id", input.id)
    : supabase.from("scripture_drops").insert(row);
  const { error } = await query;

  if (error) return { error: error.message };
  revalidatePath("/journey");
  return { success: true };
}

function isContextCard(value: unknown): value is ContextCard {
  if (!value || typeof value !== "object") return false;
  const card = value as Record<string, unknown>;
  return typeof card.title === "string" && typeof card.subtitle === "string" && typeof card.content === "string";
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}