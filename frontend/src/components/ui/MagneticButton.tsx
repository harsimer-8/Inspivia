"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current || disabled) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.25;
    const y = (clientY - (top + height / 2)) * 0.25;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary:
      "bg-rosy-brown text-forest-green hover:bg-rosy-brown/90 shadow-[0_10px_25px_-5px_rgba(211,150,140,0.3)] font-semibold",
    secondary:
      "bg-moss-green text-beige hover:bg-moss-green/90 shadow-[0_10px_25px_-5px_rgba(131,153,88,0.3)] font-medium",
    outline:
      "border border-beige/30 text-beige hover:border-rosy-brown hover:text-rosy-brown bg-transparent",
    ghost:
      "text-beige/80 hover:text-beige hover:bg-beige/5 bg-transparent",
  }[variant];

  const sizeStyles = {
    sm: "px-4 py-2 text-xs tracking-wider uppercase",
    md: "px-6 py-3 text-sm tracking-wide",
    lg: "px-8 py-4 text-base tracking-wide font-medium",
  }[size];

  const innerContent = (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.2 }}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 cursor-pointer select-none active:scale-95 ${variantStyles} ${sizeStyles} ${className} ${
        disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
      }`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block" aria-disabled={disabled}>
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-block focus:outline-none"
    >
      {innerContent}
    </button>
  );
}
