"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { reviewVoiceSubmission, saveCommunitySpace } from "@/lib/actions/community";
import type { CommunitySpace, VoiceSubmission } from "@/lib/supabase/community-queries";

const labels = { valley_room: "Valley room", study_pod: "Study pod", prayer_circle: "Prayer circle" };

function SpaceForm({ space, onSaved }: { space?: CommunitySpace; onSaved?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [fixedPhrases, setFixedPhrases] = useState(space?.fixed_phrases ?? []);
  const [discussionQuestions, setDiscussionQuestions] = useState(space?.discussion_questions ?? []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage("");
    startTransition(async () => {
      const result = await saveCommunitySpace({
        id: space?.id,
        spaceType: String(data.get("spaceType") ?? ""),
        title: String(data.get("title") ?? ""),
        description: String(data.get("description") ?? ""),
        scheduleText: String(data.get("scheduleText") ?? ""),
        memberCapacity: String(data.get("memberCapacity") ?? ""),
        expirationDays: String(data.get("expirationDays") ?? ""),
        fixedPhrases: JSON.stringify(fixedPhrases),
        discussionQuestions: JSON.stringify(discussionQuestions),
        status: String(data.get("status") ?? "active"),
        sortOrder: String(data.get("sortOrder") ?? "0"),
      });
      setMessage(result?.error ?? "Saved.");
      if (!result?.error) onSaved?.();
    });
  };

  return (
    <form onSubmit={submit} className={`space-y-3 rounded-lg border border-[#D9CFC4] bg-white/70 p-4 ${isPending ? "opacity-60" : ""}`}>
      <div className="grid gap-3 sm:grid-cols-[150px_1fr_125px]">
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">Type
          <select name="spaceType" defaultValue={space?.space_type ?? "valley_room"} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2 py-2 text-sm">
            <option value="valley_room">Valley room</option><option value="study_pod">Study pod</option><option value="prayer_circle">Prayer circle</option>
          </select>
        </label>
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">Title
          <input name="title" required maxLength={120} defaultValue={space?.title ?? ""} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2 py-2 text-sm" />
        </label>
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">Status
          <select name="status" defaultValue={space?.status ?? "active"} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2 py-2 text-sm"><option value="active">Active</option><option value="paused">Paused</option></select>
        </label>
      </div>
      <label className="block space-y-1 text-xs font-semibold text-[#2E2A24]/75">Description
        <textarea name="description" rows={2} maxLength={2000} defaultValue={space?.description ?? ""} className="block w-full resize-y rounded-md border border-[#D9CFC4] bg-white px-2 py-2 text-sm" />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">Schedule
          <input name="scheduleText" maxLength={200} defaultValue={space?.schedule_text ?? ""} placeholder="Thu 8:00 PM EST" className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2 py-2 text-sm" />
        </label>
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">Member capacity
          <input name="memberCapacity" type="number" min="1" defaultValue={space?.member_capacity ?? ""} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2 py-2 text-sm" />
        </label>
        <label className="space-y-1 text-xs font-semibold text-[#2E2A24]/75">Prayer expiry (days)
          <input name="expirationDays" type="number" min="1" defaultValue={space?.expiration_days ?? ""} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2 py-2 text-sm" />
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <StringListEditor title="Encouragement phrases" items={fixedPhrases} onChange={setFixedPhrases} addLabel="Add phrase" />
        <StringListEditor title="Discussion questions" items={discussionQuestions} onChange={setDiscussionQuestions} addLabel="Add question" multiline />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#D9CFC4] pt-3">
        <label className="flex items-center gap-2 text-xs font-medium text-[#2E2A24]/75">Order <input name="sortOrder" type="number" defaultValue={space?.sort_order ?? 0} className="w-20 rounded-md border border-[#D9CFC4] bg-white px-2 py-1.5" /></label>
        <div className="flex items-center gap-3"><span role="status" className="text-xs text-red-700">{message}</span><button disabled={isPending} className="flex items-center gap-2 rounded-md bg-[#2E2A24] px-3 py-2 text-xs font-semibold text-white"><Save className="h-4 w-4" />{isPending ? "Saving" : "Save space"}</button></div>
      </div>
    </form>
  );
}

function VoiceReview({ submission }: { submission: VoiceSubmission }) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const review = (status: "approved" | "rejected") => {
    setError("");
    startTransition(async () => {
      const result = await reviewVoiceSubmission({ id: submission.id, status, reviewerNote: note });
      if (result?.error) setError(result.error);
    });
  };

  return (
    <article className={`space-y-3 rounded-lg border border-[#D9CFC4] bg-white/70 p-4 ${isPending ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-semibold text-[#2E2A24]">{submission.reader_name}</h3><p className="text-xs text-[#2E2A24]/60">{submission.scripture_reference} · {submission.season} · {new Date(submission.created_at).toLocaleString()}</p></div><a href={submission.audio_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#2E2A24] underline decoration-[#E8A98C] underline-offset-2">Open audio</a></div>
      <label className="block space-y-1 text-xs font-medium text-[#2E2A24]/75">Reviewer note<textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={2000} rows={2} className="block w-full rounded-md border border-[#D9CFC4] bg-white px-2 py-2 text-sm" /></label>
      <div className="flex justify-end gap-2"><button type="button" disabled={isPending} onClick={() => review("rejected")} className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"><X className="h-4 w-4" />Reject</button><button type="button" disabled={isPending} onClick={() => review("approved")} className="flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-semibold text-white"><Check className="h-4 w-4" />Approve</button></div>
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-[#2E2A24]" />}
    </article>
  );
}

export function CommunityOperations({ spaces, submissions }: { spaces: CommunitySpace[]; submissions: VoiceSubmission[] }) {
  const router = useRouter();
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<CommunitySpace | undefined>();
  const types = ["valley_room", "study_pod", "prayer_circle"] as const;

  useEffect(() => {
    if (!isSpaceModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSpaceModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSpaceModalOpen]);

  const openCreate = () => {
    setSelectedSpace(undefined);
    setIsSpaceModalOpen(true);
  };

  const openEdit = (space: CommunitySpace) => {
    setSelectedSpace(space);
    setIsSpaceModalOpen(true);
  };

  const closeAfterSave = () => {
    setIsSpaceModalOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end"><button type="button" onClick={openCreate} className="flex items-center gap-2 rounded-md bg-[#2E2A24] px-3 py-2 text-xs font-semibold text-white hover:bg-black"><Plus className="h-4 w-4" />Add space</button></div>
      {types.map((type) => {
        const group = spaces.filter((space) => space.space_type === type);
        return <section key={type} className="space-y-3"><h2 className="text-base font-bold text-[#2E2A24]">{labels[type]} <span className="text-xs font-normal text-[#2E2A24]/60">{group.length}</span></h2>{group.length ? <div className="divide-y divide-[#D9CFC4] rounded-lg border border-[#D9CFC4] bg-[#FAF6F0]">{group.map((space) => <article key={space.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"><div className="min-w-0"><p className="font-semibold text-[#2E2A24]">{space.title}</p><p className="text-xs text-[#2E2A24]/60"><span className="capitalize">{space.status}</span>{space.schedule_text ? ` · ${space.schedule_text}` : ""}</p></div><button type="button" onClick={() => openEdit(space)} aria-label={`Edit ${space.title}`} className="rounded-md border border-[#D9CFC4] bg-white p-2 text-[#2E2A24] hover:bg-[#F2EAE0]"><Pencil className="h-4 w-4" /></button></article>)}</div> : <p className="rounded-lg border border-dashed border-[#D9CFC4] bg-white/60 p-4 text-sm text-[#2E2A24]/60">No {labels[type].toLowerCase()} entries configured.</p>}</section>;
      })}
      <section className="space-y-3 border-t border-[#D9CFC4] pt-5"><h2 className="text-base font-bold text-[#2E2A24]">Voice Comfort review <span className="text-xs font-normal text-[#2E2A24]/60">{submissions.length} pending</span></h2>{submissions.length ? submissions.map((submission) => <VoiceReview key={submission.id} submission={submission} />) : <p className="rounded-lg border border-dashed border-[#D9CFC4] bg-white/60 p-6 text-sm text-[#2E2A24]/60">No voice contributions are awaiting review.</p>}</section>
      {isSpaceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E2A24]/55 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsSpaceModalOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="community-space-modal-title" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#D9CFC4] bg-[#FAF6F0] shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-[#D9CFC4] px-5 py-4 sm:px-6"><div><p className="text-xs font-semibold uppercase text-[#2E2A24]/55">Community operations</p><h2 id="community-space-modal-title" className="mt-1 text-xl font-bold text-[#2E2A24]">{selectedSpace ? `Edit ${selectedSpace.title}` : "Add community space"}</h2></div><button type="button" onClick={() => setIsSpaceModalOpen(false)} aria-label="Close community space editor" className="rounded-md p-2 text-[#2E2A24]/65 hover:bg-[#F2EAE0]"><X className="h-5 w-5" /></button></header>
            <div className="overflow-y-auto p-4 sm:p-6"><SpaceForm key={selectedSpace?.id ?? "new"} space={selectedSpace} onSaved={closeAfterSave} /></div>
          </section>
        </div>
      )}
    </div>
  );
}

function StringListEditor({
  title,
  items,
  onChange,
  addLabel,
  multiline = false,
}: {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  multiline?: boolean;
}) {
  return (
    <section className="space-y-2 rounded-md border border-[#D9CFC4] bg-[#FAF6F0] p-3">
      <div className="flex items-center justify-between gap-2"><h3 className="text-xs font-semibold text-[#2E2A24]/75">{title}</h3><button type="button" onClick={() => onChange([...items, ""])} className="flex items-center gap-1 rounded-md border border-[#D9CFC4] bg-white px-2 py-1 text-[11px] font-semibold text-[#2E2A24] hover:bg-[#F2EAE0]"><Plus className="h-3 w-3" />{addLabel}</button></div>
      {items.length === 0 && <p className="text-xs text-[#2E2A24]/55">No entries yet.</p>}
      {items.map((item, index) => {
        const Input = multiline ? "textarea" : "input";
        return <div key={index} className="flex items-start gap-2"><Input value={item} maxLength={500} rows={multiline ? 2 : undefined} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} className="min-w-0 flex-1 rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm" /><button type="button" aria-label={`Remove ${title.toLowerCase()} ${index + 1}`} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="rounded p-1.5 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>;
      })}
    </section>
  );
}