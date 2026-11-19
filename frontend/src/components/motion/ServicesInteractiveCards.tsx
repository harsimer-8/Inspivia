"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Compass,
  Users,
  Sparkles,
  FolderGit2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  X,
  Layers,
  Calendar,
  MessageSquare,
  Shield,
  ChevronRight,
  Code2,
  Cpu,
  BrainCircuit,
  Terminal,
} from "lucide-react";

export interface ServiceCardData {
  id: string;
  number: string;
  badge: string;
  title: string;
  subtitle: string;
  benefitStatement: string;
  description: string;
  features: string[];
  deliverables: string[];
  actionLink: string;
  actionText: string;
  bgToken: string;
  textColor: string;
  accentToken: string;
  borderToken: string;
  tagline: string;
  stats: { label: string; value: string }[];
}

export const DETAILED_SERVICES: ServiceCardData[] = [
  {
    id: "roadmaps",
    number: "01",
    badge: "Milestone-Driven Path",
    title: "Personalized Learning Roadmaps",
    subtitle: "Tailored multi-week engineering paths designed by experts who walked the exact same path.",
    benefitStatement:
      "Eliminate tutorial paralysis with weekly milestone checkpoints calibrated to your semester, academic branch, and target portfolio goals.",
    description:
      "Most engineering students spend their first two years trapped in infinite video tutorials without building anything tangible. Our personalized roadmaps strip away theoretical fluff and provide concrete, week-by-week deliverables with expert notes, repository starter code, and verified milestones.",
    features: [
      "Semester-specific progression (1st through 4th year tracks)",
      "Curated expert engineering notes & patentable blueprints",
      "Direct mapping to industry standards across Web, AI/ML, IoT, and VLSI",
      "Streak tracking and milestone check-offs integrated into your student dashboard",
    ],
    deliverables: [
      "Custom 12-week sprint curriculum",
      "Curated GitHub starter boilerplates",
      "Direct expert tips on avoiding common architectural traps",
    ],
    actionLink: "/dashboard/roadmap",
    actionText: "Launch Interactive Roadmap",
    bgToken: "#105666",
    textColor: "#F7F4D5",
    accentToken: "#D3968C",
    borderToken: "rgba(247, 244, 213, 0.2)",
    tagline: "DIRECTION OVER DISTRACTION",
    stats: [
      { label: "Completion Rate", value: "94%" },
      { label: "Active Tracks", value: "4 Domains" },
      { label: "Milestone Gates", value: "12 Steps" },
    ],
  },
  {
    id: "mentorship",
    number: "02",
    badge: "Human Connection",
    title: "One-to-One Mentor Guidance",
    subtitle: "Rebuilding the sacred mentor-mentee bond with dedicated leads from the Super 50 cohort.",
    benefitStatement:
      "Direct 1-on-1 pairing with verified experts for weekly code reviews, hardware debugging, and judgment-free doubt resolution.",
    description:
      "Engineering cannot be mastered in isolation. Inspivia pairs every student with an experienced expert lead who has shipped projects, won national hackathons, and filed patents. You get dedicated time to ask honest questions without the intimidation of large classrooms.",
    features: [
      "Dedicated expert mentor matched by technical discipline",
      "Weekly 1-on-1 code reviews and architectural walkthroughs",
      "Continuous accountability check-ins preventing project abandonment",
      "Portfolio interview preparation and patent application mentorship",
    ],
    deliverables: [
      "Bi-weekly private mentoring sessions",
      "GitHub pull request reviews with inline feedback",
      "Direct Discord / WhatsApp expert lead access",
    ],
    actionLink: "/dashboard/mentors",
    actionText: "Discover & Book Mentors",
    bgToken: "#839958",
    textColor: "#0A3323",
    accentToken: "#0A3323",
    borderToken: "rgba(10, 51, 35, 0.25)",
    tagline: "EMPATHY OVER ISOLATION",
    stats: [
      { label: "Super 50 Leads", value: "1:1 Ratio" },
      { label: "Review Latency", value: "< 24 Hrs" },
      { label: "Student Rating", value: "4.9 / 5" },
    ],
  },
  {
    id: "ai-companion",
    number: "03",
    badge: "24/7 AI Companion",
    title: "AI Project Mentor",
    subtitle: "Your intelligent architectural co-pilot for idea decomposition, schema design, and bug fixing.",
    benefitStatement:
      "Never wait until office hours to overcome a blocking error: the AI Companion analyzes your code, decomposes vague ideas into tickets, and suggests patent claims 24/7.",
    description:
      "The AI Companion is not a generic chatbot. Designed specifically for engineering students, it acts as an architectural co-pilot that turns vague 'I want to build an IoT project' desires into sprint-ready technical specifications, database schemas, and hardware pinout recommendations.",
    features: [
      "Idea-to-Specification decomposition engine",
      "Context-aware compiler troubleshooting for Next.js, Python, and C++",
      "Hardware pinout recommendations for ESP32, Arduino, and FPGA",
      "Provisional patent claim drafting & research methodology scaffolding",
    ],
    deliverables: [
      "24/7 instant chat terminal access",
      "Auto-generated sprint tickets with code snippets",
      "Architectural diagram generator prompts",
    ],
    actionLink: "/dashboard/ai-companion",
    actionText: "Open AI Companion Terminal",
    bgToken: "#0A3323",
    textColor: "#F7F4D5",
    accentToken: "#D3968C",
    borderToken: "rgba(211, 150, 140, 0.4)",
    tagline: "INTELLIGENCE ON DEMAND",
    stats: [
      { label: "Availability", value: "24/7" },
      { label: "Response Latency", value: "Sub-second" },
      { label: "Languages", value: "TS / Py / C++" },
    ],
  },
  {
    id: "projects",
    number: "04",
    badge: "Portfolio-Grade Engineering",
    title: "Project Matchmaking & Catalogs",
    subtitle: "Curated engineering challenges tailored to your year, with starter templates and proof-of-work specs.",
    benefitStatement:
      "Stop building clone to-do apps. Build deployable, high-impact systems that stand out on resumes and impress technical interviewers.",
    description:
      "Recruiters are fatigued by identical tutorial clones. Inspivia provides a verified catalog of cross-disciplinary challenges — from particulate telemetry nodes to neural micro-vascular diagnostics — complete with architecture schematics and verification tests.",
    features: [
      "Three difficulty tiers: Explorer (1st Yr), Builder (2nd Yr), Innovator (3rd/4th Yr)",
      "Cross-disciplinary challenges spanning hardware sensors and web edge dashboards",
      "Ready-to-fork starter templates with CI/CD and linting pre-configured",
      "Direct pathway into the Super 50 showcase and annual demo day",
    ],
    deliverables: [
      "Comprehensive system architecture specifications",
      "Sample sensor schematics and API contracts",
      "Live deployment checklist on Vercel / Docker",
    ],
    actionLink: "/dashboard/projects",
    actionText: "Explore Project Catalog",
    bgToken: "#D3968C",
    textColor: "#0A3323",
    accentToken: "#0A3323",
    borderToken: "rgba(10, 51, 35, 0.3)",
    tagline: "PROOF OVER THEORY",
    stats: [
      { label: "Curated Projects", value: "500+ Shipped" },
      { label: "Difficulty Tiers", value: "3 Tiers" },
      { label: "Patent Potential", value: "High Impact" },
    ],
  },
];

