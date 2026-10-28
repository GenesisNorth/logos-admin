"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  Volume2,
  XCircle,
} from "lucide-react";

type TabKey = "overview" | "moderation" | "the-well" | "content";

const stats = [
  {
    label: "North Star Metric",
    value: "71.4%",
    detail: "Day 4 Journey Completion Rate",
    trend: "+4.2%",
    tone: "emerald",
  },
  {
    label: "Moderation Queue",
    value: "8",
    detail: "Pending review",
    trend: "14 min avg",
    tone: "amber",
  },
  {
    label: "The Well SLA",
    value: "100%",
    detail: "Within 4 hours",
    trend: "3 at risk",
    tone: "rose",
  },
  {
    label: "Active Cycle",
    value: "Week 1",
    detail: "John 15:5 (ESV)",
    trend: "Live +",
    tone: "slate",
  },
];

const quickActions = [
  "Approve 3 flagged reflections",
  "Review pastoral urgent queue",
  "Publish weekly scripture drop",
  "Check completion cohort analytics",
];

const moderationQueueSeed = [
  {
    id: "v-1",
    user: "Seeker_719",
    room: "Navigating Grief in the Psalms",
    phrase: "Praying for comfort in the silence",
    reflection:
      "Lost my grandfather this past Monday. Remembering that the Lord is near to the brokenhearted.",
    submittedAt: "18m ago",
  },
  {
    id: "v-2",
    user: "JordanM",
    room: "Faith in the Corporate Workplace",
    phrase: "Seeking wisdom for difficult meetings",
    reflection:
      "Facing layoffs at my company tomorrow. Praying for peace and ethical clarity.",
    submittedAt: "42m ago",
  },
  {
    id: "v-3",
    user: "Miriam_L",
    room: "Community Prayer Rhythm",
    phrase: "Learning to rest in God’s timing",
    reflection:
      "I’ve been waiting on several answers and am learning to trust the Father’s pace. Please pray with me.",
    submittedAt: "1h ago",
  },
];

const pastoralRequestsSeed = [
  {
    id: "p-101",
    seeker: "Sarah (Overwhelmed Seeker)",
    status: "Received",
    timeRemaining: "1h 48m",
    request:
      "I feel crippled by anxiety regarding my marriage and work fatigue. I need a word of prayer and scripture to hold onto tonight.",
    submittedAt: "2h 12m ago",
  },
  {
    id: "p-102",
    seeker: "Marcus T.",
    status: "Received",
    timeRemaining: "3h 15m",
    request:
      "Struggling with recurring temptation and feeling distant from God. Could a pastor please respond with an audio prayer?",
    submittedAt: "45m ago",
  },
];

