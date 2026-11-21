"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { firstName, useSessionUser } from "@/lib/session-context";
import { WORK_PROJECTS } from "@/data/workData";
import {
  Sparkles,
  Compass,
  FolderGit2,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  ShieldCheck,
  ChevronRight,
  Code2,
  Calendar,
  Bell,
  Award,
  Video,
  ExternalLink,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const user = useSessionUser();
  const track = user.enrolledTrack || "Not selected yet";
  const year = user.year || "your program";
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "Expert Code Review Completed",
      detail: "Wallabhi Saxena approved your Milestone 2 PR with 2 suggestions.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "notif-2",
      title: "Upcoming 1-on-1 Session",
      detail: "FreeRTOS Telemetry review scheduled for Thursday at 6:00 PM IST.",
      time: "Yesterday",
      read: false,
    },
    {
      id: "notif-3",
      title: "AI Milestone Prompt",
      detail: "Database schema generated for your active portfolio sprint.",
      time: "2 days ago",
      read: true,
    },
  ]);


  const recommendedProjects = WORK_PROJECTS.slice(0, 2);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* ========================================================
          1. TOP WELCOME & IDENTITY BANNER
          ======================================================== */}
      <div className="rounded-3xl p-8 md:p-10 bg-midnight-green/40 border border-beige/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-green/70 border border-beige/15 text-[11px] font-mono text-moss-green">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated Student Portal // Super 50 Scholar</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-beige">
            Welcome, <span className="text-rosy-brown">{firstName(user)}</span>!
          </h1>

          <p className="text-xs md:text-sm text-beige/80 max-w-xl font-sans">
            Selected Domain: <strong className="text-beige font-semibold">{track}</strong>.
            {user.course ? `Enrolled in ${user.course}${user.year ? ` (${user.year})` : ""}.` : "Welcome to your INSPIVIA student dashboard."}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/ai-companion"
            className="px-5 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch AI Companion</span>
          </Link>
          <Link
            href="/dashboard/roadmap"
            className="px-5 py-2.5 rounded-full border border-beige/25 text-beige hover:border-beige text-xs uppercase tracking-wider font-mono transition-all"
          >
            View Active Roadmap
          </Link>
        </div>
      </div>

      {/* ========================================================
          2. MODULAR PROGRESS & LEARNING STAT CARDS
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Track Progression */}
        <div className="p-6 rounded-3xl bg-forest-green/70 border border-beige/15 shadow-lg space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-beige/50 block">
            Learning Progress
          </span>
          <div className="text-3xl font-serif font-black text-rosy-brown">
            33%
          </div>
          <div className="w-full h-1.5 rounded-full bg-black/30 overflow-hidden">
            <div className="h-full bg-rosy-brown w-1/3 rounded-full" />
          </div>
          <span className="text-[11px] font-mono text-beige/70 block">
            2 of 6 Milestones Verified by Lead
          </span>
        </div>

        {/* Card 2: Current Sprint */}
        <div className="p-6 rounded-3xl bg-forest-green/70 border border-beige/15 shadow-lg space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-beige/50 block">
            Active Sprint
          </span>
          <div className="text-lg font-serif font-bold text-beige truncate">
            Phase 2: App Router &amp; Schemas
          </div>
          <div className="flex items-center gap-1.5 text-xs text-moss-green font-mono pt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Sprint Deadline: Friday 8 PM</span>
          </div>
        </div>

        {/* Card 3: Mentor Information */}
        <div className="p-6 rounded-3xl bg-forest-green/70 border border-beige/15 shadow-lg space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-beige/50 block">
            Assigned Mentor Lead
          </span>
          <div className="text-lg font-serif font-bold text-beige">
            Wallabhi Saxena
          </div>
          <span className="text-[11px] font-mono text-rosy-brown block pt-1">
            Founder &amp; Super 50 Pioneer
          </span>
        </div>

        {/* Card 4: Consistency Streak */}
        <div className="p-6 rounded-3xl bg-forest-green/70 border border-beige/15 shadow-lg space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-beige/50 block">
            Milestone Streak
          </span>
          <div className="text-3xl font-serif font-black text-moss-green flex items-center gap-2">
            <Flame className="w-6 h-6 text-rosy-brown" />
            <span>14 Days</span>
          </div>
          <span className="text-[11px] font-mono text-beige/70 block">
            NextYou Portfolio: Synchronized
          </span>
        </div>
      </div>

      {/* ========================================================
          3. DUAL GRID: AI CO-PILOT + NOTIFICATIONS & SESSIONS
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): AI Companion Assistant + Active Roadmap Preview */}
        <div className="lg:col-span-7 space-y-8">
          {/* AI Companion Assistant Card */}
          <div className="rounded-3xl p-8 bg-midnight-green/35 border border-beige/15 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rosy-brown/20 border border-rosy-brown/40 text-rosy-brown flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-beige">
                    AI Architectural Assistant
                  </h3>
                  <p className="text-xs text-moss-green font-mono">
                    Online 24/7 // Context: {track.split("&")[0]}
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/ai-companion"
                className="text-xs font-mono text-rosy-brown hover:text-beige flex items-center gap-1 font-semibold"
              >
                <span>Full Chat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-forest-green/80 border border-beige/10 text-xs text-beige/85 space-y-3 font-sans">
              <p className="leading-relaxed">
                "Hello <strong className="text-beige">{firstName(user)}</strong>. For your upcoming Milestone 3 checkpoint, I've prepared a recommended telemetry schema and FreeRTOS task partition. Would you like to review it before your meeting with Lead Mentor Wallabhi Saxena?"
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  href="/dashboard/ai-companion"
                  className="px-3 py-1.5 rounded-lg bg-midnight-green/70 hover:bg-rosy-brown hover:text-forest-green text-[11px] font-mono text-beige transition-colors border border-white/5"
                >
                  Generate FreeRTOS Partition
                </Link>
                <Link
                  href="/dashboard/ai-companion"
                  className="px-3 py-1.5 rounded-lg bg-midnight-green/70 hover:bg-rosy-brown hover:text-forest-green text-[11px] font-mono text-beige transition-colors border border-white/5"
                >
                  Draft Patent Claim Angle
                </Link>
                <Link
                  href="/dashboard/ai-companion"
                  className="px-3 py-1.5 rounded-lg bg-midnight-green/70 hover:bg-rosy-brown hover:text-forest-green text-[11px] font-mono text-beige transition-colors border border-white/5"
                >
                  Review API Schemas
                </Link>
              </div>
            </div>

            <Link
              href="/dashboard/ai-companion"
              className="w-full py-3 rounded-2xl bg-midnight-green hover:bg-midnight-green/80 border border-beige/20 text-xs font-mono text-beige flex items-center justify-center gap-2 transition-colors shadow"
            >
              <span>Open Interactive AI Companion Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommended Curated Projects Card */}
          <div className="rounded-3xl p-8 bg-midnight-green/35 border border-beige/15 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-moss-green font-bold block">
                  Curated Matchmaker
                </span>
                <h3 className="text-xl font-serif font-bold text-beige">
                  Recommended Projects for {year}
                </h3>
              </div>
              <Link
                href="/dashboard/projects"
                className="text-xs font-mono text-rosy-brown hover:text-beige flex items-center gap-1 font-semibold"
              >
                <span>View Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-forest-green/70 border border-beige/10 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rosy-brown/20 text-rosy-brown border border-rosy-brown/30">
                      {proj.category}
                    </span>
                    <h4 className="text-sm font-serif font-bold text-beige mt-2 line-clamp-1">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-beige/70 line-clamp-2 mt-1 font-sans">
                      {proj.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-beige/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-moss-green font-semibold">{proj.status}</span>
                    <Link
                      href="/dashboard/projects"
                      className="text-beige hover:text-rosy-brown flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Upcoming 1-on-1 Sessions + Notifications */}
        <div className="lg:col-span-5 space-y-8">
          {/* Upcoming Sessions Card */}
          <div className="rounded-3xl p-7 bg-midnight-green/35 border border-beige/15 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rosy-brown" />
                <h3 className="text-lg font-serif font-bold text-beige">
                  Upcoming 1-on-1 Sessions
                </h3>
              </div>
              <Link
                href="/dashboard/sessions"
                className="text-xs font-mono text-moss-green hover:underline"
              >
                All Sessions →
              </Link>
            </div>

            {/* Session Card */}
            <div className="p-5 rounded-2xl bg-forest-green/80 border border-beige/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-moss-green/20 text-moss-green border border-moss-green/30 uppercase font-semibold">
                  Confirmed
                </span>
                <span className="text-[11px] font-mono text-beige/60">Nov 20, 2026</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-beige">
                  FreeRTOS Telemetry &amp; Schemas
                </h4>
                <p className="text-xs font-mono text-rosy-brown mt-0.5">
                  With Wallabhi Saxena (Lead Mentor)
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-beige/10">
                <span className="text-xs font-mono text-beige/70">6:00 PM IST</span>
                <a
                  href="https://meet.google.com/inspivia-sess-01"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rosy-brown text-forest-green font-bold text-[11px] uppercase tracking-wider shadow"
                >
                  <Video className="w-3 h-3" />
                  <span>Join Meet</span>
                </a>
              </div>
            </div>
          </div>

          {/* Platform Notifications Card */}
          <div className="rounded-3xl p-7 bg-midnight-green/35 border border-beige/15 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-beige/10">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-moss-green" />
                <h3 className="text-base font-serif font-bold text-beige">
                  Recent Notifications
                </h3>
              </div>
              <span className="text-[10px] font-mono text-beige/50">3 updates</span>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    !notif.read
                      ? "bg-forest-green/80 border-rosy-brown/30 text-beige"
                      : "bg-forest-green/40 border-beige/10 text-beige/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-beige">{notif.title}</span>
                    <span className="text-[10px] font-mono text-beige/50">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-beige/75 font-sans leading-snug">
                    {notif.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
