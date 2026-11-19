"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";

export interface ReusableFlashcardItem {
  id: string;
  number: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  bgToken: string;
  textColor: string;
  accentToken: string;
  borderColor?: string;
  icon?: React.ComponentType<{ className?: string }>;
  ctaText?: string;
  ctaLink?: string;
}

export interface SignatureScrollFlashcardsProps {
  id?: string;
  items: ReusableFlashcardItem[];
  eyebrow?: string;
  heading?: string;
  headingAccent?: string;
  subheading?: string;
  className?: string;
}

export default function SignatureScrollFlashcards({
  id = "flashcard-sequence",
  items,
  eyebrow,
  heading,
  headingAccent,
  subheading,
  className = "",
}: SignatureScrollFlashcardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  return (
    <div ref={containerRef} id={id} className={`relative space-y-12 md:space-y-16 ${className}`}>
      {/* Optional Editorial Header */}
      {(eyebrow || heading) && (
        <div className="text-center max-w-3xl mx-auto mb-16">
          {eyebrow && (
            <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-3">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-4">
              {heading}{" "}
              {headingAccent && (
                <span className="italic text-rosy-brown font-normal">{headingAccent}</span>
              )}
            </h2>
          )}
          {subheading && (
            <p className="text-sm md:text-base text-beige/80 leading-relaxed font-sans max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>
      )}

      {/* Alternating Flashcard Sequence */}
      <div className="space-y-12 md:space-y-16">
        {items.map((card, index) => {
          const isEven = index % 2 === 0;
          const startScroll = Math.max(0, index * 0.18);
          const endScroll = Math.min(1, startScroll + 0.38);

          return (
            <ScrollFlashcardNode
              key={card.id}
              card={card}
              index={index}
              isEven={isEven}
              scrollYProgress={scrollYProgress}
              startScroll={startScroll}
              endScroll={endScroll}
              shouldReduceMotion={shouldReduceMotion}
              isActive={activeId === card.id}
              onSelect={() => setActiveId(card.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface ScrollFlashcardNodeProps {
  card: ReusableFlashcardItem;
  index: number;
  isEven: boolean;
  scrollYProgress: any;
  startScroll: number;
  endScroll: number;
  shouldReduceMotion: boolean | null;
  isActive: boolean;
  onSelect: () => void;
}

function ScrollFlashcardNode({
  card,
  index,
  isEven,
  scrollYProgress,
  startScroll,
  endScroll,
  shouldReduceMotion,
  isActive,
  onSelect,
}: ScrollFlashcardNodeProps) {
  const Icon = card.icon;

  // Alternating entry offsets: Left (-160px) and Right (+160px)
  const initialX = isEven ? -160 : 160;
  const initialRotate = isEven ? -4 : 4;

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
      style={{
        x,
        rotate,
        opacity,
        scale,
        backgroundColor: card.bgToken,
        color: card.textColor,
      }}
      className={`rounded-3xl p-8 md:p-12 transition-all duration-300 cursor-pointer border shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative overflow-hidden ${
        isActive
          ? "border-rosy-brown ring-1 ring-rosy-brown/40"
          : "border-beige/15 hover:border-beige/35"
      }`}
    >
      {/* Top Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md"
              style={{
                backgroundColor: card.textColor === "#0A3323" ? "#0A3323" : "#F7F4D5",
                color: card.textColor === "#0A3323" ? "#F7F4D5" : "#0A3323",
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
          )}
          <span className="font-mono text-xs tracking-widest uppercase opacity-80 font-semibold">
            {card.badge}
          </span>
        </div>

        <span className="font-serif italic text-2xl md:text-3xl font-light opacity-50">
          {card.number}
        </span>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-2xl md:text-4xl font-serif font-bold tracking-tight">
            {card.title}
          </h3>
          <p className="text-sm md:text-base font-medium opacity-90 italic">
            "{card.subtitle}"
          </p>
          <p className="text-xs md:text-sm leading-relaxed opacity-85 font-sans">
            {card.description}
          </p>

          {card.ctaLink && (
            <div className="pt-3">
              <a
                href={card.ctaLink}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-bold hover:underline"
              >
                <span>{card.ctaText || "Explore Phase"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Highlights List */}
        {card.highlights && card.highlights.length > 0 && (
          <div className="lg:col-span-5 bg-black/15 p-5 md:p-6 rounded-2xl border border-current/15 backdrop-blur-sm space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-wider font-bold opacity-75">
              Key Deliverables &amp; Outcomes
            </h4>
            <ul className="space-y-2.5">
              {card.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm leading-snug">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 opacity-90" />
                  <span className="opacity-90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
