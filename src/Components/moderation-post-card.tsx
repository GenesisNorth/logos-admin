"use client";

import { useTransition } from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { approvePost, rejectPost } from "@/lib/actions/moderation";
import { formatRelative } from "@/lib/utils/format";
import type { ModerationPost } from "@/lib/supabase/queries";

export function ModerationPostCard({ post }: { post: ModerationPost }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      await approvePost(post.id);
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      await rejectPost(post.id);
    });
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-[#D9CFC4] bg-white/70 p-5 transition lg:flex-row lg:items-center lg:justify-between ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#2E2A24]/70">
          <span className="font-semibold text-[#2E2A24]">{post.user_handle}</span>
          <span>•</span>
          <span className="rounded-full bg-[#2E2A24]/5 px-2 py-1 text-[#2E2A24]">
            {post.room_name}
          </span>
          <span>•</span>
          <span>{formatRelative(post.created_at)}</span>
        </div>
        <p className="font-serif text-sm italic text-[#2E2A24]">
          "{post.phrase}"
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-[#2E2A24]/80">
          {post.reflection}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleReject}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          Reject
        </button>
        <button
          type="button"
          onClick={handleApprove}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-[#E8A98C] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#E8A98C]/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Approve
        </button>
      </div>
    </div>
  );
}