const scheduleSeed = [
  { day: "Mon", theme: "The Cost of Obedience", state: "Published" },
  { day: "Tue", theme: "Praying in the Waiting", state: "Queued" },
  { day: "Wed", theme: "The Fear of the Lord", state: "Draft" },
  { day: "Thu", theme: "Rest for the Weary", state: "Published" },
  { day: "Fri", theme: "Abiding in Christ", state: "Queued" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [pendingValleyPosts, setPendingValleyPosts] = useState(moderationQueueSeed);
  const [pastoralRequests, setPastoralRequests] = useState(pastoralRequestsSeed);

  const handleApprove = (id: string) => {
    setPendingValleyPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingValleyPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handleResolvePastoral = (id: string) => {
    setPastoralRequests((prev) => prev.filter((request) => request.id !== id));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2E2A24]/60">
              {stat.label}
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#2E2A24]">{stat.value}</span>
              <span
                className={
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                  (stat.tone === "emerald"
                    ? "bg-emerald-100 text-emerald-700"
                    : stat.tone === "amber"
                      ? "bg-amber-100 text-amber-700"
                      : stat.tone === "rose"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-100 text-slate-700")
                }
              >
                {stat.trend}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#2E2A24]/70">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "overview", label: "Overview", icon: TrendingUp },
              { key: "moderation", label: `Moderation (${pendingValleyPosts.length})`, icon: ShieldCheck },
              { key: "the-well", label: `The Well (${pastoralRequests.length})`, icon: HeartHandshake },
              { key: "content", label: "Scripture CMS", icon: BookOpen },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key as TabKey)}
                className={
                  "flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition " +
                  (activeTab === key
                    ? "border-[#E8A98C] bg-[#E8A98C]/12 text-[#2E2A24]"
                    : "border-transparent bg-transparent text-[#2E2A24]/60 hover:border-[#D9CFC4] hover:bg-white/60")
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#2E2A24] px-3 py-2 text-xs font-semibold text-white">
            <Calendar className="h-3.5 w-3.5" />
            Week of Prayer • Live
          </div>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#2E2A24]">Moderation queue</h2>
                <span className="text-xs text-[#2E2A24]/60">Zero unmoderated public posts</span>
              </div>

              <div className="space-y-4">
                {pendingValleyPosts.slice(0, 2).map((post) => (
                  <div key={post.id} className="rounded-xl border border-[#D9CFC4] bg-white/60 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs text-[#2E2A24]/65">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#2E2A24]">{post.user}</span>
                        <span>•</span>
                        <span>{post.room}</span>
                      </div>
                      <span>{post.submittedAt}</span>
                    </div>
                    <p className="font-serif text-sm italic text-[#2E2A24]">“{post.phrase}”</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#2E2A24]/80">{post.reflection}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#2E2A24]">Weekly scripture planning</h2>
                <button type="button" className="rounded-full border border-[#D9CFC4] px-3 py-1.5 text-xs font-semibold text-[#2E2A24]">
                  Open planner
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#D9CFC4]">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#F2EAE0] text-[#2E2A24]/70">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Day</th>
                      <th className="px-4 py-3 font-semibold">Title</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleSeed.map((entry) => (
                      <tr key={entry.day} className="border-t border-[#D9CFC4] bg-white/50">
                        <td className="px-4 py-3 font-medium text-[#2E2A24]">{entry.day}</td>
                        <td className="px-4 py-3 text-[#2E2A24]/80">{entry.theme}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              "rounded-full px-2.5 py-1 text-[11px] font-semibold " +
                              (entry.state === "Published"
                                ? "bg-emerald-100 text-emerald-700"
                                : entry.state === "Queued"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600")
                            }
                          >
                            {entry.state}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#2E2A24]">Quick actions</h2>
                <Clock className="h-4 w-4 text-[#2E2A24]/60" />
              </div>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-[#D9CFC4] bg-white/70 px-3 py-2 text-left text-sm text-[#2E2A24]/80 hover:border-[#E8A98C]"
                  >
                    <span>{action}</span>
                    <span className="text-[#2E2A24]/40">→</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-[#2E2A24]">Pastoral care snapshot</h2>
              <div className="space-y-3">
                {pastoralRequests.slice(0, 2).map((request) => (
                  <div key={request.id} className="rounded-xl border border-[#D9CFC4] bg-white/70 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#2E2A24]">{request.seeker}</span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[#2E2A24]/65">SLA: {request.timeRemaining}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      )}

      {activeTab === "moderation" && (
        <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#2E2A24]">In The Valley moderation</h2>
              <p className="text-sm text-[#2E2A24]/60">Review public reflections before publishing to the community board.</p>
            </div>
            <span className="rounded-full bg-[#E8A98C]/15 px-3 py-1 text-xs font-semibold text-[#2E2A24]">
              {pendingValleyPosts.length} pending
            </span>
          </div>

          {pendingValleyPosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D9CFC4] bg-white/70 p-10 text-center text-sm text-[#2E2A24]/60">
              All moderation items are clear. No public posts are awaiting review.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingValleyPosts.map((post) => (
                <div key={post.id} className="flex flex-col gap-4 rounded-2xl border border-[#D9CFC4] bg-white/70 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#2E2A24]/70">
                      <span className="font-semibold text-[#2E2A24]">{post.user}</span>
                      <span>•</span>
                      <span className="rounded-full bg-[#2E2A24]/5 px-2 py-1 text-[#2E2A24]">{post.room}</span>
                      <span>•</span>
                      <span>{post.submittedAt}</span>
                    </div>
                    <p className="font-serif text-sm italic text-[#2E2A24]">“{post.phrase}”</p>
                    <p className="max-w-3xl text-sm leading-relaxed text-[#2E2A24]/80">{post.reflection}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(post.id)}
                      className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(post.id)}
                      className="flex items-center gap-2 rounded-lg bg-[#E8A98C] px-3 py-2 text-xs font-semibold text-white shadow-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "the-well" && (
        <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#2E2A24]">The Well: pastoral care</h2>
              <p className="text-sm text-[#2E2A24]/60">Private requests routed to pastoral team members and monitored against SLA.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5" />
              4-hour SLA active
            </div>
          </div>

          <div className="space-y-4">
            {pastoralRequests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-[#D9CFC4] bg-white/70 p-5">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#2E2A24]">{request.seeker}</h3>
                    <p className="text-xs text-[#2E2A24]/60">Received {request.submittedAt}</p>
                  </div>
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-700">
                    SLA deadline: {request.timeRemaining}
                  </span>
                </div>

                <p className="rounded-xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 text-sm leading-relaxed text-[#2E2A24]/80">
                  “{request.request}”
                </p>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleResolvePastoral(request.id)}
                    className="flex items-center gap-2 rounded-lg bg-[#2E2A24] px-3 py-2 text-xs font-semibold text-white"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "content" && (
        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#2E2A24]">Scripture CMS</h2>
              <button type="button" className="rounded-full bg-[#E8A98C] px-3 py-1.5 text-xs font-semibold text-white">
                New drop
              </button>
            </div>

            <div className="space-y-3">
              {[
                { title: "Week 1: Abiding in Christ", type: "Audio drop", status: "Published" },
                { title: "Week 2: Strength in waiting", type: "Reflection card", status: "Draft" },
                { title: "Week 3: Light in the wilderness", type: "Scripture cue", status: "Scheduled" },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-xl border border-[#D9CFC4] bg-white/70 p-4">
                  <div>
                    <p className="font-semibold text-[#2E2A24]">{item.title}</p>
                    <p className="text-xs text-[#2E2A24]/60">{item.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#2E2A24]/5 px-2 py-1 text-[10px] font-semibold text-[#2E2A24]">{item.status}</span>
                    <Volume2 className="h-4 w-4 text-[#2E2A24]/60" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-[#2E2A24]">Publishing notes</h2>
            <div className="space-y-3 text-sm text-[#2E2A24]/75">
              <div className="rounded-xl border border-[#D9CFC4] bg-white/70 p-3">
                <p className="font-semibold text-[#2E2A24]">Review checklist</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Audio transcript approved</li>
                  <li>Theme references checked</li>
                  <li>Timing fits weekly journey</li>
                </ul>
              </div>
              <div className="rounded-xl border border-[#D9CFC4] bg-white/70 p-3">
                <p className="font-semibold text-[#2E2A24]">Next publish</p>
                <p className="mt-2">Thursday • 8:00 AM • “Rest for the Weary”</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
