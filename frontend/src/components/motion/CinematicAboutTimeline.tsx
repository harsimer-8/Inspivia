"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Rocket,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface TimelineCard {
  id: string;
  phaseNumber: string;
  title: string;
  leadQuote: string;
  narrative: string;
  insights: string[];
  expertReflection: string;
  badge: string;
  bgToken: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TIMELINE_CARDS: TimelineCard[] = [
  {
    id: "the-question",
    phaseNumber: "01",
    title: "The Question",
    leadQuote: "How do I start building real projects? How do I choose between so many technologies without getting lost?",
    narrative:
      "It was a quiet evening in the college corridors of an engineering campus. A first-year engineering student approached expert mentor Wallabhi Saxena holding a notebook filled with scribbled tutorials, bookmarked links, and conflicting advice. She didn't lack enthusiasm or drive. What she carried was a heavy, quiet confusion: 'Everyone says to build projects, but no one tells us which file to create first, which ideas actually matter, or how to know which skills are required.'",
    insights: [
      "Paralysis caused by 100+ conflicting internet roadmaps",
      "Fear of choosing the 'wrong' tech stack in 1st year",
      "Inability to distinguish toy tutorials from portfolio-grade engineering",
    ],
    expertReflection:
      "Wallabhi listened and realized this wasn't one student's hesitation — it was the collective, unspoken plea of an entire generation of engineering students.",
    badge: "The Spark of Inquiry",
    bgToken: "#105666",
    textColor: "#F7F4D5",
    accentColor: "#D3968C",
    borderColor: "rgba(247, 244, 213, 0.2)",
    icon: HelpCircle,
  },
  {
    id: "the-realization",
    phaseNumber: "02",
    title: "The Realization",
    leadQuote: "Students don't suffer from a lack of capability. They suffer from a total vacuum of empathetic direction.",
    narrative:
      "As that conversation deepened, the underlying truth became painfully evident. Bright students were spending their first two years trapped in infinite tutorial loops because no one had demystified the engineering process for them. They assumed that experts who had won hackathons or secured research fellowships possessed some secret superpower, when in reality, all they had was a clear mental model and the discipline to iterate.",
    insights: [
      "Ambition gets smothered when students are left isolated",
      "A 15-minute expert orientation can save 6 months of wasted time",
      "Mentorship is not lecturing; it is providing structured permission to build",
    ],
    expertReflection:
      "If we could connect experts who have already navigated the minefield with juniors eager to take their first step, confusion would turn into momentum.",
    badge: "The Diagnostic Shift",
    bgToken: "#839958",
    textColor: "#0A3323",
    accentColor: "#0A3323",
    borderColor: "rgba(10, 51, 35, 0.3)",
    icon: Lightbulb,
  },
  {
    id: "the-gap",
    phaseNumber: "03",
    title: "The Gap",
    leadQuote: "Colleges teach algorithms from 1995. The internet gives you 50-hour video courses. Neither teaches you how to ship.",
    narrative:
      "The academic system prioritizes rote memorization for semester exams, leaving students entirely unequipped to wire an ESP32 microcontroller, write asynchronous TypeScript, deploy a containerized backend, or draft a provisional patent. Meanwhile, online platforms dump thousands of uncurated videos without feedback, accountability, or code reviews. The mentor-mentee bridge, once the sacred backbone of engineering campuses, had decayed into social distance.",
    insights: [
      "The chasm between semester syllabus theory and working engineering code",
      "The trap of 'Tutorial Hell' where consumption replaces creation",
      "The social friction and hesitation juniors feel when approaching experts",
    ],
    expertReflection:
      "To bridge this chasm, we didn't need another generic ed-tech portal. We needed a living ecosystem of personalized roadmaps, direct human guidance, and intelligent AI companion tools.",
    badge: "The Structural Chasm",
    bgToken: "#0A3323",
    textColor: "#F7F4D5",
    accentColor: "#839958",
    borderColor: "rgba(211, 150, 140, 0.35)",
    icon: AlertTriangle,
  },
  {
    id: "the-beginning",
    phaseNumber: "04",
    title: "The Beginning",
    leadQuote: "From an experimental mentorship cohort to INSPIVIA: Turning imagination into measurable proof of work.",
    narrative:
      "Wallabhi Saxena took action. She launched the flagship 'Super 50' cohort, personally mentoring engineering students across CS, AI, ECE, and EEE. With weekly deadlines, direct 1-on-1 code reviews, and structured project milestones, every single student delivered a working prototype — from environmental IoT telemetry to medical diagnostics and VLSI signal synthesizers. That triumphant experiment became the foundation of INSPIVIA, united with an AI companion to scale authentic mentorship worldwide.",
    insights: [
      "100% project completion rate achieved in the Super 50 cohort",
      "500+ verified working prototypes shipped right from the 1st year",
      "The AI Companion: 24/7 architectural guidance alongside human mentors",
    ],
    expertReflection:
      "INSPIVIA exists so that no student ever has to ask 'Where do I begin?' in silence again.",
    badge: "The Inspivia Movement",
    bgToken: "#D3968C",
    textColor: "#0A3323",
    accentColor: "#0A3323",
    borderColor: "rgba(10, 51, 35, 0.3)",
    icon: Rocket,
  },
];

