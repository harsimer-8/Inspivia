import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCanvas from "@/components/canvas/HeroCanvas";
import SignatureFlashcards from "@/components/motion/SignatureFlashcards";
import InspiviaJourney from "@/components/motion/InspiviaJourney";
import HorizontalProjectSlider from "@/components/motion/HorizontalProjectSlider";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import { PLATFORM_STATS, FOUR_SERVICES, BRAND_INFO } from "@/data/inspiviaData";
import { AUTHENTIC_TESTIMONIALS } from "@/data/testimonialsData";
import {
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle2,
  Users,
  Award,
  ChevronRight,
  ShieldCheck,
  Terminal,
  Cpu,
  BrainCircuit,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const highlightTestimonials = AUTHENTIC_TESTIMONIALS.slice(0, 6);

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* ========================================================
            1. IMMERSIVE HERO SECTION
            ======================================================== */}
        <section className="relative min-h-screen pt-32 pb-24 md:pt-40 md:pb-32 flex items-center justify-center overflow-hidden bg-forest-green">
          {/* WebGL 3D Interactive Sculpture Background */}
          <HeroCanvas />

          {/* Radial Light Diffusion */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-midnight-green/30 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
            <div className="max-w-3xl">
              {/* Top Tagline Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-midnight-green/50 border border-beige/20 text-xs font-mono tracking-widest uppercase text-rosy-brown mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-rosy-brown animate-pulse" />
                <span>Next-Generation Student Engineering</span>
              </div>

              {/* Main Headline with Layered Typography */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight leading-[1.05] text-beige mb-6">
                Don't Just Learn.{" "}
                <span className="italic font-normal text-rosy-brown block">
                  Build With Direction.
                </span>
              </h1>

              {/* Mission Statement Intro */}
              <p className="text-base sm:text-lg md:text-xl text-beige/85 font-sans leading-relaxed mb-10 max-w-2xl">
                Break the paralyzing inertia of engineering school. Inspivia bridges the mentor-mentee divide through custom milestone roadmaps, dedicated 1-on-1 mentor guidance, and the AI Companion.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="/dashboard/roadmap"
                  className="px-8 py-4 rounded-full bg-rosy-brown text-forest-green font-bold text-sm hover:bg-rosy-brown/90 shadow-[0_12px_30px_rgba(211,150,140,0.35)] transition-all flex items-center justify-center gap-2.5 group"
                >
                  <span>Explore Roadmaps</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="/dashboard/ai-companion"
                  className="px-8 py-4 rounded-full bg-midnight-green/70 border border-beige/25 text-beige hover:border-rosy-brown hover:text-rosy-brown font-medium text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-rosy-brown" />
                  <span>Brainstorm with the AI Companion</span>
                </a>
              </div>

              {/* Trust Badge */}
              <div className="mt-12 flex flex-wrap items-center gap-6 text-xs font-mono text-beige/65">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-moss-green" />
                  <span>Founded by Wallabhi Saxena</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-moss-green" />
                  <span>5,000+ Students Mentored</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-rosy-brown" />
                  <span>Super 50 Mentorship Program</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. PLATFORM STATISTICS (AUTHENTIC COHORT METRICS)
            ======================================================== */}
        <section className="py-20 bg-[#08291c] border-y border-beige/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PLATFORM_STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-midnight-green/30 border border-beige/10 hover:border-rosy-brown/40 transition-all duration-300"
                >
                  <div className="text-3xl md:text-5xl font-serif font-black text-rosy-brown mb-2 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider font-mono text-beige mb-2">
                    {stat.label}
                  </div>
                  <p className="text-xs text-beige/70 leading-relaxed font-sans">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            2B. INSPIVIA JOURNEY (MILESTONE TIMELINE)
            ======================================================== */}
        <InspiviaJourney />

        {/* ========================================================
            3. SIGNATURE FLASHCARD ANIMATION SECTION
            ======================================================== */}
        <SignatureFlashcards />

        {/* ========================================================
            4. THE FOUR PILLARS / SERVICES
            ======================================================== */}
        <section id="services" className="py-28 md:py-36 bg-[#072419] relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-3">
                  Core Platform Capabilities
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige">
                  Engineered to Eliminate <span className="italic text-rosy-brown">Confusion</span>.
                </h2>
              </div>
              <a
                href="/services"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rosy-brown hover:text-beige transition-colors"
              >
                <span>View Full Service Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FOUR_SERVICES.map((service) => (
                <div
                  key={service.id}
                  className="rounded-3xl p-8 md:p-10 bg-midnight-green/35 border border-beige/15 hover:border-beige/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/30 text-rosy-brown border border-white/5 font-semibold">
                        {service.badge}
                      </span>
                      <span className="text-2xl font-serif italic text-beige/40 font-light">
                        {service.number}
                      </span>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-beige group-hover:text-rosy-brown transition-colors mb-2">
                      {service.title}
                    </h3>

                    <p className="text-xs font-mono text-moss-green mb-4">
                      {service.subtitle}
                    </p>

                    <p className="text-sm text-beige/80 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <ul className="space-y-2.5 mb-8">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-beige/75">
                          <CheckCircle2 className="w-3.5 h-3.5 text-moss-green shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`/services#${service.id}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-rosy-brown group-hover:translate-x-1 transition-transform"
                  >
                    <span>Learn How It Works</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            5. FEATURED PROJECTS (HORIZONTAL SLIDING SHOWCASE)
            ======================================================== */}
        <section id="work" className="py-28 md:py-36 bg-forest-green relative border-t border-beige/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-rosy-brown font-bold block mb-3">
                Proof Of Work
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-4">
                Real Projects Shipped by <span className="italic text-moss-green">Super 50</span> Scholars.
              </h2>
              <p className="text-sm md:text-base text-beige/80">
                Explore verified engineering projects spanning hardware IoT nodes, neural diagnostics, and high-performance Web systems.
              </p>
            </div>

            {/* Horizontal Interactive Slider Component */}
            <HorizontalProjectSlider />
          </div>
        </section>

        {/* ========================================================
            6. AI COMPANION AI MENTOR SPOTLIGHT
            ======================================================== */}
        <section className="py-24 bg-midnight-green text-beige relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-green/60 border border-beige/20 text-xs font-mono text-rosy-brown">
                  <Sparkles className="w-3.5 h-3.5 text-rosy-brown" />
                  <span>24/7 AI Project Companion</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">
                  Meet Your <span className="italic text-rosy-brown">AI Co-Pilot</span> for Architecture.
                </h2>

                <p className="text-base text-beige/85 leading-relaxed">
                  Never get stalled at midnight waiting for mentor office hours. The AI Companion analyzes your project idea, breaks it into manageable tasks, reviews your code schemas, and helps prepare patent claims.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-forest-green/40 border border-beige/10">
                    <BrainCircuit className="w-6 h-6 text-rosy-brown mb-2" />
                    <h4 className="text-sm font-bold text-beige">Idea Decomposition</h4>
                    <p className="text-xs text-beige/70 mt-1">Converts vague concepts into sprint-ready architecture.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-forest-green/40 border border-beige/10">
                    <Terminal className="w-6 h-6 text-moss-green mb-2" />
                    <h4 className="text-sm font-bold text-beige">Compiler Troubleshooting</h4>
                    <p className="text-xs text-beige/70 mt-1">Debugs Next.js and embedded C++ errors instantly.</p>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="/dashboard/ai-companion"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-rosy-brown text-forest-green font-bold text-sm hover:bg-rosy-brown/90 shadow-lg transition-all"
                  >
                    <span>Launch AI Companion Chat</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Interactive Mock Terminal Preview */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl bg-forest-green border border-beige/20 p-6 md:p-8 shadow-2xl font-mono text-xs text-beige/90 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-beige/10">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] text-beige/50">ai-companion-v2.5 // active</span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-rosy-brown">
                      <span className="text-beige/40">student@inspivia:~$</span> suggest a project for 1st-year ECE with ESP32 and MQTT
                    </p>

                    <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2 text-beige/80 text-[11px] leading-relaxed">
                      <p className="text-moss-green font-bold">[AI Synthesis]</p>
                      <p>
                        Recommend: <strong className="text-beige">"EcoPulse: Ambient Micro-Telemetry Node"</strong>
                      </p>
                      <p>
                        • Microcontroller: ESP32 dual-core with FreeRTOS task separation.<br />
                        • Telemetry: MQTT broker publishing to Next.js dashboard.<br />
                        • Patent Angle: Adaptive sleep algorithm extending battery life by 42%.
                      </p>
                    </div>

                    <p className="text-beige/50 italic text-[11px]">
                      {"// Ready to sprint. Milestone 1 initialized in student dashboard."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            7. AUTHENTIC COMMUNITY TESTIMONIALS
            ======================================================== */}
        <section id="community" className="py-28 md:py-36 bg-forest-green relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-3">
                Student Voices & Proof
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-4">
                What Our Super 50 Students Say.
              </h2>
              <p className="text-sm md:text-base text-beige/75">
                Every testimonial is genuine, documented from real engineering students guided by founder Wallabhi Saxena and expert leads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlightTestimonials.map((t) => (
                <div
                  key={t.id}
                  className="rounded-3xl p-7 bg-midnight-green/30 border border-beige/10 hover:border-rosy-brown/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rosy-brown/20 border border-rosy-brown/40 text-rosy-brown font-serif font-bold flex items-center justify-center text-sm">
                          {t.name[0]}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-beige">{t.name}</h4>
                          <p className="text-[11px] font-mono text-moss-green">
                            {t.course} ({t.year})
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-beige/85 leading-relaxed italic mb-6">
                      "{t.feedback}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-beige/10 flex flex-wrap gap-1.5">
                    {t.interests.map((int, iIdx) => (
                      <span
                        key={iIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/20 text-beige/70"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a
                href="/community"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-beige/20 text-beige text-xs font-mono uppercase tracking-wider hover:border-rosy-brown hover:text-rosy-brown transition-colors"
              >
                <span>Explore Student Testimonials & Feedback Deck</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================
            8. FINAL IMMERSIVE CALL TO ACTION
            ======================================================== */}
        <section className="py-24 bg-[#08291c] border-t border-beige/10 relative">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-beige tracking-tight mb-6">
              Stop Hesitating. <span className="italic text-rosy-brown">Start Building</span> Today.
            </h2>
            <p className="text-base md:text-lg text-beige/80 max-w-2xl mx-auto leading-relaxed mb-10">
              Whether you are in your 1st year exploring your first line of code or a 3rd year engineering a patentable system, Inspivia gives you the direction to succeed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-rosy-brown text-forest-green font-bold text-sm hover:bg-rosy-brown/90 shadow-xl transition-all"
              >
                Join Inspivia Platform
              </a>
              <a
                href="/dashboard/roadmap"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-beige/30 text-beige font-medium text-sm hover:border-beige transition-all"
              >
                Browse Roadmaps
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
