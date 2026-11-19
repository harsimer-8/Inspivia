"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DOMAIN_ROADMAPS, DomainRoadmap } from "@/data/roadmapData";
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Globe,
  BrainCircuit,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  BookOpen,
} from "lucide-react";

export default function RoadmapPage() {
  const [selectedRoadmap, setSelectedRoadmap] = useState<DomainRoadmap>(DOMAIN_ROADMAPS[0]);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>(["m-web-1", "m-web-2"]);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1, 2]);

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const togglePhase = (phaseNumber: number) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseNumber)
        ? prev.filter((p) => p !== phaseNumber)
        : [...prev, phaseNumber]
    );
  };

  const totalMilestonesInTrack = selectedRoadmap.phases.reduce(
    (acc, phase) => acc + phase.milestones.length,
    0
  );

  const completedInTrack = selectedRoadmap.phases.reduce((acc, phase) => {
    return (
      acc +
      phase.milestones.filter((m) => completedMilestones.includes(m.id)).length
    );
  }, 0);

  const percentage = Math.round((completedInTrack / (totalMilestonesInTrack || 1)) * 100);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-beige/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-green/50 border border-beige/15 text-[11px] font-mono text-moss-green mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Milestone-Driven Engineering Curriculum</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-beige">
            Personalized Learning Roadmaps
          </h1>
          <p className="text-xs md:text-sm text-beige/80 mt-1 max-w-xl font-sans">
            Step-by-step skill progressions built by experts. Toggle milestone deliverables as you code, test, and deploy.
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="p-5 rounded-2xl bg-midnight-green/40 border border-beige/15 w-full md:w-72 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-beige/70">Current Track Progress</span>
            <span className="font-bold text-rosy-brown font-serif text-sm">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-forest-green overflow-hidden">
            <div
              className="h-full bg-rosy-brown rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-beige/50 block mt-2 text-right">
            {completedInTrack} of {totalMilestonesInTrack} deliverables verified
          </span>
        </div>
      </div>

      {/* Track Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DOMAIN_ROADMAPS.map((roadmap) => {
          const isSelected = selectedRoadmap.id === roadmap.id;
          return (
            <button
              key={roadmap.id}
              onClick={() => setSelectedRoadmap(roadmap)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-midnight-green border-rosy-brown shadow-lg ring-1 ring-rosy-brown/40"
                  : "bg-forest-green/60 border-beige/10 hover:border-beige/30"
              }`}
            >
              <span
                className="text-[10px] font-mono uppercase font-bold block mb-1"
                style={{ color: roadmap.accentColor }}
              >
                {roadmap.badge}
              </span>
              <h3 className="text-xs md:text-sm font-serif font-bold text-beige truncate">
                {roadmap.title}
              </h3>
              <span className="text-[10px] font-mono text-beige/50 block mt-1">
                {roadmap.totalWeeks} Weeks // {roadmap.targetYear}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Track Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-midnight-green/30 border border-beige/15 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-moss-green font-bold block mb-1">
              Active Focus Track
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-beige">
              {selectedRoadmap.title}
            </h2>
          </div>

          <Link
            href="/dashboard/ai-companion"
            className="self-start md:self-auto px-5 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-md flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask the AI Companion to Review Track</span>
          </Link>
        </div>

        <p className="text-xs md:text-sm text-beige/80 max-w-3xl leading-relaxed font-sans">
          {selectedRoadmap.description}
        </p>
      </div>

      {/* Phased Milestones Accordion */}
      <div className="space-y-6">
        {selectedRoadmap.phases.map((phase) => {
          const isExpanded = expandedPhases.includes(phase.phaseNumber);

          return (
            <div
              key={phase.phaseNumber}
              className="rounded-3xl bg-forest-green/70 border border-beige/15 overflow-hidden shadow-lg transition-all"
            >
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase.phaseNumber)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-beige/5 transition-colors border-b border-beige/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-midnight-green border border-beige/20 text-rosy-brown font-mono font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                    P{phase.phaseNumber}
                  </div>
                  <div>
                    <h3 className="text-base md:text-xl font-serif font-bold text-beige">
                      {phase.phaseTitle}
                    </h3>
                    <p className="text-xs font-mono text-moss-green mt-0.5">
                      {phase.duration} — {phase.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-beige/50 hidden sm:block">
                    {phase.milestones.length} Tasks
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-beige/60" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-beige/60" />
                  )}
                </div>
              </button>

              {/* Milestones List */}
              {isExpanded && (
                <div className="p-6 md:p-8 space-y-6 bg-black/10">
                  {phase.milestones.map((milestone) => {
                    const isCompleted = completedMilestones.includes(milestone.id);

                    return (
                      <div
                        key={milestone.id}
                        className={`p-6 rounded-2xl border transition-all ${
                          isCompleted
                            ? "bg-forest-green/90 border-moss-green/40 opacity-90 shadow"
                            : "bg-midnight-green/40 border-beige/15 hover:border-beige/35 shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => toggleMilestone(milestone.id)}
                              className="mt-0.5 shrink-0 text-rosy-brown hover:scale-110 transition-transform"
                              aria-label={`Mark ${milestone.title} as ${isCompleted ? "incomplete" : "complete"}`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-moss-green" />
                              ) : (
                                <Circle className="w-6 h-6 text-beige/40 hover:text-rosy-brown" />
                              )}
                            </button>

                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <h4
                                  className={`text-base font-bold ${
                                    isCompleted ? "text-beige line-through opacity-75" : "text-beige"
                                  }`}
                                >
                                  {milestone.title}
                                </h4>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 text-beige/60 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-beige/40" />
                                  <span>{milestone.estimatedHours}h Estimated</span>
                                </span>
                              </div>

                              <p className="text-xs md:text-sm text-beige/80 leading-relaxed max-w-2xl font-sans">
                                {milestone.description}
                              </p>

                              {/* Expert Mentor Tip Box */}
                              <div className="p-3.5 rounded-xl bg-forest-green/80 border border-rosy-brown/30 text-xs space-y-1">
                                <span className="text-[10px] font-mono uppercase text-rosy-brown font-bold flex items-center gap-1.5">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>Expert Engineering Tip (Super 50):</span>
                                </span>
                                <p className="italic text-beige/85 font-serif">
                                  "{milestone.expertTip}"
                                </p>
                              </div>

                              {/* Verified Deliverable */}
                              <div className="pt-1 text-xs font-mono text-moss-green flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                  <Award className="w-3.5 h-3.5" />
                                  <span className="text-beige/50">Verified Deliverable: </span>
                                  <span className="text-beige font-semibold">{milestone.deliverable}</span>
                                </div>

                                {milestone.resourceLink && (
                                  <a
                                    href={milestone.resourceLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-mono text-rosy-brown hover:text-beige underline underline-offset-2 transition-colors"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    <span>{milestone.resourceTitle || "Reference Learning Docs"}</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <Link
                            href="/dashboard/ai-companion"
                            className="shrink-0 px-3 py-1.5 rounded-xl bg-forest-green hover:bg-rosy-brown hover:text-forest-green border border-beige/15 text-beige/80 text-xs font-mono hidden sm:flex items-center gap-1.5 transition-all shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-rosy-brown" />
                            <span>Ask the AI Companion</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
