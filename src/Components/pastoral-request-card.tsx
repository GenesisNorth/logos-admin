"use client";

import { FormEvent, useState, useTransition } from "react";
import { AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { resolvePastoralRequest, savePastoralResponse } from "@/lib/actions/pastoral";
import { formatRelative, formatTimeRemaining } from "@/lib/utils/format";
import type { PastoralRequest } from "@/lib/supabase/queries";

const urgencyStyles = {
  ok: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-800",
  critical: "bg-red-100 text-red-700",
  overdue: "bg-red-600 text-white",
};

export function PastoralRequestCard({
  request,
}: {
  request: PastoralRequest;
}) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const sla = formatTimeRemaining(request.sla_deadline);

  const handleSaveResponse = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrorMessage("");

    startTransition(async () => {
      const result = await savePastoralResponse({
        id: request.id,
        responseText: String(formData.get("responseText") ?? ""),
        responseAudioUrl: String(formData.get("responseAudioUrl") ?? ""),
      });
      if (result?.error) setErrorMessage(result.error);
    });
  };

  const handleResolve = () => {
    setErrorMessage("");
    startTransition(async () => {
      const result = await resolvePastoralRequest(request.id);
      if (result?.error) setErrorMessage(result.error);
    });
  };

  return (
    <div
      className={`rounded-2xl border bg-white/70 p-5 transition ${
        sla.urgency === "critical" || sla.urgency === "overdue"
          ? "border-red-300"
          : "border-[#D9CFC4]"
      } ${isPending ? "opacity-50" : ""}`}
    >
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-[#2E2A24]">
            {request.seeker_name}
          </h3>
          <p className="text-xs text-[#2E2A24]/60">
            Received {formatRelative(request.created_at)}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${urgencyStyles[sla.urgency]}`}
        >
          {sla.urgency === "overdue" || sla.urgency === "critical" ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          SLA: {sla.label}
        </span>
      </div>

      <p className="rounded-xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 text-sm leading-relaxed text-[#2E2A24]/80">
        "{request.request_text}"
      </p>

      <form onSubmit={handleSaveResponse} className="mt-4 space-y-3 border-t border-[#D9CFC4] pt-4">
        <label className="block space-y-1 text-xs font-medium text-[#2E2A24]/75">
          Pastoral response
          <textarea
            name="responseText"
            rows={4}
            maxLength={20000}
            defaultValue={request.response_text ?? ""}
            className="block w-full resize-y rounded-md border border-[#D9CFC4] bg-white px-3 py-2 text-sm text-[#2E2A24]"
          />
        </label>
        <label className="block space-y-1 text-xs font-medium text-[#2E2A24]/75">
          Audio response URL
          <input
            name="responseAudioUrl"
            type="url"
            defaultValue={request.response_audio_url ?? ""}
            placeholder="https://..."
            className="block w-full rounded-md border border-[#D9CFC4] bg-white px-3 py-2 text-sm text-[#2E2A24]"
          />
        </label>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg border border-[#D9CFC4] bg-white px-3 py-2 text-xs font-semibold text-[#2E2A24] transition hover:bg-[#F2EAE0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save response
          </button>
        <button
          type="button"
          onClick={handleResolve}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-[#2E2A24] px-3 py-2 text-xs font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Mark resolved
        </button>
        </div>
        {errorMessage && <p role="alert" className="text-xs text-red-700">{errorMessage}</p>}
      </form>
    </div>
  );
}