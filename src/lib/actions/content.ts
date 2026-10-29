"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const contentTypes = ["audio", "reflection", "scripture"] as const;
const contentStatuses = ["draft", "scheduled", "published"] as const;

type ContentType = (typeof contentTypes)[number];
type ContentStatus = (typeof contentStatuses)[number];

function isContentType(value: string): value is ContentType {
  return contentTypes.includes(value as ContentType);
}

function isContentStatus(value: string): value is ContentStatus {
  return contentStatuses.includes(value as ContentStatus);
}

export async function createContentDrop(input: {
  title: string;
  type: string;
  status: string;
  content: string;
  mediaUrl: string;
  publishAt: string;
}) {
  const title = input.title.trim();
  if (!title) return { error: "Enter a title for this content drop." };
  if (title.length > 160) return { error: "Titles must be 160 characters or fewer." };
  if (!isContentType(input.type)) return { error: "Choose a valid content type." };
  if (!isContentStatus(input.status)) return { error: "Choose a valid status." };
  const content = input.content.trim();
  const mediaUrl = input.mediaUrl.trim();
  if (content.length > 20000) return { error: "Content must be 20,000 characters or fewer." };
  if (mediaUrl && !isValidHttpUrl(mediaUrl)) return { error: "Media URL must be a valid http or https URL." };

  const publishAt = input.publishAt ? new Date(input.publishAt) : null;
  if (input.status === "scheduled" && (!publishAt || Number.isNaN(publishAt.getTime()))) {
    return { error: "Choose a valid publish date and time." };
  }
  if (input.status === "scheduled" && publishAt && publishAt <= new Date()) {
    return { error: "Scheduled publish time must be in the future." };
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase.from("content_drops").insert({
    title,
    type: input.type,
    status: input.status,
    content: content || null,
    media_url: mediaUrl || null,
    publish_at:
      input.status === "published"
        ? new Date().toISOString()
        : input.status === "scheduled"
          ? publishAt?.toISOString()
          : null,
  });

  if (error) return { error: error.message };
  revalidatePath("/content");
  revalidatePath("/");
  return { success: true };
}

export async function updateContentDrop(input: {
  id: string;
  status: string;
  content: string;
  mediaUrl: string;
  publishAt: string;
}) {
  if (!input.id) return { error: "Content drop ID is required." };
  if (!isContentStatus(input.status)) return { error: "Choose a valid status." };
  const content = input.content.trim();
  const mediaUrl = input.mediaUrl.trim();
  if (content.length > 20000) return { error: "Content must be 20,000 characters or fewer." };
  if (mediaUrl && !isValidHttpUrl(mediaUrl)) return { error: "Media URL must be a valid http or https URL." };

  const publishAt = input.publishAt ? new Date(input.publishAt) : null;
  if (input.status === "scheduled" && (!publishAt || Number.isNaN(publishAt.getTime()))) {
    return { error: "Choose a valid publish date and time." };
  }
  if (input.status === "scheduled" && publishAt && publishAt <= new Date()) {
    return { error: "Scheduled publish time must be in the future." };
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const { error } = await supabase
    .from("content_drops")
    .update({
      status: input.status,
      content: content || null,
      media_url: mediaUrl || null,
      publish_at:
        input.status === "published"
          ? new Date().toISOString()
          : input.status === "scheduled"
            ? publishAt?.toISOString()
            : null,
    })
    .eq("id", input.id);

  if (error) return { error: error.message };
  revalidatePath("/content");
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
