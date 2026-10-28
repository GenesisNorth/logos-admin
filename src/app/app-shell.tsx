"use client";

import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F2EAE0] px-4 py-8">
        {children}
      </main>
    );
  }
  // Dashboard pages already render their own sidebar via (dashboard)/layout.tsx
  return <>{children}</>;
}