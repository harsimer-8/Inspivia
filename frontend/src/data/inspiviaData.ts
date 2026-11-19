export interface PlatformStat {
  value: string;
  label: string;
  detail: string;
}

export interface ServiceDetail {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  accentColor: string;
  badge: string;
  iconName: string;
}

export interface FlashcardStep {
  id: string;
  number: string;
  phase: string;
  title: string;
  subtitle: string;
  description: string;
  keyOutcomes: string[];
  badgeColor: string;
  accentBg: string;
  textColor: string;
  borderColor: string;
}

export interface ProjectShowcase {
  id: string;
  title: string;
  category: "AI/ML" | "IoT & Embedded" | "Full-Stack Web" | "VLSI & Hardware" | "Data Systems";
  domain: string;
  studentTeam: string;
  year: string;
  summary: string;
  metrics: string;
  techStack: string[];
  paletteBg: string;
  paletteAccent: string;
  featured: boolean;
  githubUrl?: string;
  demoUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  designation: string;
  discipline: string;
  bio: string;
  initials: string;
  image?: string;
  linkedIn: string;
  bgToken: string;
  accentToken: string;
  isFounder?: boolean;
}

export const BRAND_INFO = {
  name: "INSPIVIA",
  tagline: "Don't Just Learn. Build With Direction.",
  shortDescription: "A student-centric mentorship and project-building platform overcoming student confusion through personalized roadmaps, 1-on-1 expert guidance, and AI Companion assistance.",
  founder: "Wallabhi Saxena",
  officialEmail: "connect@inspivia.org",
  institution: "Global Student Chapters",
  founderLinkedIn: "https://www.linkedin.com/in/wallabhi-saxena-8a84b4248/",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/wallabhi-saxena/" },
    { label: "Instagram", href: "https://www.instagram.com/inspivia_26?bqrl=MWFxMjIzbndnb3Ryaw%3D%3D&utm_source=qr" },
  ],
};

export const PLATFORM_STATS: PlatformStat[] = [
  {
    value: "5,000+",
    label: "Students Mentored",
    detail: "Engineering students guided to overcome project confusion and build with clear technical direction.",
  },
  {
    value: "500+",
    label: "Delivered Student Projects",
    detail: "Verified working prototypes across IoT, AI/ML, Web, and VLSI architectures.",
  },
  {
    value: "Super 50",
    label: "Flagship Cohort",
    detail: "Intensive project-based mentoring batch achieving 100% project delivery.",
  },
  {
    value: "24/7",
    label: "AI Project Companion",
    detail: "Automated architectural feedback, task breakdown, and real-time code reviews.",
  },
];

