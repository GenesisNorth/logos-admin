const variants = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  neutral: "bg-slate-100 text-slate-600",
  info: "bg-[#E8A98C]/20 text-[#2E2A24]",
};

export function StatusBadge({
  children, variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}