"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import InspiviaLogo from "@/components/ui/InspiviaLogo";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Skip preloader if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { val: 0 };
      const letters = lettersRef.current?.querySelectorAll(".preload-char");

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Animate logo emblem entrance with spring-like overshoot
      tl.fromTo(
        logoWrapRef.current,
        { scale: 0.85, opacity: 0, rotate: -10 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: "power3.out" }
      );

      // Staggered character reveal
      if (letters && letters.length > 0) {
        tl.fromTo(
          letters,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.045,
            ease: "power4.out",
          },
          "-=0.45"
        );
      }

      // Smooth progress counter & line fill
      tl.to(
        counter,
        {
          val: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            setPercent(Math.round(counter.val));
          },
        },
        "-=0.4"
      );

      tl.to(
        progressLineRef.current,
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "<"
      );

      // Curtain clip-path reveal into homepage
      tl.to(
        [logoWrapRef.current, lettersRef.current],
        {
          y: -30,
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
        },
        "+=0.15"
      ).to(
        containerRef.current,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.95,
          ease: "expo.inOut",
        },
        "-=0.15"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  const brandChars = ["i", "n", "s", "p", "i", "v", "i", "a"];
  const dotColors = ["#D3968C", null, null, null, "#839958", null, "#D3968C", null];

  return (
    <div
      ref={containerRef}
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      className="fixed inset-0 z-[100] bg-forest-green text-beige flex flex-col justify-between p-6 md:p-12 overflow-hidden"
    >
      {/* Top Architectural Metadata */}
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-beige/60 font-sans">
        <span>Student Mentorship &amp; Engineering Platform</span>
        <span>EST. 2026</span>
      </div>

      {/* Center Emblem + Staggered Brand Wordmark */}
      <div className="flex flex-col items-center justify-center my-auto gap-6">
        <div ref={logoWrapRef} className="relative">
          <div className="absolute -inset-6 rounded-full border border-moss-green/30 animate-spin-slow" />
          <InspiviaLogo showWordmark={false} size="lg" variant="light" />
        </div>

        <div
          ref={lettersRef}
          className="overflow-hidden flex items-center justify-center py-2"
          aria-label="INSPIVIA"
        >
          {brandChars.map((char, idx) => (
            <span
              key={idx}
              className="preload-char inline-block font-serif font-bold text-5xl sm:text-7xl md:text-8xl tracking-tight text-beige"
            >
              {char === "i" ? (
                <span className="relative inline-block">
                  ı
                  <span
                    className="absolute top-[0.06em] left-1/2 -translate-x-1/2 w-[0.18em] h-[0.18em] rounded-full"
                    style={{
                      backgroundColor: dotColors[idx] || "#D3968C",
                    }}
                  />
                </span>
              ) : (
                char
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Progress Bar & Percentage */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-3">
          <span className="text-xs uppercase tracking-[0.25em] text-rosy-brown font-sans">
            Initializing Your Mentorship Space
          </span>
          <span className="font-serif text-3xl md:text-4xl font-semibold text-beige tabular-nums">
            {String(percent).padStart(3, "0")}%
          </span>
        </div>
        <div className="w-full h-[2px] bg-beige/15 overflow-hidden rounded-full">
          <div
            ref={progressLineRef}
            style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
            className="w-full h-full bg-gradient-to-r from-moss-green via-rosy-brown to-beige"
          />
        </div>
      </div>
    </div>
  );
}
