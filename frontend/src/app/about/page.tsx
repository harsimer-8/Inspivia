import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CinematicAboutTimeline from "@/components/motion/CinematicAboutTimeline";
import FounderSection from "@/components/sections/FounderSection";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  Target,
  Workflow,
  Heart,
  CheckCircle2,
  Users,
  Award,
  Layers,
  Cpu,
  BrainCircuit,
  MessageSquare,
} from "lucide-react";

export const metadata = {
  title: "About INSPIVIA — Every Great Journey Begins With A Question",
  description:
    "The origin story of INSPIVIA: How a junior's question to an expert revealed the college guidance gap, sparking a national movement in student engineering mentorship.",
};

export default function AboutPage() {
  const approaches = [
    {
      number: "01",
      title: "Diagnostic Skill Mapping",
      summary: "Before opening an editor, we diagnose what you actually want to build and eliminate the fear of choosing the 'wrong' technology.",
      detail: "We evaluate your current semester, comfort level with foundational logic, and match you with one clear anchor domain (Web, AI/ML, IoT, or VLSI).",
      accent: "#D3968C",
    },
    {
      number: "02",
      title: "Curated Milestone Roadmaps",
      summary: "Syllabi are 20 years old; YouTube playlists are 50 hours long. We provide high-leverage weekly roadmaps designed by experts who shipped.",
      detail: "Each roadmap contains exact weekly deliverables, curated architectural notes, and zero tutorial fluff.",
      accent: "#839958",
    },
    {
      number: "03",
      title: "One-on-One Mentorship + AI Companion",
      summary: "A human mentor for empathy, accountability, and code reviews; an AI Companion for 24/7 instant debugging and schema architecture.",
      detail: "You are never stranded on a compiler bug at midnight or left wondering how to connect your sensors.",
      accent: "#105666",
    },
    {
      number: "04",
      title: "Proof-of-Work Accountability",
      summary: "We judge learning by working code, physical breadboard telemetry, GitHub documentation, and patent drafts.",
      detail: "In the tradition of the Super 50 cohort, 100% of scholars finish with deployable prototypes ready for recruiters.",
      accent: "#D3968C",
    },
  ];

  const coreValues = [
    {
      icon: Heart,
      title: "Psychological Safety & Zero Judgment",
      tagline: "Never feel foolish for asking the first question.",
      description:
        "Every expert was once a confused junior staring at an empty terminal. We build an environment where doubts are celebrated as the beginning of understanding, not a sign of inadequacy.",
      accentBg: "#105666",
      textColor: "#F7F4D5",
    },
    {
      icon: Target,
      title: "Action Over Endless Fluff",
      tagline: "A messy working prototype beats 100 watched tutorials.",
      description:
        "Tutorial consumption gives an illusion of competence. We prioritize writing broken code, debugging compiler errors, and deploying real systems right from semester one.",
      accentBg: "#839958",
      textColor: "#0A3323",
    },
    {
      icon: Users,
      title: "Radical Mentor-Mentee Solidarity",
      tagline: "Passing the torch is our sacred campus duty.",
      description:
        "The bridge between college batches is the soul of engineering. Every junior guided by Inspivia pledges to mentor the incoming batch once they become experts.",
      accentBg: "#0A3323",
      textColor: "#F7F4D5",
    },
    {
      icon: Award,
      title: "Enduring Technical Independence",
      tagline: "Building creators, inventors, and patent holders.",
      description:
        "We don't teach students to pass exams. We teach students how to formulate non-obvious engineering ideas, protect intellectual property, and lead technical breakthroughs.",
      accentBg: "#D3968C",
      textColor: "#0A3323",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-forest-green text-beige">
        {/* ========================================================
            1. EDITORIAL OPENING: "EVERY GREAT JOURNEY BEGINS WITH A QUESTION"
            ======================================================== */}
        <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 bg-forest-green border-b border-beige/10 overflow-hidden">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-midnight-green/25 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            {/* Overline Label */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-midnight-green/50 border border-beige/20 text-xs font-mono tracking-widest uppercase text-rosy-brown mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-rosy-brown" />
              <span>Inspivia Chronicles // Foundational Origin</span>
            </div>

            {/* The Signature Opening Line */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight leading-[1.08] text-beige mb-10 max-w-5xl">
              Every great journey begins with{" "}
              <span className="italic font-normal text-rosy-brown">
                a question.
              </span>
            </h1>

            {/* Lead Narrative Story */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6 border-t border-beige/15">
              <div className="lg:col-span-7 space-y-6 text-base md:text-lg text-beige/85 leading-relaxed font-sans">
                <p className="text-xl md:text-2xl font-serif text-beige font-medium leading-relaxed italic">
                  "It began not in a conference hall or an investor pitch, but in the quiet hostel corridors of an engineering campus when a first-year student asked her mentor a question that changed everything."
                </p>

                <p>
                  The student held a spiral notebook dense with bookmarked links, scribbled algorithm names, and half-finished tutorial checklists. She had spent three months trying to teach herself how to build software, yet felt more bewildered than on her first day of college.
                </p>

                <p>
                  Looking up at expert mentor <strong className="text-beige font-semibold">Wallabhi Saxena</strong>, she asked:
                </p>

                <div className="p-6 md:p-8 rounded-3xl bg-midnight-green/40 border border-rosy-brown/30 space-y-3">
                  <blockquote className="font-serif italic text-lg md:text-xl text-beige leading-relaxed">
                    "Everywhere I look, people tell us to 'build projects' to get internships and learn. But how do I choose between AI, Web, and IoT? How do I know which skills are genuinely required, and which file do I even create first? Why does it feel like college prepares us for tests, but leaves us completely blind about how to build?"
                  </blockquote>
                </div>

                <p>
                  That single inquiry pierced through the polite silence of higher education. Wallabhi realized this wasn't one student's private hesitation — it was the collective, unspoken crisis of an entire generation of engineering scholars.
                </p>
              </div>

              {/* Highlight Sidebar Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-8 rounded-3xl bg-midnight-green/35 border border-beige/15 space-y-6">
                  <span className="text-xs font-mono uppercase text-moss-green tracking-widest font-bold block">
                    The Guidance Gap Defined
                  </span>

                  <h3 className="text-xl md:text-2xl font-serif font-bold text-beige leading-snug">
                    Why Millions of Engineering Students Get Stuck in "Tutorial Hell"
                  </h3>

                  <ul className="space-y-4 text-xs md:text-sm text-beige/80">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono">
                        ✕
                      </div>
                      <span>
                        <strong className="text-beige">Outdated Curricula:</strong> Syllabi reward handwriting code on lined paper instead of using modern git workflows or hardware breakout boards.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono">
                        ✕
                      </div>
                      <span>
                        <strong className="text-beige">Information Overload:</strong> 40-hour video playlists provide an illusion of learning while breeding cognitive exhaustion.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono">
                        ✕
                      </div>
                      <span>
                        <strong className="text-beige">Social Hesitation:</strong> Juniors fear looking foolish or bothering experts, resulting in months of isolated wheel-spinning.
                      </span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-beige/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rosy-brown text-forest-green font-serif font-bold flex items-center justify-center text-sm">
                        WS
                      </div>
                      <div>
                        <span className="text-xs font-bold text-beige block">Wallabhi Saxena</span>
                        <span className="text-[11px] font-mono text-moss-green">Founder, Inspivia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. CINEMATIC SIDE-ENTERING FLASHCARD TIMELINE
            ======================================================== */}
        <section className="py-28 md:py-36 bg-[#072419] relative border-b border-beige/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
              <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-3">
                Chronicle Progression
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-4">
                The Four Chapters of Our Inception.
              </h2>
              <p className="text-sm md:text-base text-beige/80 leading-relaxed font-sans">
                Watch how an authentic corridor conversation transformed into the Super 50 cohort and the founding of INSPIVIA.
              </p>
            </div>

            {/* The 4 Side-Entering Alternating Timeline Cards */}
            <CinematicAboutTimeline />
          </div>
        </section>

        {/* ========================================================
            2B. MEET THE FOUNDER
            ======================================================== */}
        <FounderSection />

        {/* ========================================================
            3. DEDICATED SECTION: VISION
            ======================================================== */}
        <section className="py-28 md:py-36 bg-midnight-green text-beige relative overflow-hidden border-b border-beige/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-green/60 border border-beige/20 text-xs font-mono uppercase tracking-widest text-rosy-brown">
                  <Eye className="w-3.5 h-3.5 text-rosy-brown" />
                  <span>The Long-Term Horizon</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-beige">
                  Our <span className="italic text-rosy-brown">Vision</span>: A World Where No Student Builds Alone.
                </h2>

                <p className="text-base text-beige/85 leading-relaxed">
                  We envision a collegiate engineering culture stripped of gatekeeping, anxiety, and theoretical stagnation. Where a first-year student can walk into campus, be paired with an accomplished expert lead, and ship a real-world prototype within their first semester.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-forest-green/60 border border-beige/15 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-midnight-green border border-beige/20 flex items-center justify-center text-rosy-brown font-bold font-serif text-lg">
                    01
                  </div>
                  <h3 className="text-lg font-serif font-bold text-beige">
                    Democratizing High-Caliber Engineering
                  </h3>
                  <p className="text-xs text-beige/75 leading-relaxed">
                    Breaking the myth that patent filings, hardware prototypes, and scalable systems are reserved only for elite institutions.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-forest-green/60 border border-beige/15 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-midnight-green border border-beige/20 flex items-center justify-center text-moss-green font-bold font-serif text-lg">
                    02
                  </div>
                  <h3 className="text-lg font-serif font-bold text-beige">
                    Female Engineering Leadership
                  </h3>
                  <p className="text-xs text-beige/75 leading-relaxed">
                    Elevating women engineers from Day 1 to dominate technical domains in VLSI, AI, and distributed systems.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-forest-green/60 border border-beige/15 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-midnight-green border border-beige/20 flex items-center justify-center text-beige font-bold font-serif text-lg">
                    03
                  </div>
                  <h3 className="text-lg font-serif font-bold text-beige">
                    Mentor-Mentee Continuity
                  </h3>
                  <p className="text-xs text-beige/75 leading-relaxed">
                    Creating an unbroken chain of generational mentorship where today's learners become tomorrow's mentors.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-forest-green/60 border border-beige/15 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-midnight-green border border-beige/20 flex items-center justify-center text-rosy-brown font-bold font-serif text-lg">
                    04
                  </div>
                  <h3 className="text-lg font-serif font-bold text-beige">
                    Human + AI Synergy
                  </h3>
                  <p className="text-xs text-beige/75 leading-relaxed">
                    Using the AI Companion to handle late-night compiler debugging so human mentorship sessions focus on big-picture architecture and confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. DEDICATED SECTION: MISSION
            ======================================================== */}
        <section className="py-28 md:py-36 bg-forest-green text-beige relative border-b border-beige/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-green/50 border border-beige/20 text-xs font-mono uppercase tracking-widest text-moss-green mb-4">
                <Target className="w-3.5 h-3.5" />
                <span>Our Core Mandate</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-6">
                Our <span className="italic text-moss-green">Mission</span>: Turn Academic Paralysis into Proof of Work.
              </h2>
              <p className="text-base text-beige/80 leading-relaxed font-sans">
                We exist to replace ambiguity with structured weekly milestones, isolated frustration with empathetic expert guidance, and tutorial consumption with tangible code.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-midnight-green/30 border border-beige/15 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-rosy-brown font-bold block mb-3">
                    Mission Mandate 01
                  </span>
                  <h3 className="text-xl font-serif font-bold text-beige mb-3">
                    Eliminate Project Paralysis
                  </h3>
                  <p className="text-xs md:text-sm text-beige/80 leading-relaxed">
                    Provide tailored roadmaps that break complex technical domains into digestible weekly deliverables so students never wonder what to work on next.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-beige/10 text-xs font-mono text-moss-green font-semibold">
                  Deliverable: Step-by-Step Roadmaps
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-midnight-green/30 border border-beige/15 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-moss-green font-bold block mb-3">
                    Mission Mandate 02
                  </span>
                  <h3 className="text-xl font-serif font-bold text-beige mb-3">
                    Rebuild Campus Solidarity
                  </h3>
                  <p className="text-xs md:text-sm text-beige/80 leading-relaxed">
                    Facilitate direct one-to-one pairings between juniors and accomplished experts, creating safe spaces where asking basic questions is encouraged and respected.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-beige/10 text-xs font-mono text-moss-green font-semibold">
                  Deliverable: Weekly 1-on-1 Code Reviews
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-midnight-green/30 border border-beige/15 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-rosy-brown font-bold block mb-3">
                    Mission Mandate 03
                  </span>
                  <h3 className="text-xl font-serif font-bold text-beige mb-3">
                    Empower Intellectual Property
                  </h3>
                  <p className="text-xs md:text-sm text-beige/80 leading-relaxed">
                    Train undergraduate students to identify novel mechanisms in their projects and guide them through writing provisional patent applications and research publications.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-beige/10 text-xs font-mono text-moss-green font-semibold">
                  Deliverable: Patent & Portfolio Defense
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. DEDICATED SECTION: OUR APPROACH
            ======================================================== */}
        <section className="py-28 md:py-36 bg-[#F7F4D5] text-[#0A3323] relative border-b border-forest-green/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="max-w-3xl">
                <span className="text-xs font-mono uppercase tracking-widest text-[#839958] font-bold block mb-3">
                  Methodology & Execution
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0A3323]">
                  Our <span className="italic text-[#105666]">Approach</span> to Transforming Students into Builders.
                </h2>
              </div>
              <p className="text-xs md:text-sm font-mono text-[#0A3323]/70 max-w-xs">
                The battle-tested framework behind the 100% completion rate of the Super 50 cohort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {approaches.map((app) => (
                <div
                  key={app.number}
                  className="rounded-3xl p-8 bg-white/70 border border-[#0A3323]/10 shadow-[0_10px_30px_rgba(10,51,35,0.06)] flex flex-col justify-between hover:-translate-y-1 transition-transform"
                >
                  <div>
                    <span className="text-2xl font-serif italic font-bold text-[#105666] block mb-4">
                      {app.number}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#0A3323] mb-3">
                      {app.title}
                    </h3>
                    <p className="text-xs md:text-sm text-[#0A3323]/80 leading-relaxed mb-4">
                      {app.summary}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#0A3323]/10 text-xs text-[#0A3323]/70 font-sans italic">
                    {app.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            6. DEDICATED SECTION: CORE VALUES
            ======================================================== */}
        <section className="py-28 md:py-36 bg-[#072419] text-beige relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-3">
                Foundational Principles
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-beige mb-4">
                The Values That Anchor <span className="italic text-rosy-brown">INSPIVIA</span>.
              </h2>
              <p className="text-sm md:text-base text-beige/75 font-sans leading-relaxed">
                These principles guide every mentor session, every code review, and every architectural roadmap we publish.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coreValues.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-3xl p-8 md:p-10 border border-beige/15 shadow-xl flex flex-col justify-between"
                    style={{ backgroundColor: val.accentBg, color: val.textColor }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md"
                          style={{
                            backgroundColor: val.textColor === "#0A3323" ? "#0A3323" : "#F7F4D5",
                            color: val.textColor === "#0A3323" ? "#F7F4D5" : "#0A3323",
                          }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest opacity-70 font-semibold">
                          Principle 0{idx + 1}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-2">
                        {val.title}
                      </h3>

                      <p className="text-sm md:text-base font-medium opacity-90 italic mb-4">
                        "{val.tagline}"
                      </p>

                      <p className="text-xs md:text-sm leading-relaxed opacity-85">
                        {val.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-current/15 flex items-center gap-2 text-xs font-mono opacity-80">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Non-negotiable Inspivia standard</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            7. INVITATION & CALL TO ACTION
            ======================================================== */}
        <section className="py-24 bg-forest-green border-t border-beige/10 relative text-center">
          <div className="max-w-4xl mx-auto px-6">
            <InspiviaLogo size="md" className="justify-center mb-6" />

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-beige mb-6">
              Ready to Turn Your Questions into{" "}
              <span className="italic text-rosy-brown">Proof of Work</span>?
            </h2>

            <p className="text-base text-beige/80 max-w-2xl mx-auto leading-relaxed mb-10">
              Join the Super 50 cohort or start exploring your personalized roadmap with the AI Companion today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Register as Student</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/team"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-beige/30 text-beige font-medium text-xs uppercase tracking-wider hover:border-beige transition-all"
              >
                Meet Wallabhi Saxena & Mentors
              </a>

              <a
                href="/dashboard/roadmap"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-midnight-green/50 border border-beige/20 text-beige font-medium text-xs uppercase tracking-wider hover:border-rosy-brown hover:text-rosy-brown transition-all"
              >
                View Roadmaps
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
