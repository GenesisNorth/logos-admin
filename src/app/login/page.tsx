"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Sign in with your admin email and password.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!isConfigured) {
      setStatus("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to continue.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("Supabase client could not be initialized.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);
    if (error) {
      setStatus(`Login failed: ${error.message}`);
      return;
    }

    window.location.assign("/");
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[#D9CFC4] bg-[#FAF6F0] p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2E2A24]/60">
          Admin access
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#2E2A24]">Sign in</h1>
        <p className="mt-2 text-sm text-[#2E2A24]/70">{status}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#2E2A24]">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="pastor@logosinme.com"
            disabled={!isConfigured || isSubmitting}
            className="w-full rounded-xl border border-[#D9CFC4] bg-white px-3 py-2.5 text-sm text-[#2E2A24] outline-none transition focus:border-[#E8A98C] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#2E2A24]">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={!isConfigured || isSubmitting}
            className="w-full rounded-xl border border-[#D9CFC4] bg-white px-3 py-2.5 text-sm text-[#2E2A24] outline-none transition focus:border-[#E8A98C] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={!isConfigured || isSubmitting || !email.trim() || !password}
          className="w-full rounded-xl bg-[#2E2A24] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-[#2E2A24]/50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {!isConfigured && (
        <div className="mt-5 rounded-xl border border-dashed border-[#D9CFC4] bg-white/60 p-3 text-xs text-[#2E2A24]/70">
          Add the Supabase credentials in your environment to activate authentication.
        </div>
      )}
    </div>
  );
}
