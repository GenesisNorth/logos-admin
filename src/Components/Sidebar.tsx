"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, HeartHandshake, LayoutDashboard,
  ShieldCheck, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";
import type { DashboardCounts } from "@/lib/supabase/queries";

export default function Sidebar({ counts }: { counts: DashboardCounts }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard, badge: 0 },
    {
      href: "/moderation",
      label: "Moderation",
      icon: ShieldCheck,
      badge: counts.moderationPending,
    },
    {
      href: "/the-well",
      label: "The Well",
      icon: HeartHandshake,
      badge: counts.pastoralAtRisk,
      urgent: true,
    },
    {
      href: "/content",
      label: "Scripture CMS",
      icon: BookOpen,
      badge: counts.contentDrafts,
    },
  ];

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-[#D9CFC4] bg-[#FAF6F0] px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8A98C] text-lg font-bold text-white">
            ✝
          </div>
          <div>
            <p className="text-sm font-bold text-[#2E2A24]">LOGOS IN ME</p>
            <p className="text-[10px] text-[#2E2A24]/60">Admin Console</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((isOpen) => !isOpen)}
          className="rounded-lg p-2 text-[#2E2A24] hover:bg-[#F2EAE0]"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#D9CFC4] bg-[#FAF6F0] transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-[#D9CFC4] px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8A98C] text-lg font-bold text-white shadow-sm">
            ✝
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-[#2E2A24]">
              LOGOS IN ME
            </h1>
            <p className="text-[10px] text-[#2E2A24]/60">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Primary navigation">
          {navItems.map(({ href, label, icon: Icon, badge, urgent }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#2E2A24] text-white"
                    : "text-[#2E2A24]/75 hover:bg-[#F2EAE0] hover:text-[#2E2A24]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </span>
                {badge > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : urgent
                          ? "bg-red-100 text-red-700"
                          : "bg-[#E8A98C]/20 text-[#2E2A24]"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#D9CFC4] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2E2A24]/10 text-xs font-bold text-[#2E2A24]">
              PA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#2E2A24]">
                Pastor Admin
              </p>
              <p className="flex items-center gap-1 text-[10px] text-[#2E2A24]/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </p>
            </div>
            <button
              className="rounded-md p-1.5 text-[#2E2A24]/60 hover:bg-[#F2EAE0] hover:text-[#2E2A24]"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}