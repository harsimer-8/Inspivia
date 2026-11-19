"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderGit2,
  Sparkles,
  Layers,
  Cpu,
  BrainCircuit,
  Filter,
  CheckCircle2,
  ExternalLink,
  Github,
  ArrowRight,
  Award,
  Clock,
  BookOpen,
  Search,
  X,
  ChevronRight,
  AlertCircle,
  Code,
  ShieldCheck,
  Terminal,
} from "lucide-react";

export type SkillLevel = "Explorer (1st Year)" | "Builder (2nd Year)" | "Innovator (3rd/4th Year)";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface CuratedProject {
  id: string;
  title: string;
  domain: string;
  skillLevel: SkillLevel;
  difficulty: Difficulty;
  estimatedDuration: string;
  problemStatement: string;
  prerequisites: string[];
  requiredSkills: string[];
  expectedOutcome: string;
  novelty: string;
  techStack: string[];
  starterRepo: string;
  weeklyMilestones: {
    week: string;
    focus: string;
    deliverable: string;
  }[];
  expertEvaluation: string;
  demoDataLabel: string;
}

const PROJECTS_DATA: CuratedProject[] = [
  {
    id: "proj-ecopulse",
    title: "EcoPulse: Ambient Micro-Telemetry Node",
    domain: "IoT & Hardware Telemetry",
    skillLevel: "Explorer (1st Year)",
    difficulty: "Beginner",
    estimatedDuration: "4 Weeks",
    problemStatement:
      "Colleges and urban centers lack affordable, localized air quality telemetry. Commercial industrial monitors cost thousands of dollars, preventing distributed node deployment across campus micro-climates.",
    prerequisites: [
      "Basic C/C++ syntax understanding",
      "Familiarity with breadboards & basic multimeter operation",
      "Git & GitHub fundamentals",
    ],
    requiredSkills: [
      "Embedded C++ on ESP32",
      "I2C / SPI Sensor Interfacing",
      "FreeRTOS Task Queues",
      "MQTT Protocol Basics",
    ],
    expectedOutcome:
      "A solar-assisted standalone hardware node logging PM2.5, temperature, and humidity, transmitting updates every 60s via MQTT to a Next.js edge dashboard with sub-50ms render latency.",
    novelty: "Dynamic polling interval algorithm that drops idle current consumption by 42%.",
    techStack: ["ESP32", "C++", "FreeRTOS", "MQTT", "Next.js", "Tailwind CSS"],
    starterRepo: "https://github.com/inspivia/starter-ecopulse",
    weeklyMilestones: [
      { week: "Week 1", focus: "Sensor Rig & ADC Calibration", deliverable: "Breadboard sensor circuit with serial calibration logs" },
      { week: "Week 2", focus: "FreeRTOS Task Isolation", deliverable: "Dual-task firmware polling sensors without blocking watchdog" },
      { week: "Week 3", focus: "MQTT Cloud Pipeline", deliverable: "Authenticated JSON payload publishing to HiveMQ broker" },
      { week: "Week 4", focus: "Edge Dashboard & Enclosure", deliverable: "Next.js real-time telemetry charts & 3D printed case assembly" },
    ],
    expertEvaluation:
      "Evaluated on sensor stability, power consumption during sleep cycle (<15uA), and telemetry packet drop rate under weak campus WiFi.",
    demoDataLabel: "Verified INSPIVIA Hardware Track Spec",
  },
  {
    id: "proj-portfolio-hub",
    title: "NextYou: Personal Engineering Portfolio Hub",
    domain: "Full-Stack Web Systems",
    skillLevel: "Explorer (1st Year)",
    difficulty: "Beginner",
    estimatedDuration: "3 Weeks",
    problemStatement:
      "First-year engineering students frequently struggle with presenting technical schematics, GitHub repositories, and research papers on generic resume templates, leading to low recruiter engagement.",
    prerequisites: [
      "HTML5 semantic markup and CSS basics",
      "Basic JavaScript ES6+ (arrow functions, promises, async/await)",
    ],
    requiredSkills: [
      "Strict TypeScript Props Typing",
      "Tailwind CSS Responsive Utilities",
      "React Server Components (Next.js App Router)",
      "Framer Motion Micro-Interactions",
    ],
    expectedOutcome:
      "A high-speed, SEO-optimized personal portfolio with an interactive GitHub commit activity feed, embedded hardware circuit viewers, and a 100/100 Google Lighthouse score.",
    novelty: "Automated PDF resume parser generating dynamic portfolio sections without manual re-typing.",
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    starterRepo: "https://github.com/inspivia/starter-portfolio",
    weeklyMilestones: [
      { week: "Week 1", focus: "Design System & Theme Tokens", deliverable: "Mobile-responsive hero and bio sections using custom CSS tokens" },
      { week: "Week 2", focus: "Dynamic GitHub API Integration", deliverable: "Automated pinned repos and commit activity graph fetching" },
      { week: "Week 3", focus: "Lighthouse Optimization & Deploy", deliverable: "Vercel production deployment with LCP < 1.0s and full a11y audit" },
    ],
    expertEvaluation:
      "Must pass strict accessibility contrast checks, responsive layout testing from 320px to 4K displays, and strict TypeScript compilation with zero `any` types.",
    demoDataLabel: "Verified INSPIVIA Software Track Spec",
  },
  {
    id: "proj-neurovision",
    title: "NeuroVision: Non-Invasive Medical Prognosis",
    domain: "Computer Vision & AI/ML",
    skillLevel: "Builder (2nd Year)",
    difficulty: "Intermediate",
    estimatedDuration: "6 Weeks",
    problemStatement:
      "Deep learning medical classification models act as unexplainable black boxes. Radiologists require interpretability before trusting machine-assisted pulmonary or neuro-imaging diagnostic recommendations.",
    prerequisites: [
      "Python 3.10+ object-oriented programming",
      "Linear algebra fundamentals (matrices, vector spaces, dot products)",
      "Basic understanding of convolutional operations",
    ],
    requiredSkills: [
      "PyTorch Tensor Mechanics & Loss Optimizers",
      "Transfer Learning with ResNet-50 / EfficientNet",
      "Grad-CAM Heatmap Computation",
      "FastAPI Async Prediction Endpoint",
    ],
    expectedOutcome:
      "A fine-tuned convolutional neural network reaching >94% validation accuracy on public MRI/X-ray datasets, accompanied by Grad-CAM visual attention overlays explaining lesion highlights to doctors.",
    novelty: "Layer-wise activation gradient overlay preserving fine spatial edge features for small lesion recognition.",
    techStack: ["Python", "PyTorch", "FastAPI", "Docker", "OpenCV", "Next.js"],
    starterRepo: "https://github.com/inspivia/starter-neurovision",
    weeklyMilestones: [
      { week: "Weeks 1-2", focus: "Data Pipeline & Augmentation", deliverable: "Torchvision dataset loader with normalization & affine augmentations" },
      { week: "Weeks 3-4", focus: "Transfer Learning & Optimization", deliverable: "Trained PyTorch model weights with ROC-AUC curves & confusion matrix" },
      { week: "Week 5", focus: "Grad-CAM Implementation", deliverable: "Visual heatmaps overlaid onto test scans with adjustable opacity slider" },
      { week: "Week 6", focus: "Dockerized FastAPI Inference", deliverable: "Containerized microservice returning inference + heatmap in <250ms" },
    ],
    expertEvaluation:
      "Evaluated on model generalization across unseen test distributions, false-negative rate minimization, and clear clinical report generation.",
    demoDataLabel: "Verified INSPIVIA AI Track Spec",
  },
  {
    id: "proj-aurawave",
    title: "AuraWave: Low-Power FIR Filter Synthesizer",
    domain: "VLSI & Digital Signal Processing",
    skillLevel: "Builder (2nd Year)",
    difficulty: "Intermediate",
    estimatedDuration: "5 Weeks",
    problemStatement:
      "High-sampling-rate audio and biomedical DSP circuits in wearable hearing aids suffer excessive battery drain due to unoptimized multiplier logic in conventional Finite Impulse Response (FIR) digital filters.",
    prerequisites: [
      "Digital logic design (flip-flops, gates, Karnaugh maps)",
      "Basic discrete-time signal processing (Z-transforms, convolution)",
    ],
    requiredSkills: [
      "Verilog HDL (RTL Synthesis)",
      "ModelSim Simulation & Testbench Authoring",
      "Xilinx Vivado Static Timing Analysis",
      "Clock Gating Power Reduction",
    ],
    expectedOutcome:
      "A synthesizable 32-tap pipelined FIR digital filter written in Verilog HDL, verified with a self-checking testbench against MATLAB floating-point ground truth, with gate-level power benchmarking.",
    novelty: "Novel clock-gated Booth multiplier architecture cutting dynamic switching activity by 33%.",
    techStack: ["Verilog HDL", "ModelSim", "Xilinx Vivado", "Python / NumPy"],
    starterRepo: "https://github.com/inspivia/starter-aurawave",
    weeklyMilestones: [
      { week: "Week 1", focus: "Filter Coefficients & Python Sim", deliverable: "Fixed-point coefficient quantization and impulse response baseline" },
      { week: "Weeks 2-3", focus: "Pipelined RTL Implementation", deliverable: "Synthesizable Verilog modules for 32-tap multiply-accumulate chain" },
      { week: "Week 4", focus: "Testbench & Waveform Verification", deliverable: "Automated testbench verifying zero coefficient drift over 10k clock cycles" },
      { week: "Week 5", focus: "Timing Closure & Power Report", deliverable: "Vivado power consumption report and maximum operating clock frequency analysis" },
    ],
    expertEvaluation:
      "Zero setup/hold timing violations at 100MHz target clock, synthesizable on Xilinx Artix-7 FPGA without inferring latches.",
    demoDataLabel: "Verified INSPIVIA Hardware Track Spec",
  },
  {
    id: "proj-apexpulse",
    title: "ApexPulse: Predictive Demand & Timeseries Analytics",
    domain: "Data Systems & Machine Learning",
    skillLevel: "Innovator (3rd/4th Year)",
    difficulty: "Advanced",
    estimatedDuration: "8 Weeks",
    problemStatement:
      "E-commerce logistics and decentralized supply chains frequently incur severe inventory holding costs due to lagging indicator analysis and failure to capture seasonal demand spikes in real time.",
    prerequisites: [
      "Advanced SQL (window functions, indexing, partitioning)",
      "Probability, statistics, and time-series concepts",
      "Python data science stack (Pandas, Scikit-learn)",
    ],
    requiredSkills: [
      "ARIMA / Prophet / Temporal Fusion Transformers",
      "PostgreSQL Time-Series Partitioning",
      "Real-Time Kafka / Redis Event Streaming",
      "Automated Model Drift Monitoring",
    ],
    expectedOutcome:
      "An automated end-to-end data pipeline reading streaming inventory records, predicting 14-day stock demand curves with 91%+ accuracy, and triggering proactive restock webhooks.",
    novelty: "Multi-horizon quantile forecasting with automated statistical model retraining upon concept drift detection.",
    techStack: ["Python", "Pandas", "PostgreSQL", "Next.js", "Docker", "Scikit-Learn"],
    starterRepo: "https://github.com/inspivia/starter-apexpulse",
    weeklyMilestones: [
      { week: "Weeks 1-2", focus: "Data Lake Ingestion & Schema", deliverable: "Partitioned PostgreSQL schema with automated ETL scripts" },
      { week: "Weeks 3-4", focus: "Feature Engineering & Baseline", deliverable: "Rolling statistical features, seasonality decomposition, and ARIMA baseline" },
      { week: "Weeks 5-6", focus: "Deep Sequence Model Training", deliverable: "LSTM/TFT model outperforming moving average baseline by >25% RMSE" },
      { week: "Weeks 7-8", focus: "Interactive Dashboard & Alerts", deliverable: "Next.js visual dashboard displaying confidence interval bands and alert triggers" },
    ],
    expertEvaluation:
      "Evaluated on RMSE/MAE metrics on holdout test periods, SQL query execution time under 100k rows (<50ms), and automated retraining pipeline reliability.",
    demoDataLabel: "Verified INSPIVIA Data Systems Spec",
  },
  {
    id: "proj-aegis-rover",
    title: "AegisBot: Vision-Guided Autonomous Rover",
    domain: "Robotics & Cyber-Physical",
    skillLevel: "Innovator (3rd/4th Year)",
    difficulty: "Advanced",
    estimatedDuration: "8 Weeks",
    problemStatement:
      "Agricultural field surveys and disaster response scenarios need lightweight ground robots capable of navigating rugged indoor/outdoor spaces without relying on continuous GPS or expensive LiDAR rigs.",
    prerequisites: [
      "Embedded C++ and motor controller kinematics",
      "Linux terminal & ROS / ROS 2 fundamentals",
      "Basic computer vision (camera calibration, optical flow)",
    ],
    requiredSkills: [
      "ROS 2 Humble Architecture",
      "Visual Odometry & SLAM Mapping",
      "Motor PID Velocity Tuning",
      "Edge AI Inference on Jetson Nano / Raspberry Pi",
    ],
    expectedOutcome:
      "A differential-drive robotic rover utilizing monocular visual SLAM for real-time 2D occupancy grid generation and obstacle-avoidance path planning in GPS-denied environments.",
    novelty: "Edge-computed optical flow obstacle bounding requiring zero active laser emission.",
    techStack: ["ROS 2", "Python", "C++", "OpenCV", "Raspberry Pi", "ESP32"],
    starterRepo: "https://github.com/inspivia/starter-aegis-rover",
    weeklyMilestones: [
      { week: "Weeks 1-2", focus: "Kinematics & Motor PID", deliverable: "Closed-loop encoder velocity regulation on dual DC gearmotors" },
      { week: "Weeks 3-4", focus: "ROS 2 Node Architecture", deliverable: "Publish/subscribe nodes for joystick teleoperation and odometry broadcast" },
      { week: "Weeks 5-6", focus: "Visual SLAM Integration", deliverable: "Feature extraction pipeline producing continuous local position estimates" },
      { week: "Weeks 7-8", focus: "Autonomous Waypoint Mission", deliverable: "Autonomous traversal of a 15-meter obstacle course without collision" },
    ],
    expertEvaluation:
      "Drift error <5% over a 10m loop trajectory, motor command latency <30ms, and complete ROS 2 modularity with launch file documentation.",
    demoDataLabel: "Verified INSPIVIA Robotics Track Spec",
  },
];

