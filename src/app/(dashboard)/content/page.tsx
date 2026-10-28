import { Plus } from "lucide-react";
import { getContentDrops } from "@/lib/supabase/queries";
import { PageHeader } from "@/Components/page-header";
import { ContentDropRow } from "@/Components/content-drop-row";

const checklist = [
  "Audio transcript approved",
  "Theme references checked",
  "Timing fits weekly journey",
];

export default async function ContentPage() {
  const drops = await getContentDrops();

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Scripture CMS"
        title="Weekly content"
        description="Manage audio drops, reflection cards, and scripture cues."
        action={
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#E8A98C] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#E8A98C]/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New drop
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-[#2E2A24]">
            Content library
          </h2>
          {drops.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D9CFC4] bg-white/60 p-8 text-center text-sm text-[#2E2A24]/60">
              No content drops yet. Create your first one above.
            </div>
          ) : (
            <div className="space-y-3">
              {drops.map((drop) => (
                <ContentDropRow key={drop.id} drop={drop} />
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-[#2E2A24]">
            Publishing notes
          </h2>
          <div className="space-y-3 text-sm text-[#2E2A24]/75">
            <div className="rounded-xl border border-[#D9CFC4] bg-white/70 p-3">
              <p className="font-semibold text-[#2E2A24]">Review checklist</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#D9CFC4] bg-white/70 p-3">
              <p className="font-semibold text-[#2E2A24]">Next publish</p>
              <p className="mt-2">Thursday • 8:00 AM • "Rest for the Weary"</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}