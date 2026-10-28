import { ShieldCheck } from "lucide-react";
import { getModerationQueue } from "@/lib/supabase/queries";
import { PageHeader } from "@/Components/page-header";
import { ModerationPostCard } from "@/Components/moderation-post-card";

export default async function ModerationPage() {
  const queue = await getModerationQueue();

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Community safety"
        title="Moderation queue"
        description="Review public reflections before they appear on the community board."
        action={
          <div className="flex items-center gap-2 rounded-full bg-[#E8A98C]/15 px-3 py-1.5 text-xs font-semibold text-[#2E2A24]">
            <ShieldCheck className="h-3.5 w-3.5" />
            {queue.length} pending
          </div>
        }
      />

      {queue.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D9CFC4] bg-white/60 p-12 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-emerald-600" />
          <p className="mt-3 text-sm font-semibold text-[#2E2A24]">
            All clear
          </p>
          <p className="mt-1 text-xs text-[#2E2A24]/60">
            No public posts are awaiting review right now.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((post) => (
            <ModerationPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}