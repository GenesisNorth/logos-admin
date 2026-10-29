import { UsersRound } from "lucide-react";
import { PageHeader } from "@/Components/page-header";
import { CommunityOperations } from "@/Components/community-operations";
import { getCommunitySpaces, getVoiceSubmissions } from "@/lib/supabase/community-queries";

export default async function CommunityPage() {
  const [spaces, submissions] = await Promise.all([getCommunitySpaces(), getVoiceSubmissions()]);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Community operations" title="Community spaces" description="Configure Valley rooms, Study Pods, Prayer Circles, and review voice contributions." action={<span className="inline-flex items-center gap-2 rounded-md border border-[#D9CFC4] bg-white/70 px-3 py-2 text-xs font-semibold"><UsersRound className="h-4 w-4" />{spaces.length} spaces</span>} />
      <CommunityOperations spaces={spaces} submissions={submissions} />
    </div>
  );
}