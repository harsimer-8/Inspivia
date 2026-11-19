"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SIGNATURE_FLASHCARDS, FlashcardStep } from "@/data/inspiviaData";
import { CheckCircle2, ArrowRight, Sparkles, Compass, BookOpen, Hammer, Rocket } from "lucide-react";

const ICONS = [Compass, BookOpen, Hammer, Rocket];

export default function SignatureFlashcards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeCard, setActiveCard] = useState<string>("discover");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  return (
    <section
      ref={containerRef}
      id="methodology"
      className="relative py-28 md:py-36 bg-forest-green text-beige overflow-hidden"
    >
      {/* Background Architectural Accent Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-beige/30 to-transparent -translate-x-1/2" />
        <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-moss-green/30 to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rosy-brown/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-green/40 border border-beige/20 text-xs tracking-widest uppercase text-rosy-brown font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-rosy-brown" />
            <span>Signature Engineering Methodology</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-beige mb-6">
            Four Steps from <span className="italic text-rosy-brown font-serif">Confusion</span> to Proof of Work.
          </h2>

          <p className="text-base md:text-lg text-beige/80 leading-relaxed font-sans">
            Our signature progression turns student anxiety into demonstrable competence. Scroll to watch the four pillars assemble into your personalized path.
          </p>
        </div>

        {/* The Animated Flashcard Stack Container */}
        <div className="space-y-12 md:space-y-16">
          {SIGNATURE_FLASHCARDS.map((card, index) => {
            const Icon = ICONS[index % ICONS.length];
            const isEven = index % 2 === 0;

            // Scroll-driven transforms
            // Staggered range for each card in the scroll progress
            const startScroll = Math.max(0, index * 0.18);
            const endScroll = Math.min(1, startScroll + 0.35);

            return (
              <FlashcardItem
                key={card.id}
                card={card}
                index={index}
                isEven={isEven}
                Icon={Icon}
                scrollYProgress={scrollYProgress}
                startScroll={startScroll}
                endScroll={endScroll}
                shouldReduceMotion={shouldReduceMotion}
                isActive={activeCard === card.id}
                onSelect={() => setActiveCard(card.id)}
              />
            );
          })}
        </div>

        {/* Interactive Bottom Anchor Bar */}
        <div className="mt-20 p-6 md:p-8 rounded-3xl bg-midnight-green/40 border border-beige/15 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rosy-brown/20 border border-rosy-brown/40 flex items-center justify-center text-rosy-brown font-serif font-bold text-xl">
              i
            </div>
            <div>
              <h3 className="text-lg font-serif font-semibold text-beige">
                Ready to break the inertia on your project?
              </h3>
              <p className="text-sm text-beige/70">
                Join the upcoming Super 50 cohort or start your roadmap with the AI Companion today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <a
              href="/dashboard/ai-companion"
              className="w-full md:w-auto text-center px-6 py-3 rounded-full bg-rosy-brown text-forest-green font-semibold text-sm hover:bg-rosy-brown/90 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Talk to the AI Companion</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/services"
              className="w-full md:w-auto text-center px-6 py-3 rounded-full border border-beige/30 text-beige text-sm hover:border-beige transition-all"
            >
              All Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FlashcardItemProps {
  card: FlashcardStep;
  index: number;
  isEven: boolean;
  Icon: React.ComponentType<{ className?: string }>;
  scrollYProgress: any;
  startScroll: number;
  endScroll: number;
  shouldReduceMotion: boolean | null;
  isActive: boolean;
  onSelect: () => void;
}

function FlashcardItem({
  card,
  index,
  isEven,
  Icon,
  scrollYProgress,
  startScroll,
  endScroll,
  shouldReduceMotion,
  isActive,
  onSelect,
}: FlashcardItemProps) {
  // Lateral entry from alternating viewport sides
  const initialX = isEven ? -140 : 140;
  const initialRotate = isEven ? -5 : 5;

  const x = useTransform(
    scrollYProgress,
    [startScroll, endScroll],
    shouldReduceMotion ? [0, 0] : [initialX, 0]
  );

  const rotate = useTransform(
    scrollYProgress,
    [startScroll, endScroll],
    shouldReduceMotion ? [0, 0] : [initialRotate, 0]
  );

  const opacity = useTransform(
    scrollYProgress,
    [startScroll, endScroll],
    [0.25, 1]
  );

  const scale = useTransform(
    scrollYProgress,
    [startScroll, endScroll],
    shouldReduceMotion ? [1, 1] : [0.94, 1]
  );

  return (
    <motion.div
      onClick={onSelect}
      className={`relative w-full rounded-3xl p-8 md:p-12 transition-all duration-300 cursor-pointer border ${
        isActive
          ? "border-rosy-brown ring-1 ring-rosy-brown/50 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
          : "border-beige/15 hover:border-beige/40 shadow-[0_15px_35px_rgba(0,0,0,0.25)]"
      }`}
      style={{
        backgroundColor: card.accentBg,
        color: card.textColor,
        x,
        rotate,
        opacity,
        scale,
      }}
    >
      {/* Top Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{
              backgroundColor: card.textColor === "#0A3323" ? "#0A3323" : "#F7F4D5",
              color: card.textColor === "#0A3323" ? "#F7F4D5" : "#0A3323",
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-mono text-xs tracking-widest uppercase opacity-85 font-semibold">
            {card.phase}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-serif italic text-2xl md:text-3xl font-light opacity-50">
            {card.number}
          </span>
        </div>
      </div>

      {/* Main Grid: Description & Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <h3 className="text-2xl md:text-4xl font-serif font-bold tracking-tight mb-3">
            {card.title}
          </h3>
          <p className="text-base md:text-lg font-medium opacity-90 mb-6 italic">
            "{card.subtitle}"
          </p>
          <p className="text-sm md:text-base leading-relaxed opacity-85">
            {card.description}
          </p>
        </div>

        <div className="lg:col-span-5 bg-black/15 p-6 rounded-2xl border border-current/15 backdrop-blur-sm">
          <h4 className="text-xs font-mono uppercase tracking-widest font-bold mb-4 opacity-75">
            Key Outcomes & Deliverables
          </h4>
          <ul className="space-y-3">
            {card.keyOutcomes.map((outcome, oIdx) => (
              <li key={oIdx} className="flex items-start gap-3 text-sm leading-snug">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
                <span className="opacity-90">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