export const FOUR_SERVICES: ServiceDetail[] = [
  {
    id: "roadmaps",
    number: "01",
    title: "Personalized Learning Roadmaps",
    subtitle: "Tailored milestone-driven paths designed by experts who walked the path",
    description:
      "Say goodbye to generic YouTube rabbit holes and tutorial paralysis. Receive structured multi-week technical roadmaps calibrated to your current semester, target domain, and career goals.",
    features: [
      "Custom weekly milestone checkpoints",
      "Curated expert engineering notes & patent templates",
      "Direct mapping to real-world industrial expectations",
      "Interactive progress persistence & streak tracking",
    ],
    accentColor: "#D3968C",
    badge: "Milestone-Driven",
    iconName: "Compass",
  },
  {
    id: "mentorship",
    number: "02",
    title: "One-to-One Expert Guidance",
    subtitle: "Rebuilding the authentic mentor-mentee bond with dedicated leads",
    description:
      "Direct 1-on-1 pairing with experienced experts who have shipped projects, completed internships, and filed patents. Safe space to ask doubts without fear of judgment.",
    features: [
      "Dedicated expert lead matched by technical discipline",
      "Weekly code review & architectural walkthroughs",
      "Accountability check-ins to prevent project abandonment",
      "Portfolio preparation and technical interview readiness",
    ],
    accentColor: "#839958",
    badge: "Human Connection",
    iconName: "Users",
  },
  {
    id: "ai-companion",
    number: "03",
    title: "AI Project Companion",
    subtitle: "Your 24/7 intelligent sounding board for architecture and code",
    description:
      "The AI Companion helps you brainstorm unique project ideas, decompose vague problems into engineering tickets, draft schema definitions, and debug compiler errors in real time.",
    features: [
      "Vague-idea to functional specification generator",
      "System architecture & database schema visualizer",
      "Context-aware bug troubleshooting and refactoring",
      "Patent claim & project documentation drafting",
    ],
    accentColor: "#105666",
    badge: "AI-Powered",
    iconName: "Sparkles",
  },
  {
    id: "projects",
    number: "04",
    title: "Curated Project Matchmaking",
    subtitle: "Real-world engineering challenges tailored to your skill stage",
    description:
      "Stop building boilerplate to-do lists. Work on problems with tangible social impact, hardware telemetry, deep learning intelligence, and production-grade architectures.",
    features: [
      "Difficulty tiers: Explorer (1st Yr), Builder (2nd Yr), Innovator (3rd/4th Yr)",
      "Cross-disciplinary hardware & software integration specs",
      "Ready-to-fork starter templates with CI/CD and linting",
      "Patentable problem statements addressing civic & industrial needs",
    ],
    accentColor: "#D3968C",
    badge: "Portfolio-Grade",
    iconName: "FolderGit2",
  },
];

export const SIGNATURE_FLASHCARDS: FlashcardStep[] = [
  {
    id: "discover",
    number: "01",
    phase: "PHASE 01 // DISCOVER",
    title: "Untangle The Confusion",
    subtitle: "Identify your true domain interest and break the inertia of 'where do I even start?'",
    description:
      "Most engineering students spend their entire first two years confused by fragmented advice and complex syllabi. We begin by diagnosing your interests, demystifying engineering branches, and connecting you with a clear roadmap.",
    keyOutcomes: [
      "Diagnostic skill & ambition mapping",
      "Domain selection: AI/ML, Embedded/IoT, Full-Stack, VLSI",
      "Elimination of starter anxiety with expert orientation",
    ],
    badgeColor: "#105666",
    accentBg: "#105666",
    textColor: "#F7F4D5",
    borderColor: "rgba(247, 244, 213, 0.2)",
  },
  {
    id: "learn",
    number: "02",
    phase: "PHASE 02 // LEARN",
    title: "Follow A Curated Roadmap",
    subtitle: "No tutorial hell. Only high-leverage concepts mapped directly to working deliverables.",
    description:
      "Learn only what is essential to build your target project. Each roadmap phase contains curated notes, reference GitHub repositories, and interactive checkpoints to ensure comprehension before you write your first line.",
    keyOutcomes: [
      "Structured milestone progression without syllabus fluff",
      "Direct expert tips on avoiding common architectural traps",
      "Progress tracking synchronized with your student dashboard",
    ],
    badgeColor: "#839958",
    accentBg: "#839958",
    textColor: "#0A3323",
    borderColor: "rgba(10, 51, 35, 0.3)",
  },
  {
    id: "build",
    number: "03",
    phase: "PHASE 03 // BUILD",
    title: "Build With One-on-One Support",
    subtitle: "Code, assemble circuits, and debug with expert leads and the AI Companion standing by.",
    description:
      "Transform ideas into functioning prototypes. You are never left stuck on a cryptic error or a broken breadboard. Weekly accountability check-ins and the AI Companion's 24/7 assistance ensure steady forward momentum.",
    keyOutcomes: [
      "Weekly 1-on-1 code reviews and hardware debugging",
      "24/7 architectural advice through the AI companion",
      "Rigorous milestone deadlines in the Super 50 batch style",
    ],
    badgeColor: "#D3968C",
    accentBg: "#D3968C",
    textColor: "#0A3323",
    borderColor: "rgba(10, 51, 35, 0.25)",
  },
  {
    id: "grow",
    number: "04",
    phase: "PHASE 04 // GROW",
    title: "Ship, Showcase & Lead",
    subtitle: "Launch your portfolio, present research, and mentor the next incoming batch.",
    description:
      "A completed project should not gather dust on your hard drive. We help you deploy live demos, craft technical case studies, prepare patent applications, and present your work to tech recruiters and conferences.",
    keyOutcomes: [
      "Production deployment with live URLs and GitHub documentation",
      "Patent drafting guidance and research conference submissions",
      "Passing the torch by stepping up as expert leads for juniors",
    ],
    badgeColor: "#F7F4D5",
    accentBg: "#0A3323",
    textColor: "#F7F4D5",
    borderColor: "rgba(211, 150, 140, 0.4)",
  },
];

