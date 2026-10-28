import { Volume2 } from "lucide-react";

const drops = [
  { title: "Week 1: Abiding in Christ", type: "Audio drop", status: "Published" },
  { title: "Week 2: Strength in waiting", type: "Reflection card", status: "Draft" },
  { title: "Week 3: Light in the wilderness", type: "Scripture cue", status: "Scheduled" },
];

export default function ContentPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#2E2A24]">Scripture CMS</h2>
          <button type="button" className="rounded-full bg-[#E8A98C] px-3 py-1.5 text-xs font-semibold text-white">
            New drop
          </button>
        </div>

        <div className="space-y-3">
          {drops.map((item) => (
            <div key={item.title} className="flex items-center justify-between rounded-xl border border-[#D9CFC4] bg-white/70 p-4">
              <div>
                <p className="font-semibold text-[#2E2A24]">{item.title}</p>
                <p className="text-xs text-[#2E2A24]/60">{item.type}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#2E2A24]/5 px-2 py-1 text-[10px] font-semibold text-[#2E2A24]">
                  {item.status}
                </span>
                <Volume2 className="h-4 w-4 text-[#2E2A24]/60" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-[#2E2A24]">Publishing notes</h2>
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
      </aside>
    </div>
  );
}
