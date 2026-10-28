import Sidebar from "@/Components/Sidebar";
import { getDashboardCounts } from "@/lib/supabase/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const counts = await getDashboardCounts();

  return (
    <div className="min-h-screen bg-[#F2EAE0]">
      <Sidebar counts={counts} />
      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}