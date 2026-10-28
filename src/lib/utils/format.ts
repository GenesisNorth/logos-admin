export function formatRelative(date: string | Date): string {
  const then = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - then.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function formatTimeRemaining(deadline: string): {
  label: string;
  urgency: "ok" | "warning" | "critical" | "overdue";
} {
  const remainingMs = new Date(deadline).getTime() - Date.now();
  if (remainingMs < 0) return { label: "Overdue", urgency: "overdue" };
  const mins = Math.floor(remainingMs / 60000);
  if (mins < 30) return { label: `${mins}m left`, urgency: "critical" };
  const hours = Math.floor(mins / 60);
  if (hours < 2) return { label: `${hours}h ${mins % 60}m left`, urgency: "warning" };
  return { label: `${hours}h left`, urgency: "ok" };
}