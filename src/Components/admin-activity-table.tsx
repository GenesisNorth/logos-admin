"use client";

import { useState } from "react";
import type { AdminActivity } from "@/lib/supabase/admin-activity-queries";

const tableLabels: Record<string, string> = {
  moderation_queue: "Moderation",
  pastoral_requests: "The Well",
  content_drops: "Scripture CMS",
  scripture_drops: "Journey CMS",
  community_spaces: "Community spaces",
  voice_submissions: "Voice review",
};

export function AdminActivityTable({ events }: { events: AdminActivity[] }) {
  const [tableFilter, setTableFilter] = useState("all");
  const filtered = tableFilter === "all" ? events : events.filter((event) => event.target_table === tableFilter);
  const tables = Array.from(new Set(events.map((event) => event.target_table)));

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#2E2A24]/65">Showing the latest {events.length} recorded changes.</p>
        <label className="flex items-center gap-2 text-xs font-medium text-[#2E2A24]/70">Area
          <select value={tableFilter} onChange={(event) => setTableFilter(event.target.value)} className="rounded-md border border-[#D9CFC4] bg-white px-2.5 py-2 text-sm text-[#2E2A24]">
            <option value="all">All admin activity</option>
            {tables.map((table) => <option key={table} value={table}>{tableLabels[table] ?? table}</option>)}
          </select>
        </label>
      </div>
      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#D9CFC4] bg-white/60 p-8 text-center text-sm text-[#2E2A24]/60">No admin actions have been recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#D9CFC4] bg-[#FAF6F0]">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="border-b border-[#D9CFC4] bg-white/60 text-xs uppercase text-[#2E2A24]/60"><tr><th className="px-4 py-3">When</th><th className="px-4 py-3">Admin</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Area</th><th className="px-4 py-3">Record</th><th className="px-4 py-3">Change summary</th></tr></thead>
            <tbody className="divide-y divide-[#D9CFC4]">
              {filtered.map((event) => (
                <tr key={event.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-[#2E2A24]/70">{new Date(event.occurred_at).toLocaleString()}</td>
                  <td className="px-4 py-3"><p className="font-medium text-[#2E2A24]">{event.actor_email ?? "Admin account"}</p><p className="text-xs capitalize text-[#2E2A24]/55">{event.actor_role.replaceAll("_", " ")}</p></td>
                  <td className="px-4 py-3"><span className="rounded-full bg-[#2E2A24]/5 px-2 py-1 text-xs capitalize text-[#2E2A24]">{event.action}</span></td>
                  <td className="px-4 py-3 text-sm text-[#2E2A24]">{tableLabels[event.target_table] ?? event.target_table}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#2E2A24]/65">{event.target_id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-xs text-[#2E2A24]/70">{Object.entries(event.summary).filter(([, value]) => value).map(([key, value]) => `${key.replaceAll("_", " ")}: ${value}`).join(" · ") || "Record changed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-[#2E2A24]/55">Audit entries capture action metadata, not request, reflection, or content bodies.</p>
    </section>
  );
}