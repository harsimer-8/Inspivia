"use client";

import React from "react";
import { motion } from "framer-motion";
import { JOURNEY_MILESTONES } from "@/data/inspiviaData";
import { Sparkles } from "lucide-react";

/**
 * "Our Journey" vertical timeline on the home page.
 * Styled with the signature neon constellation theme requested from the reference screenshots,
 * blended harmoniously into INSPIVIA's dark green architectural identity.
 */
export default function InspiviaJourney() {
  return (
    <section
      id="journey"
      className="py-28 md:py-36 bg-[#051a12] relative border-b border-beige/10 overflow-hidden"
    >
      {/* Neon Constellation & Starfield Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e90a_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e90a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Neon Ambient Blurs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

        {/* Decorative Constellation Nodes */}
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <line x1="15%" y1="20%" x2="28%" y2="28%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="28%" y1="28%" x2="22%" y2="42%" stroke="#38bdf8" strokeWidth="1" />
          <line x1="75%" y1="25%" x2="88%" y2="35%" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="88%" y1="35%" x2="82%" y2="55%" stroke="#22d3ee" strokeWidth="1" />
          <line x1="18%" y1="70%" x2="30%" y2="82%" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="70%" y1="75%" x2="85%" y2="85%" stroke="#c084fc" strokeWidth="1" />

          <circle cx="15%" cy="20%" r="3" fill="#22d3ee" className="animate-pulse" />
          <circle cx="28%" cy="28%" r="4" fill="#38bdf8" />
          <circle cx="22%" cy="42%" r="2.5" fill="#22d3ee" />
          <circle cx="75%" cy="25%" r="3" fill="#a855f7" className="animate-pulse" />
          <circle cx="88%" cy="35%" r="4.5" fill="#c084fc" />
          <circle cx="82%" cy="55%" r="3" fill="#22d3ee" />
          <circle cx="18%" cy="70%" r="3" fill="#06b6d4" />
          <circle cx="30%" cy="82%" r="4" fill="#38bdf8" />
          <circle cx="70%" cy="75%" r="3" fill="#c084fc" />
          <circle cx="85%" cy="85%" r="4" fill="#a855f7" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Milestone Journey</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]">
              Our Journey
            </span>
          </h2>

          <p className="text-sm md:text-base text-beige/80 leading-relaxed font-sans">
            From our founding launch to scaling across engineering disciplines — the defining milestones that built the INSPIVIA movement.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="relative">
          {/* Vertical Neon Glowing Rail */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] md:-translate-x-1/2 bg-gradient-to-b from-cyan-400 via-sky-400 to-purple-500 shadow-[0_0_16px_rgba(34,211,238,0.7)] rounded-full" />

          <ol className="space-y-12 md:space-y-16">
            {JOURNEY_MILESTONES.map((m, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <li key={m.id} className="relative md:grid md:grid-cols-2 md:gap-16">
                  {/* Neon Node Marker */}
                  <div className="absolute left-4 md:left-1/2 top-7 -translate-x-1/2 z-20 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full bg-cyan-400 border-4 border-[#051a12] shadow-[0_0_0_3px_rgba(34,211,238,0.4),0_0_20px_rgba(34,211,238,0.9)] animate-pulse" />
                  </div>

                  {/* Milestone Card */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -28 : 28, y: 14 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className={`ml-12 md:ml-0 rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#08291c]/90 to-[#051a12]/95 border border-cyan-500/25 hover:border-cyan-400/60 shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(34,211,238,0.08)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.6),0_0_30px_rgba(34,211,238,0.2)] transition-all duration-300 backdrop-blur-md ${
                      isLeft ? "md:col-start-1 md:text-right" : "md:col-start-2"
                    }`}
                  >
                    <h3 className="text-xl md:text-2xl font-serif font-black text-beige tracking-tight mb-1">
                      {m.title}
                    </h3>

                    <p className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] mb-3">
                      {m.date}
                    </p>

                    <p className="text-xs md:text-sm text-beige/85 leading-relaxed font-sans">
                      {m.description}
                    </p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
