"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function approvePost(id: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase
    .from("moderation_queue")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/moderation");
  revalidatePath("/");
  return { success: true };
}

export async function rejectPost(id: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase
    .from("moderation_queue")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/moderation");
  revalidatePath("/");
  return { success: true };
}