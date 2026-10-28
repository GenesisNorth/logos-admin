import { AlertTriangle, HeartHandshake } from "lucide-react";
import { getPastoralRequests } from "@/lib/supabase/queries";
import { PageHeader } from "@/Components/page-header";
import { PastoralRequestCard } from "@/Components/pastoral-request-card";

export default async function TheWellPage() {
  const requests = await getPastoralRequests();

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Pastoral care"
        title="The Well"
        description="Private requests from seekers — respond within the 4-hour SLA window."
        action={
          <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" />
            4-hour SLA active
          </div>
        }
      />

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D9CFC4] bg-white/60 p-12 text-center">
          <HeartHandshake className="mx-auto h-8 w-8 text-emerald-600" />
          <p className="mt-3 text-sm font-semibold text-[#2E2A24]">
            The Well is quiet
          </p>
          <p className="mt-1 text-xs text-[#2E2A24]/60">
            No open pastoral requests right now.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <PastoralRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}