"use client";

import React, { useState } from "react";

interface FounderPortraitProps {
  src?: string;
  name: string;
  initials: string;
  className?: string;
}

/**
 * Circular founder portrait.
 * Automatically checks for PNG or JPG formats (e.g. wallabhi-saxena.png, wallabhi-saxena.jpg, founder.png),
 * and falls back to a clean monogram if the image file is missing.
 */
export default function FounderPortrait({ src, name, initials, className = "" }: FounderPortraitProps) {
  const [candidateIndex, setCandidateIndex] = useState(0);

  // Candidates in priority order: first src, then common variants in public/team/
  const candidates = [
    src,
    "/team/wallabhi-saxena.png",
    "/team/wallabhi-saxena.jpg",
    "/team/founder.png",
    "/team/founder.jpg",
  ].filter(Boolean) as string[];

  const uniqueCandidates = Array.from(new Set(candidates));

  if (candidateIndex >= uniqueCandidates.length) {
    return (
      <div
        className={`w-full h-full rounded-full bg-rosy-brown text-forest-green font-serif font-black flex items-center justify-center text-5xl sm:text-6xl shadow-inner ${className}`}
        role="img"
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  const currentSrc = uniqueCandidates[candidateIndex];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={`Portrait of ${name}`}
      onError={() => setCandidateIndex((prev) => prev + 1)}
      className={`w-full h-full rounded-full object-cover shadow-inner ${className}`}
    />
  );
}
