import { Volume2, FileText, BookOpen } from "lucide-react";
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
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#D9CFC4] bg-white/70 p-4">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-[#F2EAE0] p-2 text-[#2E2A24]">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="font-semibold text-[#2E2A24]">{drop.title}</p>
          <p className="text-xs capitalize text-[#2E2A24]/60">{drop.type}</p>
        </div>
      </div>
      <StatusBadge variant={statusVariant[drop.status]}>
        {drop.status}
      </StatusBadge>
    </div>
  );
}