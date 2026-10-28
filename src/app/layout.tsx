import type { Metadata } from "next";
import AppShell from "./app-shell";
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
        <div className="min-h-screen bg-[#F2EAE0]">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
