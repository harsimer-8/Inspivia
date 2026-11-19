"use client";

import React from "react";
import Link from "next/link";

interface InspiviaLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  href?: string;
}

export default function InspiviaLogo({
  className = "",
  showWordmark = true,
  size = "md",
  variant = "light",
  href,
}: InspiviaLogoProps) {
  const iconDimensions = {
    sm: 34,
    md: 46,
    lg: 78,
  }[size];

  const textSize = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl md:text-5xl",
  }[size];

  const stemColor = variant === "light" ? "#F7F4D5" : "#0A3323";
  const wordmarkColor = variant === "light" ? "text-beige" : "text-forest-green";
  const orbitStroke = variant === "light" ? "#F7F4D5" : "#0A3323";

  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg
        width={iconDimensions}
        height={iconDimensions}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300 hover:rotate-6"
      >
        {/* Architectural Dashed Orbit */}
        <circle
          cx="60"
          cy="62"
          r="46"
          stroke={orbitStroke}
          strokeOpacity="0.32"
          strokeWidth="1.25"
          strokeDasharray="2 4"
        />

        {/* Apex Midnight Green Orb */}
        <circle cx="60" cy="16" r="4.5" fill="#105666" />

        {/* Rosy Brown Center Orb */}
        <circle cx="60" cy="44" r="7.5" fill="#D3968C" />

        {/* Left Arm - Midnight Green */}
        <path
          d="M41 37C41 32.5817 44.5817 29 49 29C53.4183 29 57 32.5817 57 37V58C57 62.4183 53.4183 66 49 66C44.5817 66 41 62.4183 41 58V37Z"
          transform="rotate(-24 49 48)"
          fill="#105666"
        />

        {/* Right Arm - Moss Green */}
        <path
          d="M63 37C63 32.5817 66.5817 29 71 29C75.4183 29 79 32.5817 79 37V58C79 62.4183 75.4183 66 71 66C66.5817 66 63 62.4183 63 58V37Z"
          transform="rotate(24 71 48)"
          fill="#839958"
        />

        {/* Central Vertical Stem */}
        <rect
          x="52.5"
          y="53"
          width="15"
          height="44"
          rx="7.5"
          fill={stemColor}
        />
      </svg>

      {showWordmark && (
        <span
          className={`font-serif font-bold tracking-tight lowercase leading-none flex items-baseline ${textSize} ${wordmarkColor}`}
        >
          <span>
            <span className="relative inline-block">
              ı
              <span
                className="absolute -top-[0.06em] left-1/2 -translate-x-1/2 w-[0.22em] h-[0.22em] rounded-full"
                style={{ backgroundColor: "#D3968C" }}
              />
            </span>
            nsp
            <span className="relative inline-block">
              ı
              <span
                className="absolute -top-[0.06em] left-1/2 -translate-x-1/2 w-[0.22em] h-[0.22em] rounded-full"
                style={{ backgroundColor: "#839958" }}
              />
            </span>
            v
            <span className="relative inline-block">
              ı
              <span
                className="absolute -top-[0.06em] left-1/2 -translate-x-1/2 w-[0.22em] h-[0.22em] rounded-full"
                style={{ backgroundColor: "#D3968C" }}
              />
            </span>
            a
          </span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block" aria-label="Inspivia Home">
        {content}
      </Link>
    );
  }

  return content;
}
