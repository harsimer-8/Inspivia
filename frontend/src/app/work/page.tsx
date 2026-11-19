import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WorkShowcaseSection from "@/components/motion/WorkShowcaseSection";
import { FolderGit2, Sparkles, Award, ShieldCheck, ArrowRight, Code2, Cpu } from "lucide-react";

export const metadata = {
  title: "Our Work — Projects, Campaigns & Community Portfolio | INSPIVIA",
  description:
    "Explore verified engineering projects, hardware telemetry nodes, campus accelerator campaigns, and student portfolios built by INSPIVIA and Super 50 scholars.",
};

export default function WorkPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 pt-32 pb-24 md:pt-40 md:pb-32 bg-forest-green text-beige overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* ========================================================
              1. ELEGANT ANIMATED INTRODUCTION & HERO
              ======================================================== */}
          <div className="max-w-3xl mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-midnight-green/50 border border-beige/20 text-xs font-mono uppercase tracking-widest text-rosy-brown mb-6 backdrop-blur-md">
              <FolderGit2 className="w-3.5 h-3.5 text-rosy-brown animate-pulse" />
              <span>Proof of Work &amp; Engineering Archives</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight leading-[1.08] text-beige mb-6">
              Engineering That Speaks in{" "}
              <span className="italic font-normal text-rosy-brown block">
                Working Code &amp; Circuits.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-beige/85 font-sans leading-relaxed mb-8 max-w-2xl">
              We judge mentorship not by certificates, but by deployable software, physical microcontrollers, verified patent claims, and living student portfolios.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-beige/65">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-moss-green" />
                <span>100% Super 50 Delivery Rate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-rosy-brown" />
                <span>Hardware IoT &amp; Deep Learning Systems</span>
              </span>
            </div>
          </div>

          {/* ========================================================
              2. TABBED WORK SHOWCASE (PROJECTS, CAMPAIGNS, COMMUNITY)
              ======================================================== */}
          <WorkShowcaseSection />

          {/* ========================================================
              3. INVITATION CTA: SHIP YOUR PROJECT NEXT
              ======================================================== */}
          <div className="mt-28 p-8 md:p-14 rounded-3xl bg-[#08291c] border border-beige/15 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold">
                Join the Next Cohort
              </span>
              <h3 className="text-2xl md:text-4xl font-serif font-bold text-beige">
                Have an Idea You Want to See in This Catalog?
              </h3>
              <p className="text-xs md:text-sm text-beige/80 leading-relaxed font-sans">
                Stop waiting for the 'right time'. Connect with a Super 50 expert mentor and start decomposing your idea with the AI Companion today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <a
                href="/auth/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-xl transition-all text-center"
              >
                Start Your Project
              </a>
              <a
                href="/dashboard/roadmap"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-beige/30 text-beige hover:border-beige font-mono text-xs uppercase tracking-wider transition-all text-center"
              >
                Explore Roadmaps
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
