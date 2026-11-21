"use client";

import React, { useState, useEffect } from "react";
import StudentSidebar from "@/components/layout/StudentSidebar";
import { ApiError, apiFetch, redirectToLogin } from "@/lib/api";
import { SessionUserProvider } from "@/lib/session-context";
import type { SessionUser } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch<{ user: SessionUser }>("/api/auth/me")
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch((err: unknown) => {
        // 401s are already redirected to sign-in by apiFetch; anything else is a service problem.
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) return;
        setLoadError(
          err instanceof ApiError && err.code === "NOT_IMPLEMENTED"
            ? "Student sign-in isn't available yet on this deployment."
            : "We couldn't verify your session. Please try again."
        );
      });
    return () => {
      active = false;
    };
  }, []);

  if (loadError) {
    return (
      <div className="min-h-screen bg-forest-green flex items-center justify-center text-beige font-mono text-xs px-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <span>{loadError}</span>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-full bg-rosy-brown text-forest-green font-bold uppercase tracking-wider"
            >
              Retry
            </button>
            <button onClick={redirectToLogin} className="px-5 py-2 rounded-full border border-beige/30 uppercase tracking-wider">
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-forest-green flex items-center justify-center text-beige font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-rosy-brown border-t-transparent animate-spin" />
          <span>Verifying student session credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-green text-beige flex flex-col lg:flex-row">
      {/* Student Persistent Sidebar */}
      <StudentSidebar user={user} />

      {/* Main Product Canvas */}
      <div className="flex-1 min-h-screen flex flex-col bg-[#08291c] overflow-y-auto">
        <SessionUserProvider value={user}>{children}</SessionUserProvider>
      </div>
    </div>
  );
}
