"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CommunitySpaceInput = {
  id?: string;
  spaceType: string;
  title: string;
  description: string;
  scheduleText: string;
  memberCapacity: string;
  expirationDays: string;
  fixedPhrases: string;
  discussionQuestions: string;
  status: string;
  sortOrder: string;
};

const spaceTypes = ["valley_room", "study_pod", "prayer_circle"] as const;

export async function saveCommunitySpace(input: CommunitySpaceInput) {
  const title = input.title.trim();
  const description = input.description.trim();
  const scheduleText = input.scheduleText.trim();
  const memberCapacity = input.memberCapacity ? Number(input.memberCapacity) : null;
  const expirationDays = input.expirationDays ? Number(input.expirationDays) : null;
  const sortOrder = Number(input.sortOrder || 0);

  if (!spaceTypes.includes(input.spaceType as (typeof spaceTypes)[number])) return { error: "Choose a valid community space type." };
  if (!title || title.length > 120) return { error: "Enter a title of 120 characters or fewer." };
  if (description.length > 2000 || scheduleText.length > 200) return { error: "Description or schedule is too long." };
  if (input.status !== "active" && input.status !== "paused") return { error: "Choose a valid status." };
  if (memberCapacity !== null && (!Number.isInteger(memberCapacity) || memberCapacity < 1)) return { error: "Member capacity must be a positive whole number." };
  if (expirationDays !== null && (!Number.isInteger(expirationDays) || expirationDays < 1)) return { error: "Expiration must be a positive whole number of days." };
  if (!Number.isInteger(sortOrder)) return { error: "Sort order must be a whole number." };

  const fixedPhrases = parseStringList(input.fixedPhrases);
  if (!fixedPhrases) return { error: "Fixed phrases must be a JSON array of strings." };
  const discussionQuestions = parseStringList(input.discussionQuestions);
  if (!discussionQuestions) return { error: "Discussion questions must be a JSON array of strings." };

  const supabase = createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const row = {
    space_type: input.spaceType,
    title,
    description,
    schedule_text: scheduleText || null,
    member_capacity: memberCapacity,
    expiration_days: expirationDays,
    fixed_phrases: fixedPhrases,
    discussion_questions: discussionQuestions,
    status: input.status,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
  const query = input.id
    ? supabase.from("community_spaces").update(row).eq("id", input.id)
    : supabase.from("community_spaces").insert(row);
  const { error } = await query;

  if (error) return { error: error.message };
  revalidatePath("/community");
  return { success: true };
}

export async function reviewVoiceSubmission(input: { id: string; status: string; reviewerNote: string }) {
  if (!input.id) return { error: "Submission ID is required." };
  if (input.status !== "approved" && input.status !== "rejected") return { error: "Choose approve or reject." };
  const reviewerNote = input.reviewerNote.trim();
  if (reviewerNote.length > 2000) return { error: "Reviewer notes must be 2,000 characters or fewer." };

  const supabase = createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase
    .from("voice_submissions")
    .update({ status: input.status, reviewer_note: reviewerNote || null, reviewed_at: new Date().toISOString() })
    .eq("id", input.id)
    .eq("status", "pending");

  if (error) return { error: error.message };
  revalidatePath("/community");
  return { success: true };
}

function parseStringList(value: string): string[] | null {
  try {
    const parsed: unknown = JSON.parse(value || "[]");
    return Array.isArray(parsed) && parsed.length <= 50 && parsed.every((item) => typeof item === "string" && item.length <= 500)
      ? parsed.map((item) => item.trim()).filter(Boolean)
      : null;
  } catch {
    return null;
  }
}