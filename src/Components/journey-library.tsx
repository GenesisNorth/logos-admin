"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Pencil, Plus, X } from "lucide-react";
import { PageHeader } from "@/Components/page-header";
import { JourneyDropForm } from "@/Components/journey-drop-form";
import type { ScriptureDrop } from "@/lib/supabase/journey-queries";

export function JourneyLibrary({ drops }: { drops: ScriptureDrop[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDrop, setSelectedDrop] = useState<ScriptureDrop | undefined>();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const openCreate = () => {
    setSelectedDrop(undefined);
    setIsOpen(true);
  };

  const openEdit = (drop: ScriptureDrop) => {
    setSelectedDrop(drop);
    setIsOpen(true);
  };

  const closeAfterSave = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Journey publishing"
        title="Weekly Scripture journey"
        description="Manage the Scripture, encounter, context, and stillness content for each week."
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md border border-[#D9CFC4] bg-white/70 px-3 py-2 text-xs font-semibold"><BookOpen className="h-4 w-4" />{drops.length} weeks</span>
            <button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-md bg-[#2E2A24] px-3 py-2 text-xs font-semibold text-white hover:bg-black"><Plus className="h-4 w-4" />New week</button>
          </div>
        }
      />
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[#2E2A24]">Journey library</h2>
        {drops.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#D9CFC4] bg-white/60 p-8 text-center text-sm text-[#2E2A24]/60">No journey weeks have been configured yet.</p>
        ) : (
          <div className="divide-y divide-[#D9CFC4] rounded-lg border border-[#D9CFC4] bg-[#FAF6F0]">
            {drops.map((drop) => (
              <article key={drop.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0"><p className="font-semibold text-[#2E2A24]">Week {drop.week_number}: {drop.title}</p><p className="text-xs text-[#2E2A24]/60">{drop.target_reference} · <span className="capitalize">{drop.status}</span></p></div>
                <button type="button" onClick={() => openEdit(drop)} aria-label={`Edit week ${drop.week_number}`} className="rounded-md border border-[#D9CFC4] bg-white p-2 text-[#2E2A24] hover:bg-[#F2EAE0]"><Pencil className="h-4 w-4" /></button>
              </article>
            ))}
          </div>
        )}
      </section>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E2A24]/55 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="journey-modal-title" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#D9CFC4] bg-[#FAF6F0] shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-[#D9CFC4] px-5 py-4 sm:px-6"><div><p className="text-xs font-semibold uppercase text-[#2E2A24]/55">Journey publishing</p><h2 id="journey-modal-title" className="mt-1 text-xl font-bold text-[#2E2A24]">{selectedDrop ? `Edit week ${selectedDrop.week_number}` : "Create journey week"}</h2></div><button type="button" onClick={() => setIsOpen(false)} aria-label="Close journey editor" className="rounded-md p-2 text-[#2E2A24]/65 hover:bg-[#F2EAE0]"><X className="h-5 w-5" /></button></header>
            <div className="overflow-y-auto p-4 sm:p-6"><JourneyDropForm key={selectedDrop?.id ?? "new"} drop={selectedDrop} onSaved={closeAfterSave} /></div>
          </section>
        </div>
      )}
    </div>
  );
}