import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOGOS IN ME — Admin, CMS & Pastoral Portal",
  description: "Moderation console, weekly scripture scheduler, and pastoral care portal for LOGOS IN ME.",
};

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/moderation", label: "Moderation" },
  { href: "/the-well", label: "The Well" },
  { href: "/content", label: "Scripture CMS" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F2EAE0] text-[#2E2A24] antialiased">
        <div className="min-h-screen bg-[#F2EAE0]">
          <header className="border-b border-[#D9CFC4] bg-[#FAF6F0] px-6 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8A98C] text-lg font-bold text-white shadow-sm">
                  ✝
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-[#2E2A24]">LOGOS IN ME</h1>
                  <p className="text-xs text-[#2E2A24]/70">Admin & Pastoral Care Console</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full bg-[#E8A98C]/10 px-3 py-1.5 text-xs font-semibold text-[#2E2A24] sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Verified Pastor
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
            <aside className="lg:w-72">
              <nav className="rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-3 shadow-sm">
                <div className="mb-3 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2E2A24]/60">
                  Navigation
                </div>
                <ul className="space-y-1">
                  {navItems.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="flex items-center rounded-xl px-3 py-2 text-sm font-medium text-[#2E2A24]/75 transition hover:bg-[#F2EAE0] hover:text-[#2E2A24]"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
