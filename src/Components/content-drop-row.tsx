"use client";

import { FormEvent, useState, useTransition } from "react";
import { Volume2, FileText, BookOpen } from "lucide-react";
import { updateContentDrop } from "@/lib/actions/content";
import type { ContentDrop } from "@/lib/supabase/queries";
import { StatusBadge } from "./status-badge";

const typeIcons = {
  audio: Volume2,
  reflection: FileText,
  scripture: BookOpen,
};

const statusVariant: Record<ContentDrop["status"], "success" | "warning" | "neutral"> = {
  published: "success",
  scheduled: "warning",
  draft: "neutral",
};

export function ContentDropRow({ drop }: { drop: ContentDrop }) {
  const Icon = typeIcons[drop.type];
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const localPublishAt = drop.publish_at
    ? new Date(new Date(drop.publish_at).getTime() - new Date(drop.publish_at).getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : "";

  const handleUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrorMessage("");

    startTransition(async () => {
      const result = await updateContentDrop({
        id: drop.id,
        status: String(formData.get("status") ?? drop.status),
        content: String(formData.get("content") ?? ""),
        mediaUrl: String(formData.get("mediaUrl") ?? ""),
        publishAt: String(formData.get("publishAt") ?? ""),
      });
      if (result?.error) setErrorMessage(result.error);
    });
  };

  return (
    <div className={`rounded-xl border border-[#D9CFC4] bg-white/70 p-4 ${isPending ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded-lg bg-[#F2EAE0] p-2 text-[#2E2A24]">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-[#2E2A24]">{drop.title}</p>
            <p className="text-xs capitalize text-[#2E2A24]/60">{drop.type}</p>
            {drop.publish_at && (
              <p className="mt-1 text-xs text-[#2E2A24]/60">
                {new Date(drop.publish_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <StatusBadge variant={statusVariant[drop.status]}>{drop.status}</StatusBadge>
      </div>

      {drop.content && (
        <p className="mt-3 whitespace-pre-wrap border-t border-[#D9CFC4] pt-3 text-sm leading-relaxed text-[#2E2A24]/80">
          {drop.content}
        </p>
      )}
      {drop.media_url && (
        <a
          href={drop.media_url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block break-all text-xs font-medium text-[#2E2A24] underline decoration-[#E8A98C] underline-offset-2"
        >
          Open media
        </a>
      )}

      <form onSubmit={handleUpdate} className="mt-3 flex flex-wrap items-end gap-2 border-t border-[#D9CFC4] pt-3">
        <label className="w-full space-y-1 text-xs font-medium text-[#2E2A24]/75">
          Content
          <textarea
            name="content"
            rows={3}
            maxLength={20000}
            defaultValue={drop.content ?? ""}
            className="block w-full resize-y rounded-md border border-[#D9CFC4] bg-white px-2 py-1.5 text-sm text-[#2E2A24]"
          />
        </label>
        <label className="min-w-[220px] flex-1 space-y-1 text-xs font-medium text-[#2E2A24]/75">
          Media URL
          <input
            name="mediaUrl"
            type="url"
            defaultValue={drop.media_url ?? ""}
            placeholder="https://..."
            className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2 py-1.5 text-sm text-[#2E2A24]"
          />
        </label>
        <label className="space-y-1 text-xs font-medium text-[#2E2A24]/75">
          Status
          <select
            name="status"
            defaultValue={drop.status}
            className="block rounded-md border border-[#D9CFC4] bg-white px-2 py-1.5 text-sm text-[#2E2A24]"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label className="space-y-1 text-xs font-medium text-[#2E2A24]/75">
          Publish time
          <input
            name="publishAt"
            type="datetime-local"
            defaultValue={localPublishAt}
            className="block rounded-md border border-[#D9CFC4] bg-white px-2 py-1.5 text-sm text-[#2E2A24]"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-[#2E2A24] px-3 py-1.5 text-xs font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        {errorMessage && <p role="alert" className="w-full text-xs text-red-700">{errorMessage}</p>}
      </form>
    </div>
  );
}