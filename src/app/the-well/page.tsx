import { AlertTriangle, CheckCircle } from "lucide-react";

const requests = [
  {
    id: "p-101",
    seeker: "Sarah (Overwhelmed Seeker)",
    submittedAt: "2h 12m ago",
    timeRemaining: "1h 48m",
    request:
      "I feel crippled by anxiety regarding my marriage and work fatigue. I need a word of prayer and scripture to hold onto tonight.",
  },
  {
    id: "p-102",
    seeker: "Marcus T.",
    submittedAt: "45m ago",
    timeRemaining: "3h 15m",
    request:
      "Struggling with recurring temptation and feeling distant from God. Could a pastor please respond with an audio prayer?",
  },
];

export default function TheWellPage() {
  return (
    <section className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2E2A24]">The Well</h2>
          <p className="text-sm text-[#2E2A24]/60">Pastoral care requests and response tracking.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
          <AlertTriangle className="h-3.5 w-3.5" />
          4-hour SLA active
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-2xl border border-[#D9CFC4] bg-white/70 p-5">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-[#2E2A24]">{request.seeker}</h3>
                <p className="text-xs text-[#2E2A24]/60">Received {request.submittedAt}</p>
              </div>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-700">
                SLA deadline: {request.timeRemaining}
              </span>
            </div>

            <p className="rounded-xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 text-sm leading-relaxed text-[#2E2A24]/80">
              “{request.request}”
            </p>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-[#2E2A24] px-3 py-2 text-xs font-semibold text-white"
              >
                <CheckCircle className="h-4 w-4" />
                Mark resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
