export function StatCard({
  label, value, detail, icon, tone = "slate",
}: {
  label: string; value: string; detail: string;
  icon: React.ReactNode; tone?: "emerald" | "amber" | "rose" | "slate";
}) {
  const toneMap = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-50 text-slate-700",
  };
  return (
    <div className="flex h-full min-h-[148px] flex-col rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2E2A24]/60">
          {label}
        </p>
        <span className={`rounded-lg p-1.5 ${toneMap[tone]}`}>{icon}</span>
      </div>
      <div className="mt-auto pt-3">
        <p className="text-3xl font-bold leading-none text-[#2E2A24]">{value}</p>
        <p className="mt-2 text-xs text-[#2E2A24]/65">{detail}</p>
      </div>
    </div>
  );
}