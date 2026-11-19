"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommunityNetworkVisual from "@/components/motion/CommunityNetworkVisual";
import FeedbackFlashcards from "@/components/motion/FeedbackFlashcards";
import { AUTHENTIC_TESTIMONIALS } from "@/data/testimonialsData";
import {
  Users,
  Search,
  Sparkles,
  MessageSquare,
  Filter,
  ShieldCheck,
  Heart,
  Calendar,
  Code2,
  Cpu,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Radio,
  Share2,
} from "lucide-react";

interface CollaborationCircle {
  id: string;
  name: string;
  domain: string;
  activeDiscussions: number;
  expertLead: string;
  description: string;
  accentColor: string;
  tags: string[];
}

const COLLABORATION_CIRCLES: CollaborationCircle[] = [
  {
    id: "circle-iot",
    name: "Embedded Firmware & IoT Guild",
    domain: "ESP32, FreeRTOS, MQTT, Telemetry Sensors",
    activeDiscussions: 18,
    expertLead: "Archi Gupta",
    description:
      "A hands-on circle sharing breadboard schematics, C++ FreeRTOS task schedulers, and edge telemetry pipelines.",
    accentColor: "#839958",
    tags: ["ESP32", "FreeRTOS", "MQTT", "Hardware"],
  },
  {
    id: "circle-ai",
    name: "Applied AI & Computer Vision Circle",
    domain: "PyTorch, OpenCV, Grad-CAM, Medical Models",
    activeDiscussions: 24,
    expertLead: "Oorja Tiwari",
    description:
      "Peer review for convolutional neural networks, model optimization, dataset curation, and reproducible research.",
    accentColor: "#D3968C",
    tags: ["PyTorch", "FastAPI", "Docker", "Inference"],
  },
  {
    id: "circle-web",
    name: "Full-Stack Web & Next.js Collective",
    domain: "Next.js 14, TypeScript, Tailwind, Server Actions",
    activeDiscussions: 31,
    expertLead: "Pratiksha Khare",
    description:
      "Mastering modern web architecture, clean API contracts, state management, and deploying live production applications.",
    accentColor: "#105666",
    tags: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
  },
  {
    id: "circle-vlsi",
    name: "Silicon & VLSI Design Syndicate",
    domain: "Verilog HDL, ModelSim, Vivado, FPGA Synthesis",
    activeDiscussions: 12,
    expertLead: "Satvi Shukla",
    description:
      "Demystifying digital signal processing chips, finite state machines, and writing synthesis-ready Verilog testbenches.",
    accentColor: "#839958",
    tags: ["Verilog", "Vivado", "FPGA", "DSP"],
  },
  {
    id: "circle-patent",
    name: "Intellectual Property & Patent Clinic",
    domain: "Provisional Claims, Engineering Disclosures",
    activeDiscussions: 15,
    expertLead: "Wallabhi Saxena",
    description:
      "Helping undergraduate students draft formal patent claims and novel technical disclosures around their prototypes.",
    accentColor: "#D3968C",
    tags: ["Patents", "Novelty", "Prior Art", "Research"],
  },
];

