import { Activity, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/Components/page-header";
import { AdminActivityTable } from "@/Components/admin-activity-table";
import { getAdminActivity } from "@/lib/supabase/admin-activity-queries";

export default async function AdminActivityPage() {
  const result = await getAdminActivity();

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Governance" title="Admin activity" description="Audit trail of changes made by admin accounts." action={<span className="inline-flex items-center gap-2 rounded-md border border-[#D9CFC4] bg-white/70 px-3 py-2 text-xs font-semibold"><Activity className="h-4 w-4" />Audit log</span>} />
      {!result.authorized ? (
        <section className="rounded-lg border border-amber-300 bg-amber-50 p-5">
          <ShieldAlert className="h-5 w-5 text-amber-800" />
          <h2 className="mt-2 font-bold text-amber-950">Super-admin access required</h2>
          <p className="mt-1 text-sm text-amber-900/80">This activity log is restricted to active accounts with the <code>super_admin</code> role.</p>
        </section>
      ) : <AdminActivityTable events={result.events} />}
    </div>
  );
}