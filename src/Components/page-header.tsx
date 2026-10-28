export function PageHeader({
  eyebrow, title, description, action,
}: {
  eyebrow?: string; title: string;
  description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2E2A24]/55">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-2xl font-bold text-[#2E2A24]">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-[#2E2A24]/65">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}