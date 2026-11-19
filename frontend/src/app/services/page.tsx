import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesInteractiveCards from "@/components/motion/ServicesInteractiveCards";
import {
  Sparkles,
  Compass,
  Users,
  FolderGit2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Award,
} from "lucide-react";

export const metadata = {
  title: "Mentorship Services & Capabilities — INSPIVIA",
  description:
    "Explore INSPIVIA's four core engineering pillars: Personalized Learning Roadmaps, One-to-One Expert Mentor Pairing, AI Project Companion, and Curated Project Recommendations.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 bg-forest-green text-beige pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        {/* ========================================================
            1. EDITORIAL HERO SECTION
            ======================================================== */}
        <section className="relative pb-16 md:pb-24 border-b border-beige/10">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-radial from-midnight-green/30 via-moss-green/10 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-midnight-green/50 border border-beige/20 text-xs font-mono uppercase tracking-widest text-rosy-brown mb-6 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-rosy-brown animate-pulse" />
                <span>Four Pillars of Engineering Mentorship</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight leading-[1.08] text-beige mb-6">
                Four Pillars Designed to{" "}
                <span className="italic font-normal text-rosy-brown block">
                  Guide You to Launch.
                </span>
              </h1>

              {/* Mission Narrative */}
              <p className="text-base sm:text-lg md:text-xl text-beige/85 font-sans leading-relaxed mb-8 max-w-2xl">
                Every service is engineered around the actual pain points of engineering students — eliminating tutorial paralysis, providing human accountability, and leveraging 24/7 AI-assisted guidance.
              </p>

              {/* Trust Callouts */}
              <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-beige/65">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-moss-green" />
                  <span>Super 50 Proven Methodology</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-rosy-brown" />
                  <span>500+ Verified Student Projects Shipped</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. INTERACTIVE ASYMMETRIC FLASHCARDS SECTION
            ======================================================== */}
        <section className="py-20 md:py-32 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
              <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-3">
                Scroll to Assemble
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-4">
                The Four INSPIVIA Capabilities
              </h2>
              <p className="text-sm md:text-base text-beige/75">
                Each card features a unique visual identity and benefit statement. Cards slide in from alternating sides and arrange sequentially as you scroll.
              </p>
            </div>

            {/* Asymmetric Alternating Interactive Flashcards */}
            <ServicesInteractiveCards />
          </div>
        </section>

        {/* ========================================================
            3. HOW THE 4 PILLARS INTERLOCK (THE STUDENT JOURNEY)
            ======================================================== */}
        <section className="py-24 bg-[#08291c] border-y border-beige/10 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-rosy-brown font-bold block mb-3">
                Systemic Synergy
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-4">
                How The 4 Services Connect in Practice.
              </h2>
              <p className="text-sm md:text-base text-beige/80">
                You never experience these services as disconnected silos. They form a continuous feedback loop that takes you from confusion to completed proof of work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-3">
                <span className="text-xs font-mono font-bold text-rosy-brown block">STEP 01 // DIAGNOSTIC</span>
                <h3 className="text-xl font-serif font-bold text-beige">Pick Your Roadmap</h3>
                <p className="text-xs text-beige/75 leading-relaxed">
                  Start with a semester-calibrated roadmap in Web, AI, IoT, or VLSI to break starter inertia.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-3">
                <span className="text-xs font-mono font-bold text-moss-green block">STEP 02 // CO-PILOT</span>
                <h3 className="text-xl font-serif font-bold text-beige">Decompose with the AI Companion</h3>
                <p className="text-xs text-beige/75 leading-relaxed">
                  Brainstorm project ideas 24/7 with the AI Companion, breaking requirements into weekly tickets.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-3">
                <span className="text-xs font-mono font-bold text-rosy-brown block">STEP 03 // HUMAN REVIEW</span>
                <h3 className="text-xl font-serif font-bold text-beige">1-on-1 Expert Review</h3>
                <p className="text-xs text-beige/75 leading-relaxed">
                  Pair with a Super 50 expert for weekly GitHub PR reviews, circuit troubleshooting, and accountability.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-midnight-green/30 border border-beige/10 space-y-3">
                <span className="text-xs font-mono font-bold text-beige block">STEP 04 // PROOF OF WORK</span>
                <h3 className="text-xl font-serif font-bold text-beige">Deploy &amp; Showcase</h3>
                <p className="text-xs text-beige/75 leading-relaxed">
                  Publish to the verified project catalog, draft patent documentation, and prepare for interviews.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. COMPARISON MATRIX: TUTORIAL HELL VS. INSPIVIA
            ======================================================== */}
        <section className="py-24 bg-forest-green relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-3">
                Clear Contrast
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-4">
                The Shift From Passive To Active Building.
              </h2>
              <p className="text-sm text-beige/75">
                Why standard video playlists leave students stranded, and how INSPIVIA solves it permanently.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm font-sans border-collapse">
                <thead>
                  <tr className="border-b border-beige/15 text-beige/60 font-mono text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Dimension</th>
                    <th className="py-4 px-6 text-rosy-brown">Generic Video Courses &amp; Syllabi</th>
                    <th className="py-4 px-6 text-moss-green bg-midnight-green/30 rounded-t-2xl">
                      The INSPIVIA Mentorship Model
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/10">
                  <tr>
                    <td className="py-5 px-6 font-bold text-beige">Starting Direction</td>
                    <td className="py-5 px-6 text-beige/70">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rosy-brown shrink-0 mt-0.5" />
                        <span>50-hour uncurated playlists with no clear start or end point.</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-beige bg-midnight-green/30">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-moss-green shrink-0 mt-0.5" />
                        <span>Curated week-by-week milestones tailored to your exact academic semester.</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-5 px-6 font-bold text-beige">Doubt Resolution</td>
                    <td className="py-5 px-6 text-beige/70">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rosy-brown shrink-0 mt-0.5" />
                        <span>Unanswered StackOverflow threads or dead comment sections.</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-beige bg-midnight-green/30">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-moss-green shrink-0 mt-0.5" />
                        <span>1-on-1 expert mentor pairing plus 24/7 instant troubleshooting with the AI Companion.</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-5 px-6 font-bold text-beige">Project Originality</td>
                    <td className="py-5 px-6 text-beige/70">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rosy-brown shrink-0 mt-0.5" />
                        <span>To-do apps and weather widgets that recruiters immediately dismiss.</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-beige bg-midnight-green/30">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-moss-green shrink-0 mt-0.5" />
                        <span>High-impact hardware nodes, vision diagnostics, and patentable architectures.</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-5 px-6 font-bold text-beige">Accountability</td>
                    <td className="py-5 px-6 text-beige/70">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rosy-brown shrink-0 mt-0.5" />
                        <span>Zero follow-up. 90%+ of students abandon projects mid-way.</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-beige bg-midnight-green/30 rounded-b-2xl">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-moss-green shrink-0 mt-0.5" />
                        <span>Mandatory weekly checkpoint deadlines in the proven Super 50 style.</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. SERVICES FAQ ACCORDION
            ======================================================== */}
        <section className="py-24 bg-[#08291c] border-t border-beige/10 relative">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-rosy-brown font-bold block mb-3">
                Frequently Asked Inquiries
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-beige mb-3">
                Everything You Need to Know.
              </h2>
              <p className="text-sm text-beige/75">
                Common questions from first- and second-year students joining the platform.
              </p>
            </div>

            <div className="space-y-4">
              <details className="group p-6 rounded-2xl bg-midnight-green/30 border border-beige/15 open:border-rosy-brown/40 transition-all">
                <summary className="font-serif font-bold text-base md:text-lg text-beige cursor-pointer flex items-center justify-between list-none">
                  <span>How does 1-on-1 mentor pairing work?</span>
                  <span className="text-rosy-brown font-mono text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-xs md:text-sm text-beige/80 leading-relaxed font-sans">
                  Once registered, you select your primary focus domain (Web, AI/ML, IoT, or VLSI). You are paired with an expert mentor from the Super 50 cohort who reviews your weekly progress, holds code reviews on GitHub, and answers questions during scheduled sessions.
                </p>
              </details>

              <details className="group p-6 rounded-2xl bg-midnight-green/30 border border-beige/15 open:border-rosy-brown/40 transition-all">
                <summary className="font-serif font-bold text-base md:text-lg text-beige cursor-pointer flex items-center justify-between list-none">
                  <span>Can 1st-year students with zero coding experience join?</span>
                  <span className="text-rosy-brown font-mono text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-xs md:text-sm text-beige/80 leading-relaxed font-sans">
                  Yes, absolutely. In fact, early mentorship onset is our core mission. Our Tier I Explorer roadmaps are designed explicitly for students taking their very first steps, avoiding academic jargon and focusing on hands-on fundamentals.
                </p>
              </details>

              <details className="group p-6 rounded-2xl bg-midnight-green/30 border border-beige/15 open:border-rosy-brown/40 transition-all">
                <summary className="font-serif font-bold text-base md:text-lg text-beige cursor-pointer flex items-center justify-between list-none">
                  <span>What makes the AI Companion different from generic ChatGPT?</span>
                  <span className="text-rosy-brown font-mono text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-xs md:text-sm text-beige/80 leading-relaxed font-sans">
                  The AI Companion is built for engineering student workflows. Instead of just answering questions in isolation, it maps your questions directly into your student dashboard milestones, generates sprint specifications, suggests patentable claim angles, and understands hardware constraints (e.g., ESP32 pinouts).
                </p>
              </details>

              <details className="group p-6 rounded-2xl bg-midnight-green/30 border border-beige/15 open:border-rosy-brown/40 transition-all">
                <summary className="font-serif font-bold text-base md:text-lg text-beige cursor-pointer flex items-center justify-between list-none">
                  <span>Do I get a certificate or portfolio verification?</span>
                  <span className="text-rosy-brown font-mono text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-xs md:text-sm text-beige/80 leading-relaxed font-sans">
                  More importantly than a paper certificate, you receive a verified, live proof-of-work link on the INSPIVIA network that demonstrates working code, expert PR reviews, and architectural documentation that you can share directly with tech recruiters.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* ========================================================
            6. FINAL CALL TO ACTION
            ======================================================== */}
        <section className="py-24 bg-forest-green border-t border-beige/10 text-center relative">
          <div className="max-w-4xl mx-auto px-6 space-y-6">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige">
              Ready to Build With <span className="italic text-rosy-brown">Real Direction</span>?
            </h2>
            <p className="text-base text-beige/80 max-w-xl mx-auto leading-relaxed">
              Sign up today to activate your personalized learning roadmap, talk to the AI Companion, and connect with your expert mentor.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-rosy-brown text-forest-green font-bold text-sm hover:bg-rosy-brown/90 shadow-xl transition-all"
              >
                Join the Platform
              </a>
              <a
                href="/dashboard/roadmap"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-beige/30 text-beige font-medium text-sm hover:border-beige transition-all"
              >
                Browse Roadmaps First
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
