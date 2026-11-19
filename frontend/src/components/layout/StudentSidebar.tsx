"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  FolderGit2,
  Users,
  Calendar,
  Globe,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Flame,
  Bell,
} from "lucide-react";

interface StudentSidebarProps {
  user: any;
}

export default function StudentSidebar({ user }: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
    }
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      badge: "Active",
    },
    {
      href: "/dashboard/roadmap",
      label: "My Roadmap",
      icon: Compass,
      badge: "Milestones",
    },
    {
      href: "/dashboard/ai-companion",
      label: "AI Companion",
      icon: Sparkles,
      badge: "24/7 AI",
    },
    {
      href: "/dashboard/projects",
      label: "Projects",
      icon: FolderGit2,
      badge: "Catalog",
    },
    {
      href: "/dashboard/mentors",
      label: "Find a Mentor",
      icon: Users,
      badge: "1-on-1",
    },
    {
      href: "/dashboard/sessions",
      label: "My Sessions",
      icon: Calendar,
      badge: "Booked",
    },
    {
      href: "/community",
      label: "Community",
      icon: Globe,
      badge: "Network",
    },
    {
      href: "/dashboard/profile",
      label: "Profile",
      icon: User,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-forest-green border-r border-beige/10 min-h-screen p-6 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Brand & Home Link */}
        <div className="pb-5 border-b border-beige/10 flex items-center justify-between">
          <InspiviaLogo href="/" size="sm" />
          <div className="p-2 rounded-xl bg-midnight-green/40 border border-beige/10 text-beige/70 hover:text-rosy-brown transition-colors cursor-pointer relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rosy-brown absolute top-1.5 right-1.5" />
          </div>
        </div>

        {/* Student Profile Snapshot Card */}
        <div className="p-4 rounded-2xl bg-midnight-green/45 border border-beige/15 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-rosy-brown text-forest-green font-serif font-bold text-base flex items-center justify-center shrink-0 shadow-md">
              {user?.avatarInitials || "ST"}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-beige truncate">
                {user?.name || "Inspivia Scholar"}
              </h4>
              <p className="text-xs text-beige/65 truncate">{user?.course || "Engineering"}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-beige/10 flex items-center justify-between text-[11px] font-mono text-beige/80">
            <span className="flex items-center gap-1 text-rosy-brown font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Day 14 Streak</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-moss-green/30 text-beige text-[10px]">
              {user?.year || "Active"}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-beige/40 font-bold">
            Student Platform
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-rosy-brown text-forest-green font-bold shadow-md"
                    : "text-beige/75 hover:text-beige hover:bg-midnight-green/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/25 text-beige/70">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-beige/10 space-y-2.5">
        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-beige/70 hover:text-beige hover:bg-beige/5 transition-all"
        >
          <span>Return to Public Site</span>
          <ChevronRight className="w-4 h-4" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-medium transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
