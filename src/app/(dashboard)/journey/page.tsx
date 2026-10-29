import { BookOpen } from "lucide-react";
import { PageHeader } from "@/Components/page-header";
import { JourneyDropForm } from "@/Components/journey-drop-form";
import { getScriptureDrops } from "@/lib/supabase/journey-queries";

export default async function JourneyPage() {
  const drops = await getScriptureDrops();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Journey publishing"
        title="Weekly Scripture journey"
        description="Manage the Scripture, encounter, context, and stillness content for each week."
        action={<span className="inline-flex items-center gap-2 rounded-md border border-[#D9CFC4] bg-white/70 px-3 py-2 text-xs font-semibold"><BookOpen className="h-4 w-4" />{drops.length} weeks</span>}
      />
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[#2E2A24]">Create a week</h2>
        <JourneyDropForm />
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[#2E2A24]">Journey library</h2>
        {drops.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#D9CFC4] bg-white/60 p-8 text-center text-sm text-[#2E2A24]/60">No journey weeks have been configured yet.</p>
        ) : drops.map((drop) => (
          <details key={drop.id} className="group rounded-lg border border-[#D9CFC4] bg-[#FAF6F0]">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-3">
              <span className="font-semibold text-[#2E2A24]">Week {drop.week_number}: {drop.title}</span>
              <span className="flex items-center gap-3 text-xs capitalize text-[#2E2A24]/60"><span>{drop.target_reference}</span><span>{drop.status}</span></span>
            </summary>
            <div className="border-t border-[#D9CFC4] p-3 sm:p-4">
              <JourneyDropForm drop={drop} />
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}