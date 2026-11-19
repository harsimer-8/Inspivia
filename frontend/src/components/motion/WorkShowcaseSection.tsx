"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Art from "@/components/ui/Art";
import { WORK_PROJECTS, WORK_CAMPAIGNS, COMMUNITY_PORTFOLIOS, ProjectItem, CampaignItem } from "@/data/workData";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Sparkles,
  X,
  Layers,
  Cpu,
  Globe,
  Database,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Camera,
  FolderGit2,
  FileCode2,
  Award,
} from "lucide-react";

export default function WorkShowcaseSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [activeTab, setActiveTab] = useState<"projects" | "campaigns" | "community">("projects");
  const sliderRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "AI/ML", "IoT & Embedded", "Full-Stack Web", "VLSI & Hardware", "Data Systems"];

  const filteredProjects =
    selectedCategory === "All"
      ? WORK_PROJECTS
      : WORK_PROJECTS.filter((p) => p.category === selectedCategory);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const offset = direction === "left" ? -440 : 440;
      sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-20 md:space-y-28">
      {/* ========================================================
          NAVIGATION TABS (Projects, Campaigns, Community)
          ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-beige/15 pb-6">
        <div className="inline-flex p-1.5 rounded-2xl bg-midnight-green/40 border border-beige/15">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "projects"
                ? "bg-rosy-brown text-forest-green font-bold shadow-md"
                : "text-beige/70 hover:text-beige hover:bg-beige/5"
            }`}
          >
            Delivered Projects ({WORK_PROJECTS.length})
          </button>
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "campaigns"
                ? "bg-rosy-brown text-forest-green font-bold shadow-md"
                : "text-beige/70 hover:text-beige hover:bg-beige/5"
            }`}
          >
            Campaigns &amp; Labs ({WORK_CAMPAIGNS.length})
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "community"
                ? "bg-rosy-brown text-forest-green font-bold shadow-md"
                : "text-beige/70 hover:text-beige hover:bg-beige/5"
            }`}
          >
            Student Portfolios ({COMMUNITY_PORTFOLIOS.length})
          </button>
        </div>

        <span className="text-xs font-mono text-beige/50">
          Showing verified proof of work from our Super 50 scholars
        </span>
      </div>

      {/* ========================================================
          TAB 1: PROJECTS (Large Image-Led Horizontal Slider)
          ======================================================== */}
      {activeTab === "projects" && (
        <section className="space-y-8">
          {/* Category Filter Pills & Left/Right Arrows */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all ${
                    selectedCategory === cat
                      ? "bg-beige text-forest-green font-bold shadow-lg"
                      : "bg-midnight-green/40 text-beige/70 hover:text-beige hover:bg-midnight-green/60 border border-beige/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <span className="text-xs font-mono text-beige/50 mr-2">
                Slide to explore ({filteredProjects.length})
              </span>
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="w-11 h-11 rounded-full border border-beige/20 bg-midnight-green/50 hover:bg-rosy-brown hover:text-forest-green text-beige flex items-center justify-center transition-all shadow-md active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="w-11 h-11 rounded-full border border-beige/20 bg-midnight-green/50 hover:bg-rosy-brown hover:text-forest-green text-beige flex items-center justify-center transition-all shadow-md active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Smooth Horizontal Track */}
          {filteredProjects.length === 0 ? (
            /* Beautiful Empty State */
            <div className="p-16 rounded-3xl bg-midnight-green/30 border border-beige/15 text-center space-y-4">
              <FolderGit2 className="w-12 h-12 text-rosy-brown/60 mx-auto" />
              <h3 className="text-xl font-serif font-bold text-beige">
                No Projects Listed in this Category Yet
              </h3>
              <p className="text-sm text-beige/70 max-w-md mx-auto">
                Our upcoming Super 50 cohort is actively building in this discipline. Check back soon or filter by "All".
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="px-6 py-2.5 rounded-full bg-rosy-brown text-forest-green font-mono text-xs font-bold uppercase tracking-wider"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div
              ref={sliderRef}
              className="flex gap-7 overflow-x-auto pb-10 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setActiveModalProject(project)}
                  className="shrink-0 w-[330px] sm:w-[400px] md:w-[460px] snap-start rounded-3xl border border-beige/20 hover:border-rosy-brown/70 transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                  style={{
                    backgroundColor:
                      project.paletteBg === "#0A3323" ? "rgba(10, 51, 35, 0.9)" : "rgba(16, 86, 102, 0.85)",
                  }}
                >
                  {/* Large Image / Procedural Artwork Frame */}
                  <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-forest-green/60 border-b border-beige/15">
                    <Art
                      variant={project.artVariant}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Fade Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {/* Category & Status Pill Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold uppercase backdrop-blur-md shadow-md"
                        style={{
                          backgroundColor: `${project.paletteAccent}35`,
                          color: project.paletteAccent,
                          border: `1px solid ${project.paletteAccent}50`,
                        }}
                      >
                        {project.category}
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-forest-green/80 text-beige border border-beige/20 backdrop-blur-md">
                        {project.status}
                      </span>
                    </div>

                    {/* Hover Inspect Reveal Overlay */}
                    <div className="absolute inset-0 bg-forest-green/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-rosy-brown font-mono text-xs uppercase tracking-wider font-bold backdrop-blur-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>Inspect Full Architecture</span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-7 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-beige/50 mb-2">
                        <span>Cohort of {project.year}</span>
                        {project.patentNumber && (
                          <span className="text-rosy-brown font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Patent Filed</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-serif font-bold text-beige group-hover:text-rosy-brown transition-colors mb-2">
                        {project.title}
                      </h3>

                      <p className="text-xs font-mono text-moss-green mb-4">
                        Domain: {project.domain}
                      </p>

                      <p className="text-sm text-beige/80 line-clamp-3 leading-relaxed mb-6">
                        {project.summary}
                      </p>
                    </div>

                    <div>
                      {/* Metric Banner */}
                      <div className="p-3 rounded-xl bg-black/25 border border-white/5 mb-5 font-mono text-xs text-beige/90 flex items-center gap-2">
                        <Award className="w-4 h-4 text-moss-green shrink-0" />
                        <span className="truncate">{project.metrics}</span>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-black/30 text-beige/85 border border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Footer: Student Authors + Details Arrow */}
                      <div className="flex items-center justify-between pt-4 border-t border-beige/10">
                        <div className="text-xs">
                          <span className="text-beige/50 block">By:</span>
                          <span className="text-beige font-medium">{project.studentTeam}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-rosy-brown group-hover:translate-x-1.5 transition-transform">
                          <span>Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ========================================================
          TAB 2: CAMPAIGNS & COMMUNITY INITIATIVES (Staggered Grid)
          ======================================================== */}
      {activeTab === "campaigns" && (
        <section className="space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-2">
              Action &amp; Outreach
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-beige">
              Campus Initiatives &amp; Accelerator Campaigns
            </h2>
            <p className="text-sm text-beige/75 mt-2">
              Hands-on physical workshops, laboratory sandboxes, and IP drafting clinics conducted across student chapters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WORK_CAMPAIGNS.map((camp, idx) => (
              <div
                key={camp.id}
                className="rounded-3xl bg-midnight-green/35 border border-beige/15 p-8 flex flex-col justify-between hover:border-rosy-brown/40 transition-all shadow-xl group"
              >
                <div>
                  {/* Photo Slot with Elegant Empty State */}
                  <div className="relative h-44 rounded-2xl bg-forest-green/80 border border-beige/10 mb-6 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
                    {camp.hasPhotoSupplied && camp.image ? (
                      <Image
                        src={camp.image}
                        alt={camp.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-full bg-midnight-green border border-beige/20 flex items-center justify-center text-rosy-brown">
                          <Camera className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-serif font-bold text-beige block">
                          Documented Campus Initiative
                        </span>
                      </div>
                    )}

                    <span
                      className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold shadow"
                      style={{
                        backgroundColor: camp.accentColor,
                        color: "#0A3323",
                      }}
                    >
                      {camp.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-beige/50 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-moss-green" />
                    <span>{camp.date}</span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-beige group-hover:text-rosy-brown transition-colors mb-3">
                    {camp.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-rosy-brown mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{camp.location}</span>
                  </div>

                  <p className="text-xs md:text-sm text-beige/80 leading-relaxed mb-6 font-sans">
                    {camp.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-beige/10 space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-beige/60 block font-semibold">
                    Key Impact Metrics:
                  </span>
                  <ul className="space-y-1.5 text-xs text-beige/85">
                    {camp.impactMetrics.map((met, mIdx) => (
                      <li key={mIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-moss-green shrink-0" />
                        <span>{met}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          TAB 3: COMMUNITY PORTFOLIO NETWORK
          ======================================================== */}
      {activeTab === "community" && (
        <section className="space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-2">
              NextYou Showcase
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-beige">
              Student Engineering Portfolios
            </h2>
            <p className="text-sm text-beige/75 mt-2">
              Verified live portfolios of female engineering scholars deployed through the NextYou framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITY_PORTFOLIOS.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl p-7 bg-midnight-green/30 border border-beige/15 hover:border-rosy-brown/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-green border border-beige/20 text-rosy-brown font-serif font-bold flex items-center justify-center text-sm">
                        {item.studentName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-beige">{item.studentName}</h4>
                        <p className="text-[11px] font-mono text-moss-green">
                          {item.branch} ({item.yearOfStudy})
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-serif italic text-beige/90 mb-3">
                    "{item.headline}"
                  </p>

                  <div className="p-3 rounded-xl bg-black/25 border border-white/5 text-xs text-beige/80 mb-5">
                    <span className="text-[10px] font-mono text-rosy-brown uppercase block mb-0.5">
                      Flagship Delivered Project:
                    </span>
                    <span className="font-semibold text-beige">{item.deployedProject}</span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {item.tags.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 text-beige/70 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-beige/10 flex items-center justify-between">
                    <a
                      href={item.githubUrl || "https://github.com"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-beige/70 hover:text-beige"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>

                    <a
                      href={item.portfolioUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-rosy-brown hover:text-beige font-semibold"
                    >
                      <span>Live Portfolio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          PROJECT DETAIL MODAL (INSPECT ARCHITECTURE)
          ======================================================== */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl p-8 md:p-10 bg-midnight-green border border-rosy-brown/40 shadow-2xl text-beige max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-forest-green/60 text-beige/70 hover:text-beige hover:bg-forest-green flex items-center justify-center transition-colors border border-beige/15"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase font-semibold bg-rosy-brown/20 text-rosy-brown border border-rosy-brown/30">
                  {activeModalProject.category}
                </span>
                <span className="text-xs font-mono text-beige/60">
                  Batch of {activeModalProject.year}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-forest-green text-moss-green border border-moss-green/30">
                  {activeModalProject.status}
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-serif font-bold text-beige mb-3">
                {activeModalProject.title}
              </h3>

              <div className="p-4 rounded-xl bg-forest-green/60 border border-beige/10 mb-6 space-y-1">
                <span className="text-xs font-mono text-beige/50 block uppercase">
                  Student Team &amp; Technical Discipline:
                </span>
                <p className="text-sm font-semibold text-rosy-brown">
                  {activeModalProject.studentTeam}
                </p>
                <p className="text-xs font-mono text-beige/80">
                  {activeModalProject.domain}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-xs font-mono uppercase tracking-wider text-moss-green font-bold">
                  System Architecture &amp; Solution
                </h4>
                <p className="text-sm md:text-base text-beige/90 leading-relaxed font-sans">
                  {activeModalProject.summary}
                </p>

                <div className="p-4 rounded-xl bg-black/25 border border-moss-green/30">
                  <span className="text-xs font-mono uppercase text-moss-green font-semibold block mb-1">
                    Verified Cohort Metric:
                  </span>
                  <p className="text-base font-bold text-beige font-serif">
                    {activeModalProject.metrics}
                  </p>
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-8">
                <h4 className="text-xs font-mono uppercase tracking-wider text-beige/60 font-bold mb-3">
                  Technologies Employed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-forest-green text-beige border border-beige/15"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-beige/10">
                <a
                  href="/dashboard/ai-companion"
                  className="px-5 py-2.5 rounded-full bg-forest-green text-beige text-xs hover:border-rosy-brown border border-beige/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rosy-brown" />
                  <span>Build Similar with the AI Companion</span>
                </a>
                {activeModalProject.githubUrl && (
                  <a
                    href={activeModalProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs hover:bg-rosy-brown/90 transition-all flex items-center gap-2"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>
                )}
                {activeModalProject.demoUrl && (
                  <a
                    href={activeModalProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full border border-beige/30 text-beige text-xs hover:border-beige transition-all flex items-center gap-1.5"
                  >
                    <span>Launch Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
