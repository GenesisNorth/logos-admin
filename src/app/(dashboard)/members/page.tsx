import { UsersRound } from "lucide-react";
import { PageHeader } from "@/Components/page-header";
import { getMemberDirectory } from "@/lib/supabase/member-queries";

export default async function MembersPage() {
  const result = await getMemberDirectory();
  const withProgress = result.members.filter((member) => member.journey !== null).length;
  const totalRoots = result.members.reduce((total, member) => total + (member.journey?.roots_planted ?? 0), 0);
  const totalStreak = result.members.reduce((total, member) => total + (member.journey?.current_streak ?? 0), 0);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Member support" title="Members & journey" description="Read-only profile and journey progress for authorized member-support staff." action={<span className="inline-flex items-center gap-2 rounded-md border border-[#D9CFC4] bg-white/70 px-3 py-2 text-xs font-semibold"><UsersRound className="h-4 w-4" />{result.members.length} members</span>} />
      {!result.authorized ? (
        <section className="rounded-lg border border-amber-300 bg-amber-50 p-5">
          <h2 className="font-bold text-amber-950">Member access is restricted</h2>
          <p className="mt-1 text-sm text-amber-900/80">Only accounts with the <code>member_support</code> or <code>super_admin</code> role can view profile and journey records. Ask an authorized database owner to grant the role.</p>
        </section>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Profiles" value={result.members.length} />
            <Metric label="With journey data" value={withProgress} />
            <Metric label="Roots planted · total" value={totalRoots} detail={`${totalStreak} active-streak days combined`} />
          </div>
          {result.members.length === 0 ? (
            <section className="rounded-lg border border-dashed border-[#D9CFC4] bg-white/60 p-8 text-center">
              <p className="font-semibold text-[#2E2A24]">No member records found</p>
              <p className="mt-1 text-sm text-[#2E2A24]/60">The mobile app currently keeps profiles and journey progress on-device. This directory will populate when an authenticated app backend writes to <code>app_profiles</code> and <code>user_journey_progress</code>.</p>
            </section>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#D9CFC4] bg-[#FAF6F0]">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="border-b border-[#D9CFC4] bg-white/60 text-xs uppercase text-[#2E2A24]/60"><tr><th className="px-4 py-3">Member</th><th className="px-4 py-3">Covenant</th><th className="px-4 py-3">Journey</th><th className="px-4 py-3">Streak</th><th className="px-4 py-3">Roots</th><th className="px-4 py-3">Grace</th><th className="px-4 py-3">Updated</th></tr></thead>
                <tbody className="divide-y divide-[#D9CFC4]">{result.members.map((member) => <tr key={member.user_id} className="align-top"><td className="px-4 py-3"><p className="font-semibold text-[#2E2A24]">{member.display_name || "Unnamed member"}</p><p className="text-xs text-[#2E2A24]/60">{member.username ? `@${member.username}` : member.user_id}</p></td><td className="px-4 py-3 text-xs text-[#2E2A24]/70">{member.covenant_signed_at ? new Date(member.covenant_signed_at).toLocaleDateString() : "Not signed"}</td><td className="px-4 py-3 text-xs text-[#2E2A24]/70">{member.journey ? `Week ${member.journey.active_week} · Day ${member.journey.active_day}` : "No progress"}</td><td className="px-4 py-3">{member.journey?.current_streak ?? "—"}</td><td className="px-4 py-3">{member.journey?.roots_planted ?? "—"}</td><td className="px-4 py-3">{member.journey?.grace_tokens_balance ?? "—"}</td><td className="px-4 py-3 text-xs text-[#2E2A24]/60">{member.journey ? new Date(member.journey.updated_at).toLocaleString() : "—"}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: number; detail?: string }) {
  return <section className="rounded-lg border border-[#D9CFC4] bg-[#FAF6F0] p-4"><p className="text-xs font-semibold uppercase text-[#2E2A24]/55">{label}</p><p className="mt-1 text-2xl font-bold text-[#2E2A24]">{value}</p>{detail && <p className="mt-1 text-xs text-[#2E2A24]/60">{detail}</p>}</section>;
}