export const FEATURED_PROJECTS: ProjectShowcase[] = [
  {
    id: "iot-telemetry",
    title: "EcoPulse: Ambient Environmental Telemetry Node",
    category: "IoT & Embedded",
    domain: "Embedded Systems / ESP32 / C++",
    studentTeam: "Archi Gupta & ECE Cohort",
    year: "2025",
    summary:
      "A solar-assisted ambient sensor node capturing particulate matter, temperature, and VOC levels, streaming live telemetry to a Next.js edge dashboard via MQTT.",
    metrics: "Sub-50ms Telemetry Latency",
    techStack: ["ESP32", "FreeRTOS", "MQTT", "Next.js", "C++"],
    paletteBg: "#0A3323",
    paletteAccent: "#839958",
    featured: true,
    githubUrl: "https://github.com",
    demoUrl: "https://demo.inspivia.org/ecopulse",
  },
  {
    id: "med-prognosis",
    title: "NeuroVision: Non-Invasive Medical Prognosis",
    category: "AI/ML",
    domain: "Computer Vision / PyTorch",
    studentTeam: "Saanvi Tiwari, Mishika Agarwal & CS-AI Cohort",
    year: "2025",
    summary:
      "Deep convolutional neural network model trained on public MRI scans for early micro-vascular anomaly detection with gradient-weighted class activation mapping (Grad-CAM).",
    metrics: "94.6% Validation Accuracy",
    techStack: ["Python", "PyTorch", "FastAPI", "Docker", "Next.js"],
    paletteBg: "#105666",
    paletteAccent: "#D3968C",
    featured: true,
    githubUrl: "https://github.com",
    demoUrl: "https://demo.inspivia.org/neurovision",
  },
  {
    id: "portfolio-network",
    title: "NextYou: Engineering Portfolio Hub",
    category: "Full-Stack Web",
    domain: "Web Architecture / TypeScript",
    studentTeam: "Tanishka Awasthi, Nitya Saluja & Super 50",
    year: "2025",
    summary:
      "A high-speed portfolio builder for female engineering students to showcase hardware schematics, research papers, live repos, and expert endorsements.",
    metrics: "27+ Portfolios Deployed",
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion"],
    paletteBg: "#0A3323",
    paletteAccent: "#F7F4D5",
    featured: true,
    githubUrl: "https://github.com",
    demoUrl: "https://demo.inspivia.org/portfolios",
  },
  {
    id: "vlsi-dsp",
    title: "AuraWave: Low-Power FIR Filter Synthesizer",
    category: "VLSI & Hardware",
    domain: "VLSI Design / Verilog HDL",
    studentTeam: "Satvi Shukla, Apeksha Srivastava & VLSI Cohort",
    year: "2024",
    summary:
      "Digital Signal Processing architecture implementing pipelined 32-tap finite impulse response filtering with reduced switching power consumption for wearable monitors.",
    metrics: "28% Power Reduction",
    techStack: ["Verilog HDL", "ModelSim", "Xilinx Vivado", "Python"],
    paletteBg: "#105666",
    paletteAccent: "#839958",
    featured: true,
    githubUrl: "https://github.com",
    demoUrl: "https://demo.inspivia.org/aurawave",
  },
  {
    id: "data-analytics",
    title: "ApexPulse: Predictive Demand & Timeseries Analytics",
    category: "Data Systems",
    domain: "Data Analytics & Forecasting",
    studentTeam: "Moli Maheshwari & Data Cohort",
    year: "2024",
    summary:
      "Automated time-series demand forecasting pipeline integrating ARIMA and LSTM architectures to optimize local supply chain logistics.",
    metrics: "18% Forecasting Error Reduction",
    techStack: ["Python", "Pandas", "Scikit-Learn", "Streamlit", "PostgreSQL"],
    paletteBg: "#0A3323",
    paletteAccent: "#D3968C",
    featured: false,
    githubUrl: "https://github.com",
    demoUrl: "https://demo.inspivia.org/apexpulse",
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "wallabhi-saxena",
    name: "Wallabhi Saxena",
    role: "Founder & Lead Mentor",
    designation: "Founder, Inspivia & Super 50 Mentor",
    discipline: "Engineering Mentorship & Systems Leadership",
    bio: "Pioneered Inspivia and the Super 50 cohort to bridge the critical gap between theoretical coursework and real engineering. Has guided dozens of junior engineering students to build deployable systems, file patents, and build confidence from day one.",
    initials: "WS",
    image: "/team/wallabhi-saxena.png",
    linkedIn: "https://www.linkedin.com/in/wallabhi-saxena-8a84b4248/",
    bgToken: "#0A3323",
    accentToken: "#D3968C",
    isFounder: true,
  },
  {
    id: "mentor-aiml",
    name: "Oorja Tiwari",
    role: "Expert Mentor Lead",
    designation: "Head of AI/ML & Signal Processing",
    discipline: "Deep Learning & Wireless Communications",
    bio: "Experienced B.Tech ECE engineer with extensive expertise in computer vision, wireless signal processing, and junior mentorship.",
    initials: "OT",
    linkedIn: "https://www.linkedin.com",
    bgToken: "#105666",
    accentToken: "#F7F4D5",
  },
  {
    id: "mentor-web",
    name: "Pratiksha Khare",
    role: "Expert Mentor Lead",
    designation: "Head of Full-Stack Architecture",
    discipline: "React, Node.js & Distributed Systems",
    bio: "Passionate software engineer focused on helping 1st and 2nd year students master web architecture and clean design principles.",
    initials: "PK",
    linkedIn: "https://www.linkedin.com",
    bgToken: "#839958",
    accentToken: "#0A3323",
  },
  {
    id: "mentor-embedded",
    name: "Archi Gupta",
    role: "Lead Hardware Mentor",
    designation: "Head of IoT & Embedded Systems",
    discipline: "Microcontrollers, C/C++ & Robotics",
    bio: "Leads hands-on workshops in microcontroller programming, sensor interfacing, and hardware prototyping.",
    initials: "AG",
    linkedIn: "https://www.linkedin.com",
    bgToken: "#0A3323",
    accentToken: "#839958",
  },
];

export interface JourneyMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
}

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    id: "launch",
    title: "INSPIVIA Launched",
    date: "01 Feb 2026",
    description: "Inaugurated an elite technical leadership development and engineering mentorship initiative for aspiring technologists.",
  },
  {
    id: "fifty-projects",
    title: "50+ Projects Milestone",
    date: "14 Feb 2026",
    description: "Mentored scholars successfully delivered over 70 verified industry-standard engineering prototypes.",
  },
  {
    id: "top-performers",
    title: "Top Performers Evaluation",
    date: "26 Feb 2026",
    description: "Comprehensive technical evaluation, architectural code review, and performance benchmarking for student projects.",
  },
  {
    id: "super-50",
    title: "Super 30 to Super 50",
    date: "27 Feb 2026",
    description: "Strategic expansion of our flagship mentorship cohort into Super 50, providing high-touch engineering guidance to a larger talent pool.",
  },
  {
    id: "two-hundred-projects",
    title: "200+ Projects Achieved",
    date: "10 Mar 2026",
    description: "Crossed 200+ deployed, real-world technical implementations across AI/ML, IoT, Web, and VLSI architectures.",
  },
];
