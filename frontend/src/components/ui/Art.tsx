import React from "react";

/** Brand color constants for procedural artwork. */
const C = {
  forest: "#0A3323",
  moss: "#839958",
  beige: "#F7F4D5",
  rosy: "#D3968C",
  midnight: "#105666",
};

/**
 * Procedurally generated abstract artwork component.
 * Serves as a visual placeholder for project images.
 * Replace with <Image> when real assets exist.
 */
export default function Art({
  variant = 0,
  className = "",
}: {
  variant?: number;
  className?: string;
}) {
  const v = variant % 5;
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Abstract geometric artwork"
    >
      {v === 0 && (
        <g>
          <rect width="400" height="500" fill={C.midnight} />
          <circle cx="200" cy="250" r="150" fill={C.forest} />
          <circle
            cx="200"
            cy="250"
            r="90"
            fill="none"
            stroke={C.rosy}
            strokeWidth="2"
          />
          <rect
            x="120"
            y="170"
            width="160"
            height="160"
            fill={C.moss}
            transform="rotate(45 200 250)"
            opacity=".9"
          />
          <circle cx="200" cy="250" r="30" fill={C.beige} />
        </g>
      )}
      {v === 1 && (
        <g>
          <rect width="400" height="500" fill={C.rosy} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={30 + i * 58}
              y={60 + (i % 2) * 40}
              width="40"
              height={380 - i * 36}
              rx="20"
              fill={i % 2 ? C.forest : C.midnight}
            />
          ))}
          <circle cx="320" cy="90" r="36" fill={C.beige} />
        </g>
      )}
      {v === 2 && (
        <g>
          <rect width="400" height="500" fill={C.moss} />
          <path
            d="M0 400 Q100 250 200 330 T400 200 V500 H0Z"
            fill={C.forest}
          />
          <path
            d="M0 450 Q120 330 220 390 T400 300 V500 H0Z"
            fill={C.midnight}
          />
          <circle cx="130" cy="140" r="70" fill={C.beige} />
        </g>
      )}
      {v === 3 && (
        <g>
          <rect width="400" height="500" fill={C.forest} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect
              key={i}
              x={20 + i * 12}
              y={20 + i * 12}
              width={360 - i * 24}
              height={460 - i * 24}
              fill="none"
              stroke={i % 2 ? C.moss : C.rosy}
              strokeWidth="1.5"
            />
          ))}
          <rect x="150" y="190" width="100" height="120" fill={C.beige} />
        </g>
      )}
      {v === 4 && (
        <g>
          <rect width="400" height="500" fill={C.beige} />
          <polygon points="200,60 360,340 40,340" fill={C.midnight} />
          <polygon points="200,150 300,340 100,340" fill={C.rosy} />
          <rect
            x="40"
            y="370"
            width="320"
            height="70"
            rx="35"
            fill={C.forest}
          />
          <circle cx="75" cy="405" r="22" fill={C.moss} />
        </g>
      )}
    </svg>
  );
}
