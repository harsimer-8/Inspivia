"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEAM_MEMBERS, TeamMember } from "@/data/inspiviaData";
import FounderPortrait from "@/components/ui/FounderPortrait";
import {
  Linkedin,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Heart,
  Quote,
  CheckCircle2,
  Calendar,
  X,
  Mail,
  Users,
} from "lucide-react";

export default function TeamShowcaseSection() {
  const founder = TEAM_MEMBERS.find((m) => m.isFounder) || TEAM_MEMBERS[0];
  const expertMentors = TEAM_MEMBERS.filter((m) => !m.isFounder);
  const [activeMentorModal, setActiveMentorModal] = useState<TeamMember | null>(null);

  return (
    <div className="space-y-24 md:space-y-36">
      {/* ========================================================
          1. PREMIUM FOUNDER SPOTLIGHT (EDITORIAL SPLIT LAYOUT)
          ======================================================== */}
      <section className="relative">
        {/* Architectural Framing Border */}
        <div className="rounded-3xl p-8 md:p-12 lg:p-16 bg-midnight-green/35 border border-rosy-brown/40 shadow-[0_25px_70px_rgba(0,0,0,0.4)] relative overflow-hidden backdrop-blur-md">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-rosy-brown/20 to-transparent blur-3xl pointer-events-none" />

          {/* Large Typographic Watermark */}
          <div className="absolute right-6 -bottom-6 font-serif font-black text-8xl md:text-9xl opacity-5 select-none pointer-events-none text-beige">
            WS
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center relative z-10">
            {/* Left: Large Editorial Portrait Frame */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-3xl bg-forest-green border-2 border-rosy-brown/50 overflow-hidden p-8 flex flex-col items-center justify-between text-center shadow-2xl group transition-all hover:border-rosy-brown"
              >
                {/* Subtle Radial Gradient Sheen */}
                <div className="absolute inset-0 bg-radial from-rosy-brown/15 via-transparent to-forest-green pointer-events-none" />

                {/* Top Badge */}
                <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono text-beige/60 pb-4 border-b border-beige/10">
                  <span className="uppercase tracking-widest text-moss-green font-bold">
                    INSPIVIA FOUNDER
                  </span>
                  <span>EST. 2026</span>
                </div>

                {/* Large Monogram / Portrait Slot */}
                <div className="my-8 relative z-10">
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-forest-green to-midnight-green border-4 border-rosy-brown/60 p-2 shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    {/* Rotating Dashed Outer Ring */}
                    <div className="absolute -inset-3 rounded-full border border-dashed border-beige/25 animate-spin-slow pointer-events-none" />

                    <FounderPortrait src={founder.image} name={founder.name} initials={founder.initials} />
                  </div>
                </div>

                {/* Name & Title */}
                <div className="relative z-10 space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-beige">
                    {founder.name}
                  </h3>
                  <p className="text-xs font-mono text-moss-green font-bold tracking-wider uppercase">
                    Founder, INSPIVIA &amp; Super 50 Pioneer
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Editorial Narrative & Founder Message */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-forest-green/80 border border-beige/15 text-xs font-mono text-rosy-brown">
                <ShieldCheck className="w-4 h-4 text-moss-green" />
                <span>Verified Engineering Leadership</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-beige">
                "Direction is the Greatest Gift an Expert Can Give."
              </h2>

              <p className="text-xs font-mono text-moss-green font-semibold tracking-wider uppercase">
                {founder.designation} • {founder.discipline}
              </p>

              {/* Biography */}
              <p className="text-sm md:text-base text-beige/85 leading-relaxed font-sans">
                {founder.bio}
              </p>

              {/* Personal Founder Letter / Message */}
              <div className="p-6 rounded-2xl bg-forest-green/70 border border-beige/15 relative space-y-3">
                <Quote className="w-8 h-8 text-rosy-brown/40 absolute top-4 right-4" />
                <span className="text-xs font-mono uppercase tracking-widest text-rosy-brown font-bold block">
                  The Founder's Credo:
                </span>
                <p className="text-xs md:text-sm font-serif italic text-beige/95 leading-relaxed">
                  "I watched brilliant first-year students freeze in fear because everyone told them to 'build projects' but no one sat beside them to explain how. Inspivia was born out of one simple promise: no junior should ever have to question their engineering potential in isolation again."
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-beige/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-moss-green" />
                  <span>Super 50 Cohort Lead</span>
                </div>
              </div>

              {/* Founder Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={founder.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-xl transition-all hover:scale-105"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href="/dashboard/mentors"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-beige/30 text-beige hover:border-beige font-mono text-xs uppercase tracking-wider transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-moss-green" />
                  <span>Book Mentor Session</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. EXPERT DISCIPLINE LEADS (STAGGERED GRID)
          ======================================================== */}
      <section className="space-y-12">
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-2">
            Discipline Guilds
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-4">
            Expert Engineering Leads
          </h2>
          <p className="text-sm md:text-base text-beige/75 leading-relaxed">
            All team members are real engineering experts who have shipped prototypes, won hackathons, and committed to weekly junior guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              className="rounded-3xl p-8 bg-midnight-green/35 border border-beige/15 hover:border-rosy-brown/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Monogram Avatar & Discipline Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-serif font-black text-2xl border border-beige/25 shadow-md transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: mentor.bgToken,
                      color: mentor.accentToken,
                    }}
                  >
                    {mentor.initials}
                  </div>

                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-forest-green/80 text-moss-green border border-white/5 font-semibold">
                    {mentor.role}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-beige group-hover:text-rosy-brown transition-colors mb-1">
                  {mentor.name}
                </h3>

                <p className="text-xs font-mono text-rosy-brown font-semibold mb-4">
                  {mentor.designation}
                </p>

                <p className="text-xs md:text-sm text-beige/80 leading-relaxed mb-6 font-sans">
                  {mentor.bio}
                </p>
              </div>

              <div>
                {/* Discipline Tag */}
                <div className="p-3 rounded-xl bg-forest-green/50 border border-beige/10 mb-6 text-xs font-mono text-beige/70">
                  <span className="text-beige/40 block text-[10px] uppercase">Specialization:</span>
                  <span className="text-beige font-semibold">{mentor.discipline}</span>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-beige/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveMentorModal(mentor)}
                    className="text-xs font-mono uppercase tracking-wider text-rosy-brown hover:text-beige flex items-center gap-1 font-semibold"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={mentor.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-forest-green border border-beige/20 text-beige hover:text-rosy-brown hover:border-rosy-brown flex items-center justify-center transition-colors"
                    aria-label={`${mentor.name} LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================
          3. OUR PHILOSOPHY & VALUES
          ======================================================== */}
      <section className="p-8 md:p-12 rounded-3xl bg-forest-green border border-beige/15 shadow-xl">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-rosy-brown font-bold block mb-2">
            The Mentor Code
          </span>
          <h3 className="text-2xl md:text-4xl font-serif font-bold text-beige">
            No Pedestals. No Gatekeeping. Only Guidance.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-2">
            <h4 className="text-base font-serif font-bold text-beige">1. Code Over Lectures</h4>
            <p className="text-xs text-beige/75 leading-relaxed">
              We don't give slide presentations. We review GitHub pull requests, debug circuit breadboards, and fix configuration errors together.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-2">
            <h4 className="text-base font-serif font-bold text-beige">2. Safe to Ask "Stupid" Doubts</h4>
            <p className="text-xs text-beige/75 leading-relaxed">
              Every master was once confused by a git rebase or a missing resistor. We provide a space where no beginner question is judged.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-2">
            <h4 className="text-base font-serif font-bold text-beige">3. Pass the Torch Forward</h4>
            <p className="text-xs text-beige/75 leading-relaxed">
              Scholars who complete Super 50 return in subsequent semesters as expert leads, creating a self-sustaining cycle of student mentorship.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          MENTOR DETAIL MODAL
          ======================================================== */}
      <AnimatePresence>
        {activeMentorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl rounded-3xl p-8 bg-midnight-green border border-rosy-brown/40 shadow-2xl text-beige max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveMentorModal(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-forest-green/60 text-beige/70 hover:text-beige hover:bg-forest-green flex items-center justify-center transition-colors border border-beige/15"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-serif font-bold text-2xl border border-beige/25"
                  style={{
                    backgroundColor: activeMentorModal.bgToken,
                    color: activeMentorModal.accentToken,
                  }}
                >
                  {activeMentorModal.initials}
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-beige">
                    {activeMentorModal.name}
                  </h3>
                  <p className="text-xs font-mono text-moss-green font-semibold">
                    {activeMentorModal.designation}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-sm text-beige/85 leading-relaxed">
                <p>{activeMentorModal.bio}</p>
                <div className="p-4 rounded-xl bg-forest-green/60 border border-beige/10 font-mono text-xs">
                  <span className="text-rosy-brown block mb-1">Discipline Expertise:</span>
                  <span>{activeMentorModal.discipline}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-beige/10 flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveMentorModal(null)}
                  className="px-5 py-2.5 rounded-full border border-beige/20 text-xs font-mono uppercase"
                >
                  Close
                </button>
                <a
                  href="/dashboard/mentors"
                  className="px-6 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <span>Request 1-on-1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
