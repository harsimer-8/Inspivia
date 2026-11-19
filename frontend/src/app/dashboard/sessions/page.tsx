"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  Users,
  ArrowRight,
  Plus,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function StudentSessionsPage() {
  const [sessions, setSessions] = useState([
    {
      id: "sess-01",
      mentorName: "Wallabhi Saxena",
      mentorRole: "Founder & Lead Mentor",
      topic: "Milestone 3 Architecture & FreeRTOS Telemetry Review",
      date: "Thursday, Nov 20, 2026",
      time: "6:00 PM – 6:45 PM IST",
      status: "Confirmed",
      meetUrl: "https://meet.google.com/inspivia-sess-01",
      notes: "Please have your ESP32 circuit diagram and latest Git branch pushed prior to the session.",
    },
    {
      id: "sess-02",
      mentorName: "Oorja Tiwari",
      mentorRole: "Head of AI/ML & Signal Processing",
      topic: "Grad-CAM Heatmap Validation & Dataset Edge Cases",
      date: "Monday, Nov 24, 2026",
      time: "5:30 PM – 6:15 PM IST",
      status: "Scheduled",
      meetUrl: "https://meet.google.com/inspivia-sess-02",
      notes: "Reviewing PyTorch model inference benchmarks.",
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-beige/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-moss-green uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>1-on-1 Mentorship Schedule</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-beige">
            My Mentoring Sessions
          </h1>
        </div>

        <Link
          href="/dashboard/mentors"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-md transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book New Session</span>
        </Link>
      </div>

      {/* Active Upcoming Session Banner */}
      {sessions.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="p-7 rounded-3xl bg-midnight-green/35 border border-beige/15 hover:border-rosy-brown/40 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-moss-green/20 text-moss-green border border-moss-green/30">
                      {sess.status}
                    </span>
                    <span className="text-xs font-mono text-beige/50">ID: {sess.id}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-beige mb-1">
                    {sess.topic}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-rosy-brown mb-4">
                    <Users className="w-3.5 h-3.5" />
                    <span>{sess.mentorName} ({sess.mentorRole})</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-forest-green/60 border border-beige/10 space-y-1.5 text-xs font-mono text-beige/85 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-moss-green" />
                      <span>{sess.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-rosy-brown" />
                      <span>{sess.time}</span>
                    </div>
                  </div>

                  <p className="text-xs text-beige/70 leading-relaxed font-sans mb-6">
                    <strong className="text-beige/90">Mentor Note:</strong> {sess.notes}
                  </p>
                </div>

                <div className="pt-4 border-t border-beige/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-beige/50">Google Meet Video</span>
                  <a
                    href={sess.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider shadow hover:scale-105 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Room</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-16 rounded-3xl bg-midnight-green/30 border border-beige/15 text-center space-y-4">
          <Calendar className="w-12 h-12 text-rosy-brown/60 mx-auto" />
          <h3 className="text-xl font-serif font-bold text-beige">No Upcoming Sessions</h3>
          <p className="text-sm text-beige/70 max-w-md mx-auto font-sans">
            You don't have any sessions booked this week. Connect with your discipline mentor lead to review your milestone code.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/mentors"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider shadow"
            >
              <span>Explore Expert Mentors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Session Preparation Best Practices */}
      <div className="p-7 rounded-3xl bg-forest-green/80 border border-beige/15 space-y-4">
        <h3 className="text-lg font-serif font-bold text-beige">
          How to Get the Most from Your 1-on-1 Review
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-beige/80 font-sans">
          <div className="p-4 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-1">
            <h4 className="font-bold text-beige font-mono uppercase text-[11px]">1. Commit Your Code</h4>
            <p>Push your latest GitHub branch at least 2 hours prior so your mentor can review the diffs.</p>
          </div>
          <div className="p-4 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-1">
            <h4 className="font-bold text-beige font-mono uppercase text-[11px]">2. Isolate The Blocker</h4>
            <p>Write down the exact error log or compiler traceback you want to troubleshoot together.</p>
          </div>
          <div className="p-4 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-1">
            <h4 className="font-bold text-beige font-mono uppercase text-[11px]">3. Check Next Sprint</h4>
            <p>Open your roadmap milestones to align on what deliverable to ship by next week.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
