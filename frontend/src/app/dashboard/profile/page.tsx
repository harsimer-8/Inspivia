"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  BookOpen,
  Award,
  Github,
  Linkedin,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit3,
  Save,
} from "lucide-react";

export default function StudentProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(
    "2nd year engineering scholar passionate about building low-power IoT telemetry hardware and scalable full-stack web applications. Participant in Super 50 cohort."
  );
  const [githubUrl, setGithubUrl] = useState("https://github.com/ananya-sharma");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/ananya-sharma");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-beige/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-moss-green uppercase tracking-wider mb-1">
            <User className="w-3.5 h-3.5" />
            <span>Student Identity &amp; Badges</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-beige">
            Student Scholar Profile
          </h1>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow transition-all"
        >
          {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          <span>{isEditing ? "Save Profile" : "Edit Details"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Portrait & Snapshot */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-midnight-green/35 border border-beige/15 shadow-xl text-center space-y-6">
          <div className="relative w-28 h-28 mx-auto rounded-full bg-rosy-brown text-forest-green font-serif font-black text-4xl flex items-center justify-center shadow-2xl border-4 border-beige/25">
            {user?.avatarInitials || "AS"}
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-beige">{user?.name || "Ananya Sharma"}</h2>
            <p className="text-xs font-mono text-moss-green font-semibold mt-1">
              {user?.course || "B.Tech Computer Science & Engineering"}
            </p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-forest-green/80 text-beige border border-white/5">
              {user?.year || "2nd Year"} • Super 50 Scholar
            </span>
          </div>

          <div className="pt-4 border-t border-beige/10 space-y-2.5 text-xs font-mono text-beige/75 text-left">
            <div className="flex items-center justify-between">
              <span className="text-beige/50">Email:</span>
              <span className="text-beige font-semibold truncate max-w-[200px]">
                {user?.email || "student@inspivia.org"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-beige/50">Joined:</span>
              <span>{user?.registeredAt || "August 2026"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-beige/50">Verification:</span>
              <span className="text-moss-green font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Scholar</span>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-beige/10 flex items-center justify-center gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-forest-green border border-beige/20 text-beige hover:text-rosy-brown transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-forest-green border border-beige/20 text-beige hover:text-rosy-brown transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Column: Bio, Enrolled Track & Badges */}
        <div className="lg:col-span-7 space-y-6">
          {/* Engineering Bio */}
          <div className="p-7 rounded-3xl bg-midnight-green/35 border border-beige/15 shadow-xl space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-rosy-brown font-bold">
              Engineering Biography &amp; Focus
            </h3>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl bg-forest-green/80 border border-beige/20 text-beige text-xs focus:outline-none focus:border-rosy-brown"
              />
            ) : (
              <p className="text-sm text-beige/85 leading-relaxed font-sans">{bio}</p>
            )}
          </div>

          {/* Active Track */}
          <div className="p-7 rounded-3xl bg-midnight-green/35 border border-beige/15 shadow-xl space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold">
              Enrolled Technical Track
            </h3>
            <div className="p-4 rounded-2xl bg-forest-green/70 border border-beige/10 flex items-center justify-between">
              <div>
                <h4 className="text-base font-serif font-bold text-beige">
                  {user?.enrolledTrack || "Full-Stack Web & Cloud Architecture"}
                </h4>
                <p className="text-xs text-beige/70 font-mono mt-0.5">
                  Milestones: 2 of 4 Completed // Sprint Pace: On Target
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-moss-green/20 text-moss-green font-bold">
                Active
              </span>
            </div>
          </div>

          {/* Verified Achievements & Badges */}
          <div className="p-7 rounded-3xl bg-midnight-green/35 border border-beige/15 shadow-xl space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-beige/60 font-bold">
              Verified Badges &amp; Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-forest-green/60 border border-beige/10 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-moss-green shrink-0" />
                <div>
                  <span className="font-bold text-beige block">Super 50 Milestone I</span>
                  <span className="text-[11px] text-beige/60">Passed code review</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-forest-green/60 border border-beige/10 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-rosy-brown shrink-0" />
                <div>
                  <span className="font-bold text-beige block">AI Schema Ready</span>
                  <span className="text-[11px] text-beige/60">Automated architecture</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-forest-green/60 border border-beige/10 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-beige shrink-0" />
                <div>
                  <span className="font-bold text-beige block">Honor Code Signatory</span>
                  <span className="text-[11px] text-beige/60">Committed to authenticity</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-forest-green/60 border border-beige/10 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-moss-green shrink-0" />
                <div>
                  <span className="font-bold text-beige block">NextYou Showcase</span>
                  <span className="text-[11px] text-beige/60">Portfolio deployed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
