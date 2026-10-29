"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function savePastoralResponse(input: {
  id: string;
  responseText: string;
  responseAudioUrl: string;
}) {
  const responseText = input.responseText.trim();
  const responseAudioUrl = input.responseAudioUrl.trim();

  if (!input.id) return { error: "Pastoral request ID is required." };
  if (!responseText) return { error: "Write a response before saving." };
  if (responseText.length > 20000) return { error: "Responses must be 20,000 characters or fewer." };
  if (responseAudioUrl && !isValidHttpUrl(responseAudioUrl)) {
    return { error: "Audio URL must be a valid http or https URL." };
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase
    .from("pastoral_requests")
    .update({
      response_text: responseText,
      response_audio_url: responseAudioUrl || null,
      status: "in_review",
    })
    .eq("id", input.id);

  if (error) return { error: error.message };
  revalidatePath("/the-well");
  revalidatePath("/");
  return { success: true };
}

export async function resolvePastoralRequest(id: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase
    .from("pastoral_requests")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/the-well");
  revalidatePath("/");
  return { success: true };
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}