export default function CinematicAboutTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 15%"],
  });

  return (
    <div ref={containerRef} className="relative space-y-16 md:space-y-24 py-12">
      {/* Central Visual Axis Guide Line */}
      <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-beige/20 to-transparent -translate-x-1/2 pointer-events-none" />

      {TIMELINE_CARDS.map((card, index) => {
        const isEven = index % 2 === 0;
        const startScroll = Math.max(0, index * 0.2);
        const endScroll = Math.min(1, startScroll + 0.35);

        return (
          <CinematicCard
            key={card.id}
            card={card}
            index={index}
            isEven={isEven}
            scrollYProgress={scrollYProgress}
            startScroll={startScroll}
            endScroll={endScroll}
            shouldReduceMotion={shouldReduceMotion}
          />
        );
      })}
    </div>
  );
}

interface CinematicCardProps {
  card: TimelineCard;
  index: number;
  isEven: boolean;
  scrollYProgress: any;
  startScroll: number;
  endScroll: number;
  shouldReduceMotion: boolean | null;
}

function CinematicCard({
  card,
  index,
  isEven,
  scrollYProgress,
  startScroll,
  endScroll,
  shouldReduceMotion,
}: CinematicCardProps) {
  const Icon = card.icon;

  // Animate each chapter against its own viewport position. It slides in
  // with a slight angle, then becomes perfectly straight when centered.
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ["start 92%", "center 52%"],
  });

  const initialX = isEven ? -140 : 140;
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
    <div className="relative">
      {/* Mobile & Tablet Indicator */}
      <div className="flex items-center gap-3 mb-4 lg:hidden">
        <span className="w-8 h-8 rounded-xl bg-midnight-green border border-beige/20 text-rosy-brown font-mono font-bold text-xs flex items-center justify-center">
          {card.phaseNumber}
        </span>
        <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold">
          Chapter {card.phaseNumber} • {card.badge}
        </span>
      </div>

      <motion.div
        ref={cardRef}
        style={{
          x,
          rotate,
          opacity: 1,
          scale,
          backgroundColor: card.bgToken,
          color: card.textColor,
        }}
        className="rounded-3xl p-8 md:p-12 lg:p-14 border border-beige/15 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-300 relative overflow-hidden"
      >
        {/* Subtle Watermark Number in Card Corner */}
        <div
          className="absolute right-6 top-4 font-serif font-black text-6xl md:text-8xl opacity-10 select-none pointer-events-none"
          style={{ color: card.textColor }}
        >
          {card.phaseNumber}
        </div>

        {/* Top Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md font-bold"
              style={{
                backgroundColor: card.textColor === "#0A3323" ? "#0A3323" : "#F7F4D5",
                color: card.textColor === "#0A3323" ? "#F7F4D5" : "#0A3323",
              }}
            >
              <Icon className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest opacity-80 block font-semibold">
                Chapter {card.phaseNumber} • {card.badge}
              </span>
              <h3 className="text-2xl md:text-4xl font-serif font-bold tracking-tight">
                {card.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Lead Quote */}
        <div
          className="p-5 md:p-6 rounded-2xl mb-8 border border-current/15 relative z-10"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
        >
          <blockquote className="font-serif italic text-base md:text-xl font-semibold leading-relaxed opacity-100">
            "{card.leadQuote}"
          </blockquote>
        </div>

        {/* Narrative & Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest font-bold opacity-75">
              The Historical Chronicle
            </h4>
            <p className="text-sm md:text-base leading-relaxed opacity-100 font-medium font-sans">
              {card.narrative}
            </p>

            <div
              className="p-4 rounded-xl border border-current/20 text-xs md:text-sm italic opacity-95"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
            >
              <span className="font-mono not-italic uppercase text-[10px] tracking-wider block font-bold mb-1 opacity-70">
                Mentor Reflection:
              </span>
              "{card.expertReflection}"
            </div>
          </div>

          <div
            className="lg:col-span-5 p-6 rounded-2xl border border-current/20"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            <h4 className="text-xs font-mono uppercase tracking-widest font-bold mb-4 opacity-80">
              Key Diagnostic Revelations
            </h4>
            <ul className="space-y-3">
              {card.insights.map((insight, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2.5 text-xs md:text-sm leading-snug font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
                  <span className="opacity-90">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
