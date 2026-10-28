import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOGOS IN ME — Admin, CMS & Pastoral Portal",
  description: "Moderation console, weekly scripture scheduler, and pastoral care portal for LOGOS IN ME.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F2EAE0] text-[#2E2A24] antialiased">
        <header className="border-b border-[#D9CFC4] bg-[#FAF6F0] px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#E8A98C] flex items-center justify-center font-bold text-white shadow-sm">
                ✝
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-[#2E2A24]">LOGOS IN ME</h1>
                <p className="text-xs text-[#2E2A24]/70">Admin & Pastoral Care Console</p>
              </div>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <a href="#moderation" className="hover:text-[#E8A98C] transition-colors">Moderation Queue</a>
              <a href="#cms" className="hover:text-[#E8A98C] transition-colors">Scripture CMS</a>
              <a href="#the-well" className="hover:text-[#E8A98C] transition-colors">The Well (Pastoral)</a>
              <span className="px-3 py-1 text-xs rounded-full bg-[#E8A98C]/20 text-[#2E2A24] font-semibold">
                Verified Pastor
              </span>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
