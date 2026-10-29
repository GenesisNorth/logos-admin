"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { createContentDrop } from "@/lib/actions/content";
import { PageHeader } from "@/Components/page-header";
import { ContentDropRow } from "@/Components/content-drop-row";
import type { ContentDrop } from "@/lib/supabase/queries";

const checklist = [
  "Audio transcript approved",
  "Theme references checked",
  "Timing fits weekly journey",
];

export default function ContentPageClient({ drops }: { drops: ContentDrop[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isCreateOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) setIsCreateOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCreateOpen, isPending]);

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setErrorMessage("");

    startTransition(async () => {
      const result = await createContentDrop({
        title: String(formData.get("title") ?? ""),
        type: String(formData.get("type") ?? ""),
        status: String(formData.get("status") ?? "draft"),
        content: String(formData.get("content") ?? ""),
        mediaUrl: String(formData.get("mediaUrl") ?? ""),
        publishAt: String(formData.get("publishAt") ?? ""),
      });

      if (result?.error) {
        setErrorMessage(result.error);
        return;
      }

      form.reset();
      setIsCreateOpen(false);
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Scripture CMS"
        title="Weekly content"
        description="Manage audio drops, reflection cards, and scripture cues."
        action={
          <button
            type="button"
            onClick={() => {
              setErrorMessage("");
              setIsCreateOpen(true);
            }}
            aria-haspopup="dialog"
            className="flex items-center gap-2 rounded-lg bg-[#2E2A24] px-4 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            <Plus className="h-4 w-4" />
            New drop
          </button>
        }
      />

      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2E2A24]/55 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPending) setIsCreateOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-drop-title"
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#D9CFC4] bg-[#FAF6F0] shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#D9CFC4] px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2E2A24]/55">Scripture CMS</p>
                <h2 id="create-drop-title" className="mt-1 text-xl font-bold text-[#2E2A24]">Create content drop</h2>
                <p className="mt-1 text-sm text-[#2E2A24]/65">Add the content, then choose when it should be released.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                disabled={isPending}
                aria-label="Close create content dialog"
                className="rounded-md p-2 text-[#2E2A24]/65 hover:bg-[#F2EAE0] hover:text-[#2E2A24] disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <form onSubmit={handleCreate} className="flex min-h-0 flex-1 flex-col">
              <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                  <label className="space-y-1.5 text-sm font-medium text-[#2E2A24]">
                    Title
                    <input
                      name="title"
                      required
                      maxLength={160}
                      autoFocus
                      placeholder="e.g. Abiding in Christ"
                      className="w-full rounded-lg border border-[#D9CFC4] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E8A98C]"
                    />
                  </label>
                  <label className="space-y-1.5 text-sm font-medium text-[#2E2A24]">
                    Content type
                    <select name="type" className="w-full rounded-lg border border-[#D9CFC4] bg-white px-3 py-2.5 text-sm">
                      <option value="scripture">Scripture</option>
                      <option value="audio">Audio</option>
                      <option value="reflection">Reflection</option>
                    </select>
                  </label>
                </div>

                <label className="block space-y-1.5 text-sm font-medium text-[#2E2A24]">
                  Drop content
                  <textarea
                    name="content"
                    rows={7}
                    maxLength={20000}
                    placeholder="Write the scripture, reflection, or audio transcript..."
                    className="w-full resize-y rounded-lg border border-[#D9CFC4] bg-white px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-[#E8A98C]"
                  />
                </label>

                <label className="block space-y-1.5 text-sm font-medium text-[#2E2A24]">
                  Media URL <span className="font-normal text-[#2E2A24]/55">(optional)</span>
                  <input
                    name="mediaUrl"
                    type="url"
                    placeholder="https://..."
                    className="w-full rounded-lg border border-[#D9CFC4] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E8A98C]"
                  />
                </label>

                <div className="grid gap-4 border-t border-[#D9CFC4] pt-4 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm font-medium text-[#2E2A24]">
                    Initial status
                    <select name="status" className="w-full rounded-lg border border-[#D9CFC4] bg-white px-3 py-2.5 text-sm">
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published now</option>
                    </select>
                  </label>
                  <label className="space-y-1.5 text-sm font-medium text-[#2E2A24]">
                    Publish time
                    <input
                      name="publishAt"
                      type="datetime-local"
                      className="w-full rounded-lg border border-[#D9CFC4] bg-white px-3 py-2.5 text-sm"
                    />
                  </label>
                </div>

                {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
              </div>

              <footer className="flex flex-col-reverse gap-2 border-t border-[#D9CFC4] bg-white/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isPending}
                  className="rounded-lg border border-[#D9CFC4] px-4 py-2.5 text-sm font-semibold text-[#2E2A24] hover:bg-[#F2EAE0] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-[#2E2A24] px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Creating..." : "Create drop"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-[#2E2A24]">Content library</h2>
          {drops.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D9CFC4] bg-white/60 p-8 text-center text-sm text-[#2E2A24]/60">
              No content drops yet. Create your first one above.
            </div>
          ) : (
            <div className="space-y-3">
              {drops.map((drop) => <ContentDropRow key={drop.id} drop={drop} />)}
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-[#2E2A24]">Publishing notes</h2>
          <div className="space-y-3 text-sm text-[#2E2A24]/75">
            <div className="rounded-xl border border-[#D9CFC4] bg-white/70 p-3">
              <p className="font-semibold text-[#2E2A24]">Review checklist</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {checklist.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="rounded-xl border border-[#D9CFC4] bg-white/70 p-3">
              <p className="font-semibold text-[#2E2A24]">Next publish</p>
              <p className="mt-2">
                {drops.find((drop) => drop.status === "scheduled")?.title ?? "No content is scheduled."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
