"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "@/components/layout/StudentSidebar";
import { DEMO_STUDENT } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          // If unauthenticated, redirect to login
          router.push("/auth/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
        } else {
          // Fallback to demo student if session check is neutral in dev
          setUser(DEMO_STUDENT);
        }
      })
      .catch(() => {
        setUser(DEMO_STUDENT);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
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
        {children}
      </div>
    </div>
  );
}
