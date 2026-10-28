export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-64 animate-pulse rounded-lg bg-[#D9CFC4]/40" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-[#D9CFC4]/30"
          />
        ))}
      </div>
    </div>
  );
}