export default function ServicesInteractiveCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [selectedModalCard, setSelectedModalCard] = useState<ServiceCardData | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  return (
    <div ref={containerRef} className="relative space-y-20 md:space-y-32 py-8">
      {/* Visual Central Axis Cable */}
      <div className="hidden lg:block absolute left-1/2 top-12 bottom-12 w-[1px] bg-gradient-to-b from-transparent via-beige/25 to-transparent -translate-x-1/2 pointer-events-none" />

      {DETAILED_SERVICES.map((service, index) => {
        const isEven = index % 2 === 0;
        const startScroll = Math.max(0, index * 0.18);
        const endScroll = Math.min(1, startScroll + 0.38);

        return (
          <InteractiveServiceFlashcard
            key={service.id}
            service={service}
            index={index}
            isEven={isEven}
            scrollYProgress={scrollYProgress}
            startScroll={startScroll}
            endScroll={endScroll}
            shouldReduceMotion={shouldReduceMotion}
            onOpenModal={() => setSelectedModalCard(service)}
          />
        );
      })}

      {/* Detail Modal Dialog */}
      <AnimatePresence>
        {selectedModalCard && (
          <ServiceDetailModal
            service={selectedModalCard}
            onClose={() => setSelectedModalCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface InteractiveCardProps {
  service: ServiceCardData;
  index: number;
  isEven: boolean;
  scrollYProgress: any;
  startScroll: number;
  endScroll: number;
  shouldReduceMotion: boolean | null;
  onOpenModal: () => void;
}

function InteractiveServiceFlashcard({
  service,
  index,
  isEven,
  scrollYProgress,
  startScroll,
  endScroll,
  shouldReduceMotion,
  onOpenModal,
}: InteractiveCardProps) {
  // Each card owns its scroll progress so it always settles to a perfectly
  // straight position as it reaches the center of the viewport.
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ["start 92%", "center 52%"],
  });

  const initialX = isEven ? -150 : 150;
  const initialRotate = isEven ? -4 : 4;

  const x = useTransform(
    cardProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [initialX, 0]
  );
  const rotate = useTransform(
    cardProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [initialRotate, 0]
  );
  const scale = useTransform(
    cardProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [0.97, 1]
  );


  return (
    <div className="relative group">
      {/* Mobile Chapter Label */}
      <div className="flex items-center gap-3 mb-4 lg:hidden">
        <span className="w-8 h-8 rounded-xl bg-midnight-green border border-beige/20 text-rosy-brown font-mono font-bold text-xs flex items-center justify-center">
          {service.number}
        </span>
        <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold">
          Pillar {service.number} • {service.badge}
        </span>
      </div>

      <motion.div
        ref={cardRef}
        style={{
          x,
          rotate,
          opacity: 1,
          scale,
          backgroundColor: service.bgToken,
          color: service.textColor,
        }}
        className={`rounded-3xl p-8 md:p-12 lg:p-14 border border-beige/20 shadow-[0_24px_64px_rgba(0,0,0,0.38)] transition-all duration-300 relative overflow-hidden ${
          isEven ? "lg:mr-8" : "lg:ml-8"
        }`}
      >
        {/* Subtle Architectural Grid Lines in Card Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="w-full h-full bg-[radial-gradient(#F7F4D5_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        {/* Large Decorative Watermark in Corner */}
        <div
          className="absolute right-6 -bottom-6 font-serif font-black text-7xl md:text-9xl opacity-10 select-none pointer-events-none"
          style={{ color: service.textColor }}
        >
          {service.number}
        </div>

        {/* Top Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-10">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg font-bold transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: service.textColor === "#0A3323" ? "#0A3323" : "#F7F4D5",
                color: service.textColor === "#0A3323" ? "#F7F4D5" : "#0A3323",
              }}
            >
              {service.id === "roadmaps" && <Compass className="w-6 h-6" />}
              {service.id === "mentorship" && <Users className="w-6 h-6" />}
              {service.id === "ai-companion" && <Sparkles className="w-6 h-6" />}
              {service.id === "projects" && <FolderGit2 className="w-6 h-6" />}
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest opacity-80 block font-semibold">
                Pillar {service.number} • {service.badge}
              </span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold tracking-tight">
                {service.title}
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span
              className="px-3.5 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase border border-current/20 backdrop-blur-sm opacity-85 font-semibold"
            >
              {service.tagline}
            </span>
          </div>
        </div>

        {/* Concise Benefit Statement Banner */}
        <div
          className="p-5 md:p-6 rounded-2xl mb-8 border border-current/20 relative z-10 transition-all duration-300 group-hover:border-current/35"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.16)" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-rosy-brown mt-2 shrink-0 animate-ping" />
            <blockquote className="font-serif italic text-base md:text-xl font-medium leading-relaxed opacity-95">
              "{service.benefitStatement}"
            </blockquote>
          </div>
        </div>

        {/* Main Content & Visual Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 mb-8">
          {/* Narrative & Key Features */}
          <div className="lg:col-span-7 space-y-5">
            <p className="text-sm md:text-base leading-relaxed opacity-100 font-medium font-sans">
              {service.description}
            </p>

            {/* Feature Checklist */}
            <ul className="space-y-3">
              {service.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-start gap-3 text-xs md:text-sm leading-snug font-medium">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{
                      color: service.textColor === "#0A3323" ? "#0A3323" : "#839958",
                    }}
                  />
                  <span className="opacity-90">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Metric Pills */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {service.stats.map((stat, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3 rounded-xl border border-current/15 text-center"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}
                >
                  <div className="text-base md:text-lg font-serif font-bold tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider opacity-75">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Showcase Box (Custom per Service) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {service.id === "ai-companion" ? (
              <AICompanionGlowingOrbVisual textColor={service.textColor} />
            ) : service.id === "roadmaps" ? (
              <RoadmapInteractiveVisual textColor={service.textColor} />
            ) : service.id === "mentorship" ? (
              <MentorshipTopologyVisual textColor={service.textColor} />
            ) : (
              <ProjectCatalogMatrixVisual textColor={service.textColor} />
            )}
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-6 border-t border-current/15 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <Link
              href={service.actionLink}
              className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg hover:scale-105"
              style={{
                backgroundColor: service.textColor === "#0A3323" ? "#0A3323" : "#D3968C",
                color: service.textColor === "#0A3323" ? "#F7F4D5" : "#0A3323",
              }}
            >
              <span>{service.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={onOpenModal}
              className="px-5 py-3 rounded-full font-mono text-xs uppercase tracking-wider border border-current/30 hover:border-current transition-all flex items-center gap-1.5 opacity-90 hover:opacity-100"
            >
              <span>Deep Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] font-mono opacity-70">
            Available across all student chapters
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Animated Glowing Orb Visual specifically built for the AI Companion Mentor.
 * Features multi-layered concentric pulsing rings, radial gradients,
 * orbiting micro-satellites, and live code prompt simulation.
 */
function AICompanionGlowingOrbVisual({ textColor }: { textColor: string }) {
  return (
    <div className="w-full max-w-sm p-6 rounded-3xl bg-black/35 border border-rosy-brown/30 backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Outer Ethereal Glow */}
      <div className="absolute inset-0 bg-radial from-rosy-brown/20 via-transparent to-transparent blur-2xl pointer-events-none" />

      {/* Animated Glowing Orb Core */}
      <div className="relative w-44 h-44 flex items-center justify-center my-4">
        {/* Pulsing Concentric Outer Ring 1 */}
        <div className="absolute inset-0 rounded-full border border-rosy-brown/30 animate-ping opacity-35" />

        {/* Outer Ring 2 (Slow Spin) */}
        <div className="absolute inset-2 rounded-full border border-dashed border-beige/40 animate-spin-slow" />

        {/* Ethereal Glowing Spherical Body */}
        <div
          className="w-28 h-28 rounded-full relative shadow-[0_0_50px_rgba(211,150,140,0.65)] flex items-center justify-center overflow-hidden animate-pulse-subtle"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #F7F4D5 0%, #D3968C 45%, #105666 85%, #0A3323 100%)",
          }}
        >
          {/* Inner Light Core Sheen */}
          <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full bg-white/40 blur-md pointer-events-none" />

          {/* Center Quantum AI Emblem */}
          <Sparkles className="w-8 h-8 text-forest-green relative z-10 animate-bounce" />
        </div>

        {/* Orbiting Particle 1 */}
        <div className="absolute inset-0 animate-spin-slow pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-moss-green shadow-[0_0_12px_#839958] absolute top-1 left-1/2 -translate-x-1/2" />
        </div>

        {/* Orbiting Particle 2 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ animation: "spin 14s linear infinite reverse" }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-rosy-brown shadow-[0_0_10px_#D3968C] absolute bottom-2 left-1/2 -translate-x-1/2" />
        </div>
      </div>

      {/* Terminal Telemetry Snippet */}
      <div className="w-full mt-2 p-3 rounded-xl bg-forest-green/80 border border-beige/15 font-mono text-[11px] text-left text-beige/85 space-y-1">
        <div className="flex items-center justify-between text-[10px] text-beige/50 pb-1 border-b border-beige/10">
          <span className="flex items-center gap-1.5 text-moss-green">
            <span className="w-1.5 h-1.5 rounded-full bg-moss-green animate-pulse" />
            ai.kernel.active
          </span>
          <span>v2.5.0-student</span>
        </div>
        <p className="text-rosy-brown truncate">
          &gt; prompt: "Decompose IoT Node for ESP32..."
        </p>
        <p className="text-beige/70 text-[10px]">
          [OK] Generated 4 milestones &amp; hardware pinout.
        </p>
      </div>
    </div>
  );
}

/**
 * Visual illustration for Personalized Learning Roadmaps.
 * Shows a blueprint track with chronological milestones.
 */
function RoadmapInteractiveVisual({ textColor }: { textColor: string }) {
  const steps = [
    { num: "01", name: "Foundation & Setup", status: "Completed", color: "#839958" },
    { num: "02", name: "Architecture & Schemas", status: "Active Sprint", color: "#D3968C" },
    { num: "03", name: "Hardware / API Integration", status: "Upcoming", color: "#F7F4D5" },
    { num: "04", name: "Deployment & Patent Docs", status: "Upcoming", color: "#F7F4D5" },
  ];

  return (
    <div className="w-full max-w-sm p-6 rounded-3xl bg-black/25 border border-beige/15 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-current/15">
        <span className="font-mono text-xs uppercase tracking-wider font-semibold opacity-80">
          Track: Full-Stack &amp; Embedded IoT
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rosy-brown/20 text-rosy-brown">
          Semester 03
        </span>
      </div>

      <div className="space-y-3 font-sans text-xs">
        {steps.map((st, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              st.status === "Active Sprint"
                ? "bg-rosy-brown/20 border-rosy-brown text-beige"
                : "bg-forest-green/40 border-beige/10 opacity-80"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-black/30 font-mono font-bold text-[10px] flex items-center justify-center">
                {st.num}
              </span>
              <span className="font-medium">{st.name}</span>
            </div>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded"
              style={{
                backgroundColor: st.status === "Active Sprint" ? "#D3968C" : "rgba(255,255,255,0.08)",
                color: st.status === "Active Sprint" ? "#0A3323" : "inherit",
              }}
            >
              {st.status}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-between text-[11px] font-mono opacity-70">
        <span>Curated by the Super 50 Cohort</span>
        <span className="text-moss-green font-bold">75% Target Pace</span>
      </div>
    </div>
  );
}

/**
 * Visual illustration for One-to-One Mentorship.
 * Displays mentor-mentee pairing nodes and review cadence.
 */
function MentorshipTopologyVisual({ textColor }: { textColor: string }) {
  return (
    <div className="w-full max-w-sm p-6 rounded-3xl bg-black/20 border border-current/15 backdrop-blur-md space-y-4">
      <div className="text-center pb-2 border-b border-current/15">
        <span className="font-mono text-xs uppercase tracking-wider font-bold">
          1-on-1 Mentorship Node Topology
        </span>
      </div>

      {/* Pairing Flow Diagram */}
      <div className="flex items-center justify-between gap-3 py-2">
        <div className="flex-1 p-3.5 rounded-2xl bg-forest-green text-beige border border-beige/20 text-center space-y-1">
          <div className="w-8 h-8 mx-auto rounded-full bg-rosy-brown text-forest-green font-bold font-serif flex items-center justify-center text-xs">
            WS
          </div>
          <p className="font-bold text-xs truncate">Wallabhi S.</p>
          <span className="text-[10px] font-mono text-moss-green block">Lead Mentor</span>
        </div>

        <div className="flex flex-col items-center justify-center px-1">
          <ArrowRight className="w-5 h-5 text-forest-green animate-pulse" />
          <span className="text-[9px] font-mono uppercase font-bold text-forest-green mt-1">
            Weekly PR
          </span>
        </div>

        <div className="flex-1 p-3.5 rounded-2xl bg-forest-green text-beige border border-beige/20 text-center space-y-1">
          <div className="w-8 h-8 mx-auto rounded-full bg-moss-green text-forest-green font-bold font-serif flex items-center justify-center text-xs">
            JS
          </div>
          <p className="font-bold text-xs truncate">Junior Scholar</p>
          <span className="text-[10px] font-mono text-rosy-brown block">1st / 2nd Year</span>
        </div>
      </div>

      {/* Code Review Dialogue Snippet */}
      <div className="p-3 rounded-xl bg-forest-green/90 text-beige border border-beige/10 font-mono text-[11px] space-y-1.5">
        <div className="flex items-center gap-1.5 text-moss-green text-[10px] font-bold">
          <Code2 className="w-3.5 h-3.5" />
          <span>Super 50 Inline Code Review</span>
        </div>
        <p className="text-beige/80 text-[10px] italic">
          "Great job separating MQTT callbacks into a FreeRTOS task. Let's add watchdog timer safeguards in Milestone 3."
        </p>
      </div>
    </div>
  );
}

/**
 * Visual illustration for Project Recommendations.
 * Displays difficulty tiers and tangible deliverables.
 */
function ProjectCatalogMatrixVisual({ textColor }: { textColor: string }) {
  const tiers = [
    { tier: "Tier I: Explorer", focus: "1st Year Fundamentals", example: "Particulate Telemetry Node" },
    { tier: "Tier II: Builder", focus: "2nd Year Integration", example: "Edge Vision Defect Classifier" },
    { tier: "Tier III: Innovator", focus: "3rd/4th Year Patentable", example: "Pipelined VLSI Filter ASIC" },
  ];

  return (
    <div className="w-full max-w-sm p-6 rounded-3xl bg-forest-green text-beige border border-beige/20 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-beige/15">
        <span className="font-mono text-xs uppercase tracking-wider text-rosy-brown font-bold">
          Difficulty Tiers Matrix
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-moss-green/20 text-moss-green">
          Verified Specs
        </span>
      </div>

      <div className="space-y-2.5">
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-midnight-green/40 border border-beige/10 space-y-1 hover:border-rosy-brown/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-beige">{t.tier}</span>
              <span className="text-[10px] font-mono text-moss-green">{t.focus}</span>
            </div>
            <p className="text-[11px] text-beige/75 truncate">
              Sample: <span className="text-rosy-brown italic">{t.example}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-beige/60">
        <span>Forkable Starter Repos</span>
        <span>CI/CD &amp; Docker Included</span>
      </div>
    </div>
  );
}

/**
 * Modal breakdown displaying deep technical details of the selected service.
 */
function ServiceDetailModal({
  service,
  onClose,
}: {
  service: ServiceCardData;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={service.title}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl p-8 md:p-10 max-h-[90vh] overflow-y-auto border border-beige/25 shadow-2xl relative"
        style={{
          backgroundColor: service.bgToken,
          color: service.textColor,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-current/20 hover:border-current transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-current/20 font-semibold">
            Pillar {service.number} • {service.badge}
          </span>
        </div>

        <h3 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-3">
          {service.title}
        </h3>

        <p className="text-base md:text-lg italic font-medium opacity-90 mb-6">
          "{service.subtitle}"
        </p>

        {/* Benefit Callout */}
        <div
          className="p-5 rounded-2xl mb-8 border border-current/20"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
        >
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold mb-2 opacity-75">
            Core Student Benefit
          </h4>
          <p className="text-sm md:text-base leading-relaxed opacity-95">
            {service.benefitStatement}
          </p>
        </div>

        {/* Full Narrative */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold opacity-75">
            Deep Architecture &amp; Methodology
          </h4>
          <p className="text-sm md:text-base leading-relaxed opacity-100 font-medium font-sans">
            {service.description}
          </p>
        </div>

        {/* Deliverables Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            className="p-5 rounded-2xl border border-current/20"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}
          >
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold mb-3 opacity-80">
              Included Deliverables
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm">
              {service.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
                  <span className="opacity-90">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="p-5 rounded-2xl border border-current/20"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.12)" }}
          >
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold mb-3 opacity-80">
              Platform Metrics
            </h4>
            <div className="space-y-3">
              {service.stats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="opacity-75">{stat.label}:</span>
                  <span className="font-bold font-serif text-sm">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Launch */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-current/20">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-current/30 text-xs font-mono uppercase hover:border-current transition-colors"
          >
            Close Breakdown
          </button>
          <Link
            href={service.actionLink}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all"
            style={{
              backgroundColor: service.textColor === "#0A3323" ? "#0A3323" : "#D3968C",
              color: service.textColor === "#0A3323" ? "#F7F4D5" : "#0A3323",
            }}
          >
            <span>{service.actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
