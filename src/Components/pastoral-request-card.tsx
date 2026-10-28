"use client";

import { useTransition } from "react";
import { AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { resolvePastoralRequest } from "@/lib/actions/pastoral";
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
  const sla = formatTimeRemaining(request.sla_deadline);

  const handleResolve = () => {
    startTransition(async () => {
      await resolvePastoralRequest(request.id);
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

      <div className="mt-4 flex justify-end">
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
    </div>
  );
}