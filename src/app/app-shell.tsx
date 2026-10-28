"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, HeartHandshake, LayoutDashboard, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/moderation", label: "Moderation", icon: ShieldCheck },
  { href: "/the-well", label: "The Well", icon: HeartHandshake },
  { href: "/content", label: "Scripture CMS", icon: BookOpen },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        {children}
      </main>
    );
  }

  return (
    <>
      <header className="border-b border-[#D9CFC4] bg-[#FAF6F0] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8A98C] text-lg font-bold text-white shadow-sm">
              ✝
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#2E2A24]">LOGOS IN ME</h1>
              <p className="text-xs text-[#2E2A24]/70">Admin & Pastoral Care Console</p>
            </div>
          </div>

          <nav aria-label="Primary navigation" className="order-3 w-full overflow-x-auto sm:order-2 sm:w-auto">
            <ul className="flex min-w-max items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-[#2E2A24] text-white"
                          : "text-[#2E2A24]/70 hover:bg-[#F2EAE0] hover:text-[#2E2A24]"
                      }`}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="order-2 ml-auto hidden items-center gap-2 text-xs font-semibold text-[#2E2A24]/70 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Admin
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
        {children}
      </main>
    </>
  );
}