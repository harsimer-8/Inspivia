import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TeamShowcaseSection from "@/components/motion/TeamShowcaseSection";
import { Users, Sparkles, ShieldCheck, Award, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Our Leadership & Expert Mentors — INSPIVIA",
  description:
    "Meet founder Wallabhi Saxena and the verified expert mentor leads dedicated to guiding engineering students from day one at INSPIVIA.",
};

export default function TeamPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 pt-32 pb-24 md:pt-40 md:pb-32 bg-forest-green text-beige overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* ========================================================
              1. EDITORIAL HEADER & INTRODUCTION
              ======================================================== */}
          <div className="max-w-3xl mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-midnight-green/50 border border-beige/20 text-xs font-mono uppercase tracking-widest text-rosy-brown mb-6 backdrop-blur-md">
              <Users className="w-3.5 h-3.5 text-rosy-brown animate-pulse" />
              <span>Leadership &amp; Verified Expert Mentors</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight leading-[1.08] text-beige mb-6">
              Mentors Who Have{" "}
              <span className="italic font-normal text-rosy-brown block">
                Walked the Path.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-beige/85 font-sans leading-relaxed mb-8 max-w-2xl">
              Authentic guidance grounded in real engineering breakthroughs, patent drafting, and compassionate mentor-mentee connection. We never invent identities; every mentor has shipped working systems.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-beige/65">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-moss-green" />
                <span>Pioneered by Wallabhi Saxena</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-moss-green" />
                <span>5,000+ Students Mentored</span>
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-rosy-brown" />
                <span>1-on-1 Human Pairing &amp; Code Reviews</span>
              </span>
            </div>
          </div>

          {/* ========================================================
              2. TEAM & FOUNDER SHOWCASE SECTION
              ======================================================== */}
          <TeamShowcaseSection />

          {/* ========================================================
              3. BECOME A EXPERT MENTOR BANNER
              ======================================================== */}
          <div className="mt-28 p-8 md:p-12 rounded-3xl bg-[#08291c] border border-beige/15 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative">
            <div className="space-y-2 max-w-lg">
              <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold">
                Pass The Torch
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-beige">
                Are You an Expert Who Shipped a Great Project?
              </h3>
              <p className="text-xs md:text-sm text-beige/80 leading-relaxed font-sans">
                Join our mentor directory, review junior pull requests, and help shape the next generation of women in engineering.
              </p>
            </div>

            <a
              href="/contact"
              className="px-7 py-3.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-xl transition-all whitespace-nowrap"
            >
              Apply as Mentor Lead
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
