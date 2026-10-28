import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  getDashboardCounts,
  getModerationQueue,
  getPastoralRequests,
} from "@/lib/supabase/queries";
import { PageHeader } from "@/Components/page-header";
import { StatCard } from "@/Components/Stat-Card";

type UrgentAction = {
  href: string;
  label: string;
  icon: typeof ShieldCheck | typeof HeartHandshake | typeof BookOpen;
  urgency: "high" | "low";
};

export default async function OverviewPage() {
  const [counts, moderation, pastoral] = await Promise.all([
    getDashboardCounts(),
    getModerationQueue(),
    getPastoralRequests(),
  ]);

  const urgentActions = ([
    counts.moderationPending > 0 && {
      href: "/moderation",
      label: `${counts.moderationPending} reflections awaiting review`,
      icon: ShieldCheck,
      urgency: "high" as const,
    },
    counts.pastoralAtRisk > 0 && {
      href: "/the-well",
      label: `${counts.pastoralAtRisk} pastoral requests approaching SLA`,
      icon: HeartHandshake,
      urgency: "high" as const,
    },
    counts.contentDrafts > 0 && {
      href: "/content",
      label: `${counts.contentDrafts} drafts pending publish`,
      icon: BookOpen,
      urgency: "low" as const,
    },
  ] satisfies (UrgentAction | false)[]).filter(
    (action): action is UrgentAction => action !== false,
  );

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Admin dashboard"
        title="Overview"
        action={
          <div className="flex items-center gap-2 rounded-lg bg-[#2E2A24] px-3 py-2 text-xs font-semibold text-white">
            <Clock className="h-3.5 w-3.5" />
            Week of Prayer · Live
          </div>
        }
      />

      <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Journey Completion"
          value="71.4%"
          detail="Day 4 rate · +4.2% wk"
          tone="emerald"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Moderation Queue"
          value={String(counts.moderationPending)}
          detail="Pending review"
          tone="amber"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <StatCard
          label="The Well SLA"
          value={`${counts.pastoralAtRisk}`}
          detail="At risk within 4h window"
          tone={counts.pastoralAtRisk > 0 ? "rose" : "emerald"}
          icon={<HeartHandshake className="h-4 w-4" />}
        />
        <StatCard
          label="Content Drafts"
          value={String(counts.contentDrafts)}
          detail="Unpublished"
          tone="slate"
          icon={<BookOpen className="h-4 w-4" />}
        />
      </div>

      <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#2E2A24]">
            Needs your attention
          </h2>
          <span className="text-xs text-[#2E2A24]/60">
            {urgentActions.filter((a) => a.urgency === "high").length} urgent
          </span>
        </div>
        {urgentActions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#D9CFC4] bg-white/60 p-8 text-center text-sm text-[#2E2A24]/60">
            All queues are clear. Nice work.
          </p>
        ) : (
          <div className="space-y-2">
            {urgentActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`group flex items-center justify-between rounded-xl border px-4 py-3 transition hover:border-[#E8A98C] ${
                    action.urgency === "high"
                      ? "border-red-200 bg-red-50/50"
                      : "border-[#D9CFC4] bg-white/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-lg p-2 ${
                        action.urgency === "high"
                          ? "bg-red-100 text-red-700"
                          : "bg-[#F2EAE0] text-[#2E2A24]"
                      }`}
                    >
                      {action.urgency === "high" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </span>
                    <span className="text-sm font-medium text-[#2E2A24]">
                      {action.label}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#2E2A24]/40 transition group-hover:translate-x-0.5 group-hover:text-[#2E2A24]" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#2E2A24]">
              Recent reflections
            </h2>
            <Link
              href="/moderation"
              className="text-xs font-semibold text-[#2E2A24]/70 hover:text-[#2E2A24]"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {moderation.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-[#D9CFC4] bg-white/60 p-3"
              >
                <div className="flex items-center justify-between text-xs text-[#2E2A24]/65">
                  <span className="font-semibold text-[#2E2A24]">
                    {post.user_handle}
                  </span>
                  <span>{post.room_name}</span>
                </div>
                <p className="mt-1 line-clamp-2 font-serif text-sm italic text-[#2E2A24]">
                  "{post.phrase}"
                </p>
              </div>
            ))}
            {moderation.length === 0 && (
              <p className="text-sm text-[#2E2A24]/60">
                No pending reflections.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-[#2E2A24]">
            Pastoral snapshot
          </h2>
          <div className="space-y-2">
            {pastoral.slice(0, 3).map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-[#D9CFC4] bg-white/70 p-3"
              >
                <p className="text-sm font-semibold text-[#2E2A24]">
                  {req.seeker_name}
                </p>
                <p className="mt-1 text-xs text-[#2E2A24]/65">
                  {req.status.replace("_", " ")}
                </p>
              </div>
            ))}
            {pastoral.length === 0 && (
              <p className="text-sm text-[#2E2A24]/60">
                No open pastoral requests.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}