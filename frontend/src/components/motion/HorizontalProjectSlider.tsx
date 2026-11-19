"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FEATURED_PROJECTS, ProjectShowcase } from "@/data/inspiviaData";
import { ChevronLeft, ChevronRight, ExternalLink, Github, Sparkles, X, Layers, Cpu, Globe, Database } from "lucide-react";

export default function HorizontalProjectSlider() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalProject, setActiveModalProject] = useState<ProjectShowcase | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "AI/ML", "IoT & Embedded", "Full-Stack Web", "VLSI & Hardware", "Data Systems"];

  const filteredProjects = selectedCategory === "All"
    ? FEATURED_PROJECTS
    : FEATURED_PROJECTS.filter((p) => p.category === selectedCategory);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const offset = direction === "left" ? -420 : 420;
      sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Category Filter Pills & Slider Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                selectedCategory === cat
                  ? "bg-rosy-brown text-forest-green font-semibold shadow-md"
                  : "bg-midnight-green/40 text-beige/70 hover:text-beige hover:bg-midnight-green/60 border border-beige/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-10 h-10 rounded-full border border-beige/20 bg-midnight-green/40 hover:bg-rosy-brown hover:text-forest-green text-beige flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-10 h-10 rounded-full border border-beige/20 bg-midnight-green/40 hover:bg-rosy-brown hover:text-forest-green text-beige flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Sliding Scroll Track */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setActiveModalProject(project)}
            className="shrink-0 w-[320px] sm:w-[380px] md:w-[440px] snap-start rounded-3xl p-7 md:p-8 border border-beige/15 hover:border-rosy-brown/60 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            style={{
              backgroundColor: project.paletteBg === "#0A3323" ? "rgba(10, 51, 35, 0.85)" : "rgba(16, 86, 102, 0.75)",
            }}
          >
            <div>
              {/* Card Header Meta */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono tracking-wider font-semibold uppercase"
                  style={{ backgroundColor: `${project.paletteAccent}25`, color: project.paletteAccent }}
                >
                  {project.category}
                </span>
                <span className="text-xs font-mono text-beige/50">{project.year}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-serif font-bold text-beige group-hover:text-rosy-brown transition-colors mb-3">
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
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-black/25 text-beige/80 border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-beige/10">
                <div className="text-xs">
                  <span className="text-beige/50 block">By:</span>
                  <span className="text-beige font-medium">{project.studentTeam}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-rosy-brown group-hover:translate-x-1 transition-transform">
                  <span>Inspect Architecture</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-green/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl rounded-3xl p-8 md:p-10 bg-midnight-green border border-rosy-brown/40 shadow-2xl text-beige max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-forest-green/60 text-beige/70 hover:text-beige hover:bg-forest-green flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase font-semibold bg-rosy-brown/20 text-rosy-brown">
                  {activeModalProject.category}
                </span>
                <span className="text-xs font-mono text-beige/60">
                  Batch of {activeModalProject.year}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-serif font-bold text-beige mb-3">
                {activeModalProject.title}
              </h3>

              <div className="p-4 rounded-xl bg-forest-green/50 border border-beige/10 mb-6">
                <span className="text-xs font-mono text-beige/50 block uppercase">Student Team & Domain:</span>
                <p className="text-sm font-semibold text-rosy-brown">{activeModalProject.studentTeam}</p>
                <p className="text-xs text-beige/80">{activeModalProject.domain}</p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-sm font-mono uppercase tracking-wider text-moss-green font-bold">
                  System Architecture & Impact
                </h4>
                <p className="text-sm md:text-base text-beige/90 leading-relaxed">
                  {activeModalProject.summary}
                </p>

                <div className="p-4 rounded-xl bg-black/20 border border-moss-green/30">
                  <span className="text-xs font-mono uppercase text-moss-green font-semibold">
                    Verified Cohort Metric:
                  </span>
                  <p className="text-base font-bold text-beige mt-1">
                    {activeModalProject.metrics}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-mono uppercase tracking-wider text-beige/60 font-bold mb-3">
                  Technologies Employed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-forest-green/80 text-beige border border-beige/15"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-beige/10">
                <a
                  href="/dashboard/ai-companion"
                  className="px-5 py-2.5 rounded-full bg-forest-green/60 text-beige text-xs hover:bg-forest-green border border-beige/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rosy-brown" />
                  <span>Build Similar with the AI Companion</span>
                </a>
                {activeModalProject.githubUrl && (
                  <a
                    href={activeModalProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-rosy-brown text-forest-green font-semibold text-xs hover:bg-rosy-brown/90 transition-all flex items-center gap-2"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
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
