"use client";

import { AlertTriangle, RotateCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-red-200 bg-[#FAF6F0] p-6 text-center shadow-sm">
        <AlertTriangle className="mx-auto h-10 w-10 text-red-600" />
        <h2 className="mt-3 text-lg font-bold text-[#2E2A24]">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-[#2E2A24]/70">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2E2A24] px-4 py-2 text-sm font-semibold text-white hover:bg-black"
        >
          <RotateCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}