"use client";

import React from "react";
import Link from "next/link";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import { BRAND_INFO } from "@/data/inspiviaData";
import { ArrowUp, Mail, Linkedin, Instagram, ExternalLink } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#072419] text-beige pt-20 pb-12 border-t border-beige/10 overflow-hidden">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[radial-gradient(#F7F4D5_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-beige/10">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-6">
            <InspiviaLogo size="md" />
            <p className="text-sm md:text-base text-beige/75 leading-relaxed max-w-sm">
              Helping engineering students overcome project confusion through structured milestone roadmaps, dedicated one-to-one expert mentorship, and AI Companion guidance.
            </p>
            <div className="pt-2">
              <a
                href={`mailto:${BRAND_INFO.officialEmail}`}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-midnight-green/40 border border-beige/15 text-xs text-rosy-brown hover:text-beige hover:border-beige/30 transition-all font-mono"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{BRAND_INFO.officialEmail}</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  About Our Story
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  Mentorship Services
                </Link>
              </li>
              <li>
                <Link href="/work" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  Founder & Mentors
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  Student Community & Super 50
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Product Suite Column */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold">
              Student Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dashboard" className="text-beige/75 hover:text-rosy-brown transition-colors flex items-center gap-2">
                  <span>Student Dashboard</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rosy-brown/20 text-rosy-brown">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/ai-companion" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  AI Project Companion
                </Link>
              </li>
              <li>
                <Link href="/dashboard/roadmap" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  Personalized Learning Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/dashboard/projects" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  Curated Project Matchmaker
                </Link>
              </li>
              <li>
                <Link href="/dashboard/mentors" className="text-beige/75 hover:text-rosy-brown transition-colors">
                  1-on-1 Mentor Discovery & Booking
                </Link>
              </li>
            </ul>

            <div className="pt-4">
              <span className="text-xs font-mono text-beige/50 block mb-2">Follow INSPIVIA:</span>
              <div className="flex items-center gap-3">
                {BRAND_INFO.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-forest-green border border-beige/15 text-beige/70 hover:text-rosy-brown hover:border-rosy-brown flex items-center justify-center transition-all text-xs"
                    aria-label={social.label}
                  >
                    {social.label === "LinkedIn" ? (
                      <Linkedin className="w-4 h-4" />
                    ) : social.label === "Instagram" ? (
                      <Instagram className="w-4 h-4" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" />
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Large Typographic Lowercase Watermark */}
        <div className="py-12 select-none overflow-hidden flex justify-center opacity-10">
          <span className="text-6xl sm:text-8xl md:text-9xl font-serif font-black tracking-tight text-stroke-beige lowercase">
            inspivia
          </span>
        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-beige/60">
          <div>
            © 2026 INSPIVIA Platform. All rights reserved. Founded by{" "}
            <a
              href={BRAND_INFO.founderLinkedIn}
              target="_blank"
              rel="noreferrer"
              className="text-rosy-brown hover:underline underline-offset-2 transition-colors"
            >
              {BRAND_INFO.founder}
            </a>
            .
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-beige/50">
              Built with direction for engineers
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-green border border-beige/15 text-beige hover:text-rosy-brown hover:border-rosy-brown transition-all"
              aria-label="Scroll to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
