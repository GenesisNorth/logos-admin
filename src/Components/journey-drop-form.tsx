"use client";

import { FormEvent, useState, useTransition } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { saveScriptureDrop } from "@/lib/actions/journey";
import type { ScriptureDrop } from "@/lib/supabase/journey-queries";

const emptyDrop: Omit<ScriptureDrop, "id"> = {
  week_number: 1,
  title: "",
  target_reference: "",
  verse_text: "",
  translation: "ESV",
  day_1_video_url: null,
  day_1_encounter_lines: [],
  day_2_context_cards: [],
  day_3_ambient_preset: "sanctuary_dawn",
  day_3_ambient_label: "Sanctuary Dawn",
  status: "draft",
  publish_at: null,
};

export function JourneyDropForm({ drop }: { drop?: ScriptureDrop }) {
  const current = drop ?? emptyDrop;
  const [isPending, startTransition] = useTransition();
  const [contextCards, setContextCards] = useState(current.day_2_context_cards);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const localPublishAt = current.publish_at
    ? new Date(new Date(current.publish_at).getTime() - new Date(current.publish_at).getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    : "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      const result = await saveScriptureDrop({
        id: drop?.id,
        weekNumber: String(formData.get("weekNumber") ?? ""),
        title: String(formData.get("title") ?? ""),
        reference: String(formData.get("reference") ?? ""),
        verseText: String(formData.get("verseText") ?? ""),
        translation: String(formData.get("translation") ?? ""),
        videoUrl: String(formData.get("videoUrl") ?? ""),
        encounterLines: String(formData.get("encounterLines") ?? ""),
        contextCards: JSON.stringify(contextCards),
        ambientPreset: String(formData.get("ambientPreset") ?? ""),
        ambientLabel: String(formData.get("ambientLabel") ?? ""),
        status: String(formData.get("status") ?? "draft"),
        publishAt: String(formData.get("publishAt") ?? ""),
      });
      if (result?.error) {
        setErrorMessage(result.error);
        return;
      }
      setSuccessMessage("Journey content saved.");
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 rounded-lg border border-[#D9CFC4] bg-white/70 p-4 ${isPending ? "opacity-60" : ""}`}>
      <div className="grid gap-3 sm:grid-cols-[100px_1fr_130px]">
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">
          Week
          <input name="weekNumber" type="number" min="1" required defaultValue={current.week_number} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" />
        </label>
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">
          Title
          <input name="title" required maxLength={160} defaultValue={current.title} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" />
        </label>
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">
          Status
          <select name="status" defaultValue={current.status} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm">
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_130px]">
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">
          Scripture reference
          <input name="reference" required maxLength={100} defaultValue={current.target_reference} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" />
        </label>
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">
          Translation
          <input name="translation" required maxLength={40} defaultValue={current.translation} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" />
        </label>
      </div>
      <label className="block space-y-1 text-xs font-semibold text-[#2E2A24]/75">
        Verse text
        <textarea name="verseText" required maxLength={10000} rows={3} defaultValue={current.verse_text} className="block w-full resize-y rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" />
      </label>
      <div className="grid gap-3 lg:grid-cols-2">
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">
          Day 1 video URL
          <input name="videoUrl" type="url" defaultValue={current.day_1_video_url ?? ""} placeholder="https://..." className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" />
        </label>
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">
          Publish time
          <input name="publishAt" type="datetime-local" defaultValue={localPublishAt} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" />
        </label>
      </div>
      <label className="block space-y-1 text-xs font-semibold text-[#2E2A24]/75">
        Day 1 encounter lines <span className="font-normal">(one line per screen)</span>
        <textarea name="encounterLines" rows={4} defaultValue={current.day_1_encounter_lines.join("\n")} className="block w-full resize-y rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" />
      </label>
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xs font-semibold text-[#2E2A24]/75">Day 2 context cards</h3>
          <button type="button" onClick={() => setContextCards((cards) => [...cards, { title: "", subtitle: "", content: "" }])} className="flex items-center gap-1 rounded-md border border-[#D9CFC4] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#2E2A24] hover:bg-[#F2EAE0]"><Plus className="h-3.5 w-3.5" />Add card</button>
        </div>
        {contextCards.length === 0 && <p className="rounded-md border border-dashed border-[#D9CFC4] p-3 text-xs text-[#2E2A24]/60">No context cards added.</p>}
        {contextCards.map((card, index) => (
          <fieldset key={index} className="space-y-3 rounded-md border border-[#D9CFC4] bg-[#FAF6F0] p-3">
            <div className="flex items-center justify-between"><legend className="text-xs font-semibold text-[#2E2A24]">Context card {index + 1}</legend><button type="button" aria-label={`Remove context card ${index + 1}`} onClick={() => setContextCards((cards) => cards.filter((_, cardIndex) => cardIndex !== index))} className="rounded p-1.5 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-medium text-[#2E2A24]/75">Title<input value={card.title} maxLength={160} onChange={(event) => setContextCards((cards) => cards.map((item, cardIndex) => cardIndex === index ? { ...item, title: event.target.value } : item))} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" /></label>
              <label className="space-y-1 text-xs font-medium text-[#2E2A24]/75">Subtitle<input value={card.subtitle} maxLength={200} onChange={(event) => setContextCards((cards) => cards.map((item, cardIndex) => cardIndex === index ? { ...item, subtitle: event.target.value } : item))} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" /></label>
            </div>
            <label className="block space-y-1 text-xs font-medium text-[#2E2A24]/75">Explanation<textarea value={card.content} maxLength={5000} rows={3} onChange={(event) => setContextCards((cards) => cards.map((item, cardIndex) => cardIndex === index ? { ...item, content: event.target.value } : item))} className="block w-full resize-y rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" /></label>
          </fieldset>
        ))}
      </section>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">
          Day 3 ambient preset
          <input name="ambientPreset" required defaultValue={current.day_3_ambient_preset} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" />
        </label>
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">
          Day 3 ambient label
          <input name="ambientLabel" required defaultValue={current.day_3_ambient_label} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" />
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#D9CFC4] pt-3">
        <p role={errorMessage ? "alert" : "status"} className={`text-xs ${errorMessage ? "text-red-700" : "text-emerald-700"}`}>{errorMessage || successMessage}</p>
        <button type="submit" disabled={isPending} className="flex items-center gap-2 rounded-md bg-[#2E2A24] px-3 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-50">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isPending ? "Saving..." : drop ? "Save week" : "Create week"}
        </button>
      </div>
    </form>
  );
}