const COMMUNITY_EVENTS = [
  {
    title: "Weekly Expert Pull Request Clinic",
    cadence: "Every Saturday // 5:00 PM IST",
    format: "Live Code Review on Discord / Meet",
    mentor: "Wallabhi Saxena & Leads",
    badge: "Weekly Cadence",
  },
  {
    title: "AI Prompt Engineering Sandbox",
    cadence: "Bi-Weekly Wednesday // 7:00 PM IST",
    format: "Interactive Decomposition Workshop",
    mentor: "AI & Full-Stack Guilds",
    badge: "Hands-on Lab",
  },
  {
    title: "Super 50 Mid-Sprint Architecture Defense",
    cadence: "Monthly Milestone Checkpoint",
    format: "Prototype Demos & Patent Scrutiny",
    mentor: "Expert Evaluation Board",
    badge: "Milestone Gate",
  },
];

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const circleSliderRef = useRef<HTMLDivElement>(null);

  const years = ["All", "1st Year", "2nd Year", "3rd Year"];

  const filteredTestimonials = AUTHENTIC_TESTIMONIALS.filter((item) => {
    const matchesYear = selectedYear === "All" || item.year.includes(selectedYear);
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchLower) ||
      item.course.toLowerCase().includes(searchLower) ||
      item.feedback.toLowerCase().includes(searchLower) ||
      item.interests.some((i) => i.toLowerCase().includes(searchLower));

    return matchesYear && matchesSearch;
  });

  const scrollCircles = (direction: "left" | "right") => {
    if (circleSliderRef.current) {
      const offset = direction === "left" ? -380 : 380;
      circleSliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 pt-32 pb-24 md:pt-40 md:pb-32 bg-forest-green text-beige overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* ========================================================
              1. WARM & ENGAGING EDITORIAL HEADER
              ======================================================== */}
          <div className="max-w-3xl mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-midnight-green/50 border border-beige/20 text-xs font-mono uppercase tracking-widest text-rosy-brown mb-6 backdrop-blur-md">
              <Users className="w-3.5 h-3.5 text-rosy-brown animate-pulse" />
              <span>Student Collaboration Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight leading-[1.08] text-beige mb-6">
              A Community That Learns,{" "}
              <span className="italic font-normal text-rosy-brown block">
                Builds &amp; Grows Together.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-beige/85 font-sans leading-relaxed mb-8 max-w-2xl">
              Engineering school shouldn't be an isolated struggle. Join hundreds of students collaborating across disciplines, reviewing code with expert mentors, and shipping verified proof of work.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-beige/65">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-moss-green" />
                <span>Zero Gatekeeping // Safe Space for Beginners</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-rosy-brown" />
                <span>Inter-College Engineering Constellation</span>
              </span>
            </div>
          </div>

          {/* ========================================================
              2. SOPHISTICATED ANIMATED NETWORK VISUALIZATION
              ======================================================== */}
          <div className="mb-24">
            <CommunityNetworkVisual />
          </div>

          {/* ========================================================
              3. INTERACTIVE COLLABORATION CIRCLES SLIDER
              ======================================================== */}
          <section className="mb-24">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-2">
                  Peer Guilds
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-beige">
                  Student Collaboration Circles
                </h2>
                <p className="text-sm text-beige/75 mt-1">
                  Join a specialized technical circle to collaborate on projects, debug issues, and participate in sprint check-ins.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => scrollCircles("left")}
                  className="w-10 h-10 rounded-full border border-beige/20 bg-midnight-green/50 hover:bg-rosy-brown hover:text-forest-green text-beige flex items-center justify-center transition-all shadow"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollCircles("right")}
                  className="w-10 h-10 rounded-full border border-beige/20 bg-midnight-green/50 hover:bg-rosy-brown hover:text-forest-green text-beige flex items-center justify-center transition-all shadow"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              ref={circleSliderRef}
              className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {COLLABORATION_CIRCLES.map((circle) => (
                <div
                  key={circle.id}
                  className="shrink-0 w-[300px] sm:w-[360px] snap-start rounded-3xl p-7 bg-midnight-green/35 border border-beige/15 hover:border-rosy-brown/50 transition-all flex flex-col justify-between shadow-xl group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider"
                        style={{
                          backgroundColor: `${circle.accentColor}25`,
                          color: circle.accentColor,
                          border: `1px solid ${circle.accentColor}40`,
                        }}
                      >
                        {circle.activeDiscussions} Active Threads
                      </span>
                      <span className="text-[11px] font-mono text-beige/50">
                        Lead: {circle.expertLead}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-beige group-hover:text-rosy-brown transition-colors mb-2">
                      {circle.name}
                    </h3>

                    <p className="text-xs font-mono text-moss-green mb-3">
                      {circle.domain}
                    </p>

                    <p className="text-xs text-beige/80 leading-relaxed mb-6 font-sans">
                      {circle.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {circle.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 text-beige/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <a
                      href="/auth/register"
                      className="w-full py-2.5 rounded-xl bg-forest-green/80 border border-beige/20 text-beige hover:bg-rosy-brown hover:text-forest-green font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Join This Circle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================
              4. EVENTS & KNOWLEDGE SHARING SECTION
              ======================================================== */}
          <section className="mb-24 p-8 md:p-12 rounded-3xl bg-[#08291c] border border-beige/15 shadow-xl">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-rosy-brown font-bold block mb-2">
                Calendar &amp; Workshops
              </span>
              <h2 className="text-3xl font-serif font-bold text-beige">
                Weekly Code Clinics &amp; Community Events
              </h2>
              <p className="text-xs md:text-sm text-beige/75 mt-1 font-sans">
                Never get blocked for long. Join weekly open hours hosted by Super 50 expert leads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COMMUNITY_EVENTS.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-forest-green text-moss-green border border-moss-green/30 uppercase tracking-wider font-semibold">
                      {evt.badge}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-beige mt-2">{evt.title}</h3>
                    <p className="text-xs font-mono text-rosy-brown">{evt.cadence}</p>
                    <p className="text-xs text-beige/75">{evt.format}</p>
                  </div>
                  <div className="pt-3 border-t border-beige/10 text-[11px] font-mono text-beige/60">
                    Host: <span className="text-beige font-semibold">{evt.mentor}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================
              5. AUTHENTIC 27 STUDENT TESTIMONIALS
              ======================================================== */}
          <section className="pt-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-2">
                Student Voices
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-3">
                Verified Student Feedback & Testimonials
              </h2>
              <p className="text-sm text-beige/80 leading-relaxed font-sans">
                Real feedback from Super 50 students who overcame beginner anxiety under the mentorship of Wallabhi Saxena and expert leads.
              </p>
            </div>

            {/* Interactive Search & Filter Controls */}
            <div className="p-6 rounded-3xl bg-midnight-green/35 border border-beige/15 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-beige/50 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, interest (e.g. IoT, AI/ML, Web, VLSI), or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/40 text-xs md:text-sm focus:outline-none focus:border-rosy-brown"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <Filter className="w-4 h-4 text-beige/50 shrink-0 hidden md:block" />
                {years.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                      selectedYear === yr
                        ? "bg-rosy-brown text-forest-green font-bold shadow-md"
                        : "bg-forest-green/60 text-beige/70 hover:text-beige border border-beige/10"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count Banner */}
            <div className="flex items-center justify-between text-xs font-mono text-beige/60 mb-6">
              <span>Showing {filteredTestimonials.length} student voices</span>
              <span>Documented from INSPIVIA Engineering Cohorts</span>
            </div>

            {/* Feedback Flashcard Deck: click the box to reveal every feedback */}
            <FeedbackFlashcards testimonials={filteredTestimonials} />
          </section>

          {/* ========================================================
              6. STRONG JOIN INSPIVIA CTA
              ======================================================== */}
          <div className="mt-28 p-8 md:p-14 rounded-3xl bg-midnight-green/50 border border-beige/20 text-center max-w-4xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
            <div className="w-14 h-14 mx-auto rounded-full bg-rosy-brown/20 border border-rosy-brown flex items-center justify-center text-rosy-brown">
              <Users className="w-7 h-7" />
            </div>

            <h3 className="text-3xl md:text-5xl font-serif font-bold text-beige">
              Ready to Join the INSPIVIA Community?
            </h3>

            <p className="text-sm md:text-base text-beige/85 max-w-xl mx-auto leading-relaxed font-sans">
              Get matched with expert leads, access curated roadmaps, brainstorm project ideas with the AI Companion, and never build in the dark again.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-xl transition-all"
              >
                Create Student Account
              </a>
              <a
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-beige/30 text-beige hover:border-beige font-mono text-xs uppercase tracking-wider transition-all"
              >
                Sign In to Portal
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
