export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-64 animate-pulse rounded-lg bg-[#D9CFC4]/40" />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="h-96 animate-pulse rounded-2xl bg-[#D9CFC4]/30" />
        <div className="h-96 animate-pulse rounded-2xl bg-[#D9CFC4]/30" />
      </div>
    </div>
  );
}