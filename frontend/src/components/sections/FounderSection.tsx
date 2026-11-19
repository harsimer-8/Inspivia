import React from "react";
import { Linkedin, Instagram, ExternalLink, ShieldCheck } from "lucide-react";
import FounderPortrait from "@/components/ui/FounderPortrait";
import { BRAND_INFO, TEAM_MEMBERS } from "@/data/inspiviaData";

/**
 * "Meet the Founder" block used on the About page.
 * Photo, name, role and LinkedIn all come from src/data/inspiviaData.ts.
 */
export default function FounderSection() {
  const founder = TEAM_MEMBERS.find((m) => m.isFounder) || TEAM_MEMBERS[0];
  const instagram = BRAND_INFO.socials.find((s) => s.label === "Instagram");
  const companyLinkedIn = BRAND_INFO.socials.find((s) => s.label === "LinkedIn");

  return (
    <section
      id="founder"
      className="py-28 md:py-36 bg-forest-green text-beige relative overflow-hidden border-b border-beige/10"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-rosy-brown/15 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-3">
            About the Founder
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige">
            Meet the Person Behind{" "}
            <span className="italic text-rosy-brown">INSPIVIA</span>.
          </h2>
        </div>

        <div className="rounded-3xl p-8 md:p-12 bg-midnight-green/35 border border-rosy-brown/40 shadow-[0_25px_70px_rgba(0,0,0,0.4)] grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* Portrait */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full border-4 border-rosy-brown/60 p-2 bg-gradient-to-tr from-forest-green to-midnight-green shadow-2xl">
              <div className="absolute -inset-3 rounded-full border border-dashed border-beige/25 animate-spin-slow pointer-events-none" />
              <FounderPortrait src={founder.image} name={founder.name} initials={founder.initials} />
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-8 space-y-5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-green/80 border border-beige/15 text-xs font-mono text-rosy-brown">
              <ShieldCheck className="w-4 h-4 text-moss-green" />
              <span>Founder, INSPIVIA</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-beige">
              {founder.name}
            </h3>

            <p className="text-xs font-mono text-moss-green font-semibold tracking-wider uppercase">
              {founder.role} • {founder.discipline}
            </p>

            <p className="text-sm md:text-base text-beige/85 leading-relaxed font-sans">
              {founder.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href={founder.linkedIn}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-xl transition-all hover:scale-105"
              >
                <Linkedin className="w-4 h-4" />
                <span>Connect on LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {companyLinkedIn && (
                <a
                  href={companyLinkedIn.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-beige/30 text-beige hover:border-rosy-brown hover:text-rosy-brown font-mono text-xs uppercase tracking-wider transition-all"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>Company Page</span>
                </a>
              )}

              {instagram && (
                <a
                  href={instagram.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-beige/30 text-beige hover:border-rosy-brown hover:text-rosy-brown font-mono text-xs uppercase tracking-wider transition-all"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
