import { CheckCircle, ShieldCheck, XCircle } from "lucide-react";

const queue = [
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

export default function ModerationPage() {
  return (
    <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#2E2A24]" />
          <h2 className="text-xl font-bold text-[#2E2A24]">Moderation queue</h2>
        </div>
        <span className="rounded-full bg-[#E8A98C]/15 px-3 py-1 text-xs font-semibold text-[#2E2A24]">
          {queue.length} pending
        </span>
      </div>

      <div className="space-y-4">
        {queue.map((post) => (
          <div
            key={post.id}
            className="flex flex-col gap-4 rounded-2xl border border-[#D9CFC4] bg-white/70 p-5 lg:flex-row lg:items-center lg:justify-between"
          >
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
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-[#E8A98C] px-3 py-2 text-xs font-semibold text-white shadow-sm"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