export default function ProjectRecommendationsPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTech, setSelectedTech] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Detailed Modal State
  const [activeModalProject, setActiveModalProject] = useState<CuratedProject | null>(null);

  // Extract unique filters
  const domainOptions = useMemo(() => {
    const list = Array.from(new Set(PROJECTS_DATA.map((p) => p.domain)));
    return ["All", ...list];
  }, []);

  const skillLevelOptions: (string | SkillLevel)[] = [
    "All",
    "Explorer (1st Year)",
    "Builder (2nd Year)",
    "Innovator (3rd/4th Year)",
  ];

  const difficultyOptions: (string | Difficulty)[] = ["All", "Beginner", "Intermediate", "Advanced"];

  const techOptions = useMemo(() => {
    const all = new Set<string>();
    PROJECTS_DATA.forEach((p) => p.techStack.forEach((t) => all.add(t)));
    return ["All", ...Array.from(all).sort()];
  }, []);

  // Filter computation
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((project) => {
      const matchDomain = selectedDomain === "All" || project.domain === selectedDomain;
      const matchSkill = selectedSkillLevel === "All" || project.skillLevel === selectedSkillLevel;
      const matchDiff = selectedDifficulty === "All" || project.difficulty === selectedDifficulty;
      const matchTech = selectedTech === "All" || project.techStack.includes(selectedTech);

      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.domain.toLowerCase().includes(query) ||
        project.problemStatement.toLowerCase().includes(query) ||
        project.requiredSkills.some((s) => s.toLowerCase().includes(query)) ||
        project.techStack.some((t) => t.toLowerCase().includes(query));

      return matchDomain && matchSkill && matchDiff && matchTech && matchQuery;
    });
  }, [selectedDomain, selectedSkillLevel, selectedDifficulty, selectedTech, searchQuery]);

  const activeFilterCount =
    (selectedDomain !== "All" ? 1 : 0) +
    (selectedSkillLevel !== "All" ? 1 : 0) +
    (selectedDifficulty !== "All" ? 1 : 0) +
    (selectedTech !== "All" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const resetFilters = () => {
    setSelectedDomain("All");
    setSelectedSkillLevel("All");
    setSelectedDifficulty("All");
    setSelectedTech("All");
    setSearchQuery("");
  };

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-moss-green/20 text-moss-green border-moss-green/30";
      case "Intermediate":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Advanced":
        return "bg-rosy-brown/20 text-rosy-brown border-rosy-brown/30";
      default:
        return "bg-beige/10 text-beige border-beige/20";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-beige/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-green/50 border border-beige/15 text-[11px] font-mono text-moss-green mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Curated Engineering Matchmaker</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-beige">
            Project Recommendations
          </h1>
          <p className="text-xs md:text-sm text-beige/80 mt-1 max-w-2xl font-sans leading-relaxed">
            Real portfolio-grade engineering statements tailored to your semester. No boilerplate to-do apps — each project is designed by experts with clear architecture, novelty, and mentor evaluation criteria.
          </p>
        </div>

        <Link
          href="/dashboard/ai-companion"
          className="px-5 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-md flex items-center gap-2 self-start md:self-auto transition-transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Spec Generator with the AI Companion</span>
        </Link>
      </div>

      {/* Control Bar: Search & Multi-Tier Filters */}
      <div className="p-6 rounded-3xl bg-midnight-green/30 border border-beige/15 space-y-5 shadow-lg">
        {/* Search Input & Reset Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-beige/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, skill, technology (e.g. ESP32, PyTorch, FreeRTOS, Verilog)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/35 text-xs font-mono focus:outline-none focus:border-rosy-brown transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-beige/40 hover:text-beige"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-2xl bg-forest-green hover:bg-rosy-brown/20 border border-rosy-brown/40 text-rosy-brown text-xs font-mono flex items-center gap-2 transition-all self-end sm:self-auto shrink-0"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>

        {/* Filter Tier 1: Domain Selection */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-beige/50">
            <Filter className="w-3 h-3 text-moss-green" />
            <span>Filter by Domain:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {domainOptions.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  selectedDomain === domain
                    ? "bg-rosy-brown text-forest-green font-bold shadow-sm"
                    : "bg-forest-green/60 text-beige/70 hover:text-beige border border-beige/10"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Tier 2: Skill Level, Difficulty & Technology */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-beige/10">
          {/* Skill Level */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-beige/50 block">
              Skill Level (Semester / Year):
            </label>
            <select
              value={selectedSkillLevel}
              onChange={(e) => setSelectedSkillLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-forest-green/80 border border-beige/15 text-beige text-xs font-mono focus:outline-none focus:border-rosy-brown"
            >
              {skillLevelOptions.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-forest-green text-beige">
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-beige/50 block">
              Complexity / Difficulty:
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-forest-green/80 border border-beige/15 text-beige text-xs font-mono focus:outline-none focus:border-rosy-brown"
            >
              {difficultyOptions.map((diff) => (
                <option key={diff} value={diff} className="bg-forest-green text-beige">
                  {diff}
                </option>
              ))}
            </select>
          </div>

          {/* Technology */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-beige/50 block">
              Core Tech Stack:
            </label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-forest-green/80 border border-beige/15 text-beige text-xs font-mono focus:outline-none focus:border-rosy-brown"
            >
              {techOptions.map((tech) => (
                <option key={tech} value={tech} className="bg-forest-green text-beige">
                  {tech}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-beige/60 px-1">
        <span>
          Showing <span className="text-rosy-brown font-bold">{filteredProjects.length}</span> verified project specifications
        </span>
        <span className="text-[11px] text-beige/40">
          All statements contain novelty angles & expert evaluation rubrics
        </span>
      </div>

      {/* Interactive Project Flashcards Grid with Staggered Motion */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="rounded-3xl p-7 md:p-8 bg-midnight-green/35 border border-beige/15 hover:border-rosy-brown/60 transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden"
            >
              {/* Top Accent Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-moss-green via-rosy-brown to-beige opacity-40 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold uppercase ${getDifficultyBadge(
                        project.difficulty
                      )}`}
                    >
                      {project.difficulty}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-forest-green border border-beige/20 text-beige/80">
                      {project.skillLevel}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-beige/60 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rosy-brown" />
                    <span>{project.estimatedDuration}</span>
                  </span>
                </div>

                {/* Title & Domain */}
                <h3 className="text-xl md:text-2xl font-serif font-bold text-beige group-hover:text-rosy-brown transition-colors mb-1.5">
                  {project.title}
                </h3>
                <p className="text-xs font-mono text-moss-green mb-4">
                  {project.domain}
                </p>

                {/* Problem Statement Excerpt */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-beige/50 block mb-1">
                    Problem Statement:
                  </span>
                  <p className="text-xs md:text-sm text-beige/85 leading-relaxed font-sans line-clamp-3">
                    {project.problemStatement}
                  </p>
                </div>

                {/* Key Prerequisites & Required Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-forest-green/70 border border-white/5 mb-5 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-rosy-brown font-bold block mb-1">
                      Prerequisites:
                    </span>
                    <ul className="space-y-1 text-[11px] text-beige/75 font-sans">
                      {project.prerequisites.slice(0, 2).map((pre, pidx) => (
                        <li key={pidx} className="flex items-start gap-1.5">
                          <span className="text-moss-green mt-0.5">•</span>
                          <span className="line-clamp-1">{pre}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-moss-green font-bold block mb-1">
                      Required Skills:
                    </span>
                    <ul className="space-y-1 text-[11px] text-beige/75 font-sans">
                      {project.requiredSkills.slice(0, 2).map((skill, sidx) => (
                        <li key={sidx} className="flex items-start gap-1.5">
                          <span className="text-rosy-brown mt-0.5">•</span>
                          <span className="line-clamp-1">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 mb-6 text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase text-beige/50 font-bold block">
                    Expected Outcome:
                  </span>
                  <p className="text-xs italic text-beige/85 font-sans line-clamp-2">
                    "{project.expectedOutcome}"
                  </p>
                </div>
              </div>

              {/* Bottom Actions & Tech Tags */}
              <div>
                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 text-beige/70 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card CTA Row */}
                <div className="flex items-center justify-between pt-4 border-t border-beige/10">
                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="px-4 py-2 rounded-xl bg-forest-green hover:bg-rosy-brown hover:text-forest-green border border-beige/20 text-beige text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-sm group-hover:border-rosy-brown"
                  >
                    <span>View Full Project Spec</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/ai-companion?prompt=${encodeURIComponent(
                        `Help me break down the ${project.title} project into weekly milestones and architecture steps.`
                      )}`}
                      className="p-2 rounded-xl bg-forest-green/80 hover:bg-rosy-brown hover:text-forest-green border border-beige/15 text-beige/80 transition-colors"
                      title="Ask the AI Companion about this project"
                    >
                      <Sparkles className="w-4 h-4 text-rosy-brown hover:text-forest-green" />
                    </Link>

                    <a
                      href={project.starterRepo}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-forest-green/80 hover:bg-rosy-brown hover:text-forest-green border border-beige/15 text-beige/80 transition-colors"
                      title="Inspect starter repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-6 rounded-3xl bg-midnight-green/20 border border-beige/15 max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rosy-brown/10 border border-rosy-brown/20 flex items-center justify-center mx-auto text-rosy-brown">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-beige">
            No Matching Project Statements Found
          </h3>
          <p className="text-xs md:text-sm text-beige/70 font-sans leading-relaxed">
            No curated projects match your selected filters. Try widening your criteria or reset the filters to see all available engineering briefs.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow transition-transform hover:scale-105"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Detailed Project View Modal / Drawer */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-forest-green border border-beige/25 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8 space-y-7"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-midnight-green/60 border border-beige/15 text-beige/70 hover:text-beige hover:border-rosy-brown transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-3 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold uppercase ${getDifficultyBadge(
                      activeModalProject.difficulty
                    )}`}
                  >
                    {activeModalProject.difficulty}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-midnight-green border border-beige/20 text-beige/80">
                    {activeModalProject.skillLevel}
                  </span>
                  <span className="text-[10px] font-mono text-moss-green px-2 py-0.5">
                    {activeModalProject.domain}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-serif font-bold text-beige">
                  {activeModalProject.title}
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-beige/50">
                  <Clock className="w-3.5 h-3.5 text-rosy-brown" />
                  <span>Estimated Timeline: {activeModalProject.estimatedDuration} Intensive Sprint</span>
                </div>
              </div>

              {/* Problem Statement Section */}
              <div className="space-y-2 p-5 rounded-2xl bg-midnight-green/40 border border-beige/15">
                <span className="text-[11px] font-mono uppercase text-rosy-brown font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Full Problem Statement & Real-World Context:</span>
                </span>
                <p className="text-xs md:text-sm text-beige/85 leading-relaxed font-sans">
                  {activeModalProject.problemStatement}
                </p>
                <div className="mt-3 pt-3 border-t border-beige/10 text-xs">
                  <span className="text-[10px] font-mono uppercase text-moss-green font-bold block mb-0.5">
                    Patent / Novelty Angle:
                  </span>
                  <p className="italic text-beige/80">
                    "{activeModalProject.novelty}"
                  </p>
                </div>
              </div>

              {/* Prerequisites & Required Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-forest-green border border-beige/15 space-y-2">
                  <span className="text-[11px] font-mono uppercase text-moss-green font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Prerequisites Checklist:</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-beige/80 font-sans">
                    {activeModalProject.prerequisites.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-moss-green shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-forest-green border border-beige/15 space-y-2">
                  <span className="text-[11px] font-mono uppercase text-rosy-brown font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    <span>Required Competencies:</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-beige/80 font-sans">
                    {activeModalProject.requiredSkills.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rosy-brown shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Expected Outcome Specification */}
              <div className="p-5 rounded-2xl bg-forest-green border border-beige/15 space-y-2">
                <span className="text-[11px] font-mono uppercase text-beige font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-moss-green" />
                  <span>Expected Deliverable & Success Criteria:</span>
                </span>
                <p className="text-xs md:text-sm text-beige/85 leading-relaxed font-sans">
                  {activeModalProject.expectedOutcome}
                </p>
              </div>

              {/* Sprint Roadmap Milestones */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase text-beige/60 font-bold block">
                  Weekly Sprint Progression:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeModalProject.weeklyMilestones.map((ms, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-midnight-green/30 border border-beige/10 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-rosy-brown">{ms.week}</span>
                        <span className="text-beige/50">{ms.focus}</span>
                      </div>
                      <p className="text-xs text-beige/80 font-sans">
                        {ms.deliverable}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expert Mentor Evaluation */}
              <div className="p-4 rounded-2xl bg-midnight-green/60 border border-rosy-brown/30 space-y-1 text-xs">
                <span className="text-[10px] font-mono uppercase text-rosy-brown font-bold block">
                  Expert Mentor Evaluation Rubric:
                </span>
                <p className="italic text-beige/85 font-serif leading-relaxed">
                  "{activeModalProject.expertEvaluation}"
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-beige/15">
                <a
                  href={activeModalProject.starterRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-forest-green hover:bg-forest-green/80 border border-beige/25 text-beige text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Fork Starter Repository</span>
                  <ExternalLink className="w-3 h-3 text-beige/50" />
                </a>

                <Link
                  href={`/dashboard/ai-companion?prompt=${encodeURIComponent(
                    `I want to start the ${activeModalProject.title} project. What are my first 3 technical steps and architecture decisions?`
                  )}`}
                  onClick={() => setActiveModalProject(null)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-rosy-brown hover:bg-rosy-brown/90 text-forest-green font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Architect with the AI Companion</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
