export interface ProjectItem {
  id: string;
  title: string;
  category: "AI/ML" | "IoT & Embedded" | "Full-Stack Web" | "VLSI & Hardware" | "Data Systems";
  domain: string;
  studentTeam: string;
  year: string;
  status: "Shipped & Deployed" | "Active Super 50 Sprint" | "Provisional Patent Filed" | "Research Publication";
  summary: string;
  metrics: string;
  techStack: string[];
  paletteBg: string;
  paletteAccent: string;
  artVariant: number;
  image?: string;
  githubUrl?: string;
  demoUrl?: string;
  patentNumber?: string;
}

export interface CampaignItem {
  id: string;
  title: string;
  category: "Cohort Initiative" | "Campus Hackathon" | "Open Hardware Lab" | "Mentorship Drive";
  date: string;
  location: string;
  summary: string;
  impactMetrics: string[];
  accentColor: string;
  badge: string;
  image?: string;
  hasPhotoSupplied: boolean;
  photoSlotId: string;
}

export interface CommunityPortfolioItem {
  id: string;
  studentName: string;
  branch: string;
  yearOfStudy: string;
  headline: string;
  deployedProject: string;
  portfolioUrl?: string;
  githubUrl?: string;
  tags: string[];
}

export const WORK_PROJECTS: ProjectItem[] = [
  {
    id: "ecopulse-iot",
    title: "EcoPulse: Ambient Micro-Telemetry Node",
    category: "IoT & Embedded",
    domain: "Embedded Systems / ESP32 / FreeRTOS / MQTT",
    studentTeam: "Archi Gupta & ECE Cohort",
    year: "2025",
    status: "Provisional Patent Filed",
    summary:
      "A solar-assisted ambient sensor node capturing particulate matter (PM2.5/PM10), ambient temperature, and volatile organic compound telemetry. Streams data to a Next.js edge dashboard with adaptive sleep states extending battery longevity by 42%.",
    metrics: "Sub-50ms Telemetry Latency // 42% Power Reduction",
    techStack: ["ESP32", "FreeRTOS", "MQTT", "Next.js 14", "C++", "Tailwind CSS"],
    paletteBg: "#0A3323",
    paletteAccent: "#839958",
    artVariant: 0,
    githubUrl: "https://github.com",
    demoUrl: "https://demo.inspivia.org/ecopulse",
    patentNumber: "IN-2025-TEMP-4091",
  },
  {
    id: "neurovision-ai",
    title: "NeuroVision: Non-Invasive Medical Prognosis",
    category: "AI/ML",
    domain: "Computer Vision / PyTorch / FastAPI / Docker",
    studentTeam: "Saanvi Tiwari, Mishika Agarwal & CS-AI Cohort",
    year: "2025",
    status: "Shipped & Deployed",
    summary:
      "Deep convolutional neural network trained on multi-modal MRI scans for early micro-vascular anomaly detection. Implements gradient-weighted class activation mapping (Grad-CAM) to provide transparent interpretability for clinical reviewers.",
    metrics: "94.6% Validation Accuracy // < 2.1s Inference",
    techStack: ["Python", "PyTorch", "FastAPI", "Docker", "Next.js", "OpenCV"],
    paletteBg: "#105666",
    paletteAccent: "#D3968C",
    artVariant: 1,
    githubUrl: "https://github.com",
    demoUrl: "https://demo.inspivia.org/neurovision",
  },
  {
    id: "nextyou-hub",
    title: "NextYou: Engineering Portfolio Engine",
    category: "Full-Stack Web",
    domain: "Web Architecture / TypeScript / Edge Deployment",
    studentTeam: "Tanishka Awasthi, Nitya Saluja & Super 50",
    year: "2025",
    status: "Shipped & Deployed",
    summary:
      "A high-speed portfolio builder engineered specifically for female engineering students to document hardware schematics, research papers, live repositories, and expert endorsements without relying on generic CMS templates.",
    metrics: "27+ Portfolios Deployed // 99 Lighthouse Score",
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    paletteBg: "#0A3323",
    paletteAccent: "#F7F4D5",
    artVariant: 2,
    githubUrl: "https://github.com",
    demoUrl: "https://demo.inspivia.org/portfolios",
  },
  {
    id: "aurawave-vlsi",
    title: "AuraWave: Low-Power FIR Filter Synthesizer",
    category: "VLSI & Hardware",
    domain: "VLSI Design / Verilog HDL / Xilinx Vivado",
    studentTeam: "Satvi Shukla, Apeksha Srivastava & VLSI Cohort",
    year: "2024",
    status: "Research Publication",
    summary:
      "Digital Signal Processing architecture implementing pipelined 32-tap finite impulse response filtering with reduced switching power consumption specifically calibrated for non-invasive wearable medical diagnostics.",
    metrics: "28% Switching Power Reduction // 160 MHz Clock",
    techStack: ["Verilog HDL", "ModelSim", "Xilinx Vivado", "Python", "MATLAB"],
    paletteBg: "#105666",
    paletteAccent: "#839958",
    artVariant: 3,
    githubUrl: "https://github.com",
    demoUrl: "https://demo.inspivia.org/aurawave",
  },
  {
    id: "apexpulse-data",
    title: "ApexPulse: Predictive Demand & Timeseries Analytics",
    category: "Data Systems",
    domain: "Predictive Analytics / Python / Scikit-Learn",
    studentTeam: "Moli Maheshwari & Data Cohort",
    year: "2024",
    status: "Shipped & Deployed",
    summary:
      "Automated time-series forecasting pipeline combining seasonal ARIMA and LSTM architectures to optimize local supply chain logistics and predict demand spikes with calibrated confidence intervals.",
    metrics: "18% Forecasting Error Reduction // Real-time SQL Pipeline",
    techStack: ["Python", "Pandas", "Scikit-Learn", "Streamlit", "PostgreSQL"],
    paletteBg: "#0A3323",
    paletteAccent: "#D3968C",
    artVariant: 4,
    githubUrl: "https://github.com",
    demoUrl: "https://demo.inspivia.org/apexpulse",
  },
];

export const WORK_CAMPAIGNS: CampaignItem[] = [
  {
    id: "super-50-cohort",
    title: "Super 50 Project Accelerator",
    category: "Cohort Initiative",
    date: "Semester IV // 2024–2025",
    location: "Campus & Remote",
    summary:
      "The flagship intensive mentoring cohort founded by Wallabhi Saxena. 50 junior engineers were paired with expert leads for 8 weeks of intensive milestone building, resulting in 100% prototype completion.",
    impactMetrics: [
      "50/50 Delivered Projects",
      "Provisional Patents Drafted",
      "100% Student Retention",
    ],
    accentColor: "#D3968C",
    badge: "Flagship Sprint",
    hasPhotoSupplied: false,
    photoSlotId: "/public/campaigns/super50-cohort.jpg",
  },
  {
    id: "hardware-testbed",
    title: "Open Hardware & IoT Sensor Testbed",
    category: "Open Hardware Lab",
    date: "Continuous Lab // 2025",
    location: "Department of Electronics & Communications",
    summary:
      "A hands-on physical testbed featuring ESP32 modules, digital logic analyzers, oscilloscope benches, and calibrated sensors provided for juniors to prototype without hardware costs.",
    impactMetrics: [
      "12 Microcontroller Test Racks",
      "6 Sensor Libraries Written",
      "40+ Hours Lab Mentoring",
    ],
    accentColor: "#839958",
    badge: "Lab Sandbox",
    hasPhotoSupplied: false,
    photoSlotId: "/public/campaigns/iot-lab-testbed.jpg",
  },
  {
    id: "patent-writing-workshop",
    title: "Provisional Patent & Research Drafting Clinic",
    category: "Mentorship Drive",
    date: "Autumn 2024",
    location: "Central Library Auditorium",
    summary:
      "A practical workshop demystifying intellectual property for undergraduate engineers. Focused on transforming semester projects into defendable provisional patent specifications and claims.",
    impactMetrics: [
      "85 Engineering Scholars",
      "3 Provisional Claims Filed",
      "Step-by-Step Claim Templates",
    ],
    accentColor: "#105666",
    badge: "IP Innovation",
    hasPhotoSupplied: false,
    photoSlotId: "/public/campaigns/patent-workshop.jpg",
  },
];

export const COMMUNITY_PORTFOLIOS: CommunityPortfolioItem[] = [
  {
    id: "port-1",
    studentName: "Archi Gupta",
    branch: "B.Tech Electronics & Communication",
    yearOfStudy: "3rd Year",
    headline: "Embedded Firmware Engineer & IoT Hardware Enthusiast",
    deployedProject: "EcoPulse: Ambient Micro-Telemetry Node",
    portfolioUrl: "https://demo.inspivia.org/portfolios",
    githubUrl: "https://github.com",
    tags: ["ESP32", "FreeRTOS", "MQTT", "Hardware"],
  },
  {
    id: "port-2",
    studentName: "Saanvi Tiwari",
    branch: "B.Tech Computer Science & AI",
    yearOfStudy: "3rd Year",
    headline: "Deep Learning Researcher & Computer Vision Developer",
    deployedProject: "NeuroVision: Non-Invasive Medical Prognosis",
    portfolioUrl: "https://demo.inspivia.org/portfolios",
    githubUrl: "https://github.com",
    tags: ["PyTorch", "Grad-CAM", "FastAPI", "Docker"],
  },
  {
    id: "port-3",
    studentName: "Tanishka Awasthi",
    branch: "B.Tech Information Technology",
    yearOfStudy: "2nd Year",
    headline: "Frontend Architect & Interaction Systems Engineer",
    deployedProject: "NextYou: Engineering Portfolio Engine",
    portfolioUrl: "https://demo.inspivia.org/portfolios",
    githubUrl: "https://github.com",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "port-4",
    studentName: "Satvi Shukla",
    branch: "B.Tech VLSI & Microelectronics",
    yearOfStudy: "3rd Year",
    headline: "Digital IC Design & Verilog RTL Architect",
    deployedProject: "AuraWave: Low-Power FIR Filter Synthesizer",
    portfolioUrl: "https://demo.inspivia.org/portfolios",
    githubUrl: "https://github.com",
    tags: ["Verilog", "Vivado", "ModelSim", "DSP"],
  },
  {
    id: "port-5",
    studentName: "Moli Maheshwari",
    branch: "B.Tech Computer Science",
    yearOfStudy: "3rd Year",
    headline: "Data Systems Engineer & Predictive Modeling Specialist",
    deployedProject: "ApexPulse: Predictive Demand Analytics",
    portfolioUrl: "https://demo.inspivia.org/portfolios",
    githubUrl: "https://github.com",
    tags: ["Pandas", "Scikit-Learn", "PostgreSQL"],
  },
  {
    id: "port-6",
    studentName: "Nitya Saluja",
    branch: "B.Tech Information Technology",
    yearOfStudy: "2nd Year",
    headline: "Full-Stack Web Engineer & Distributed Systems Learner",
    deployedProject: "Distributed Milestone Tracker for Super 50",
    portfolioUrl: "https://demo.inspivia.org/portfolios",
    githubUrl: "https://github.com",
    tags: ["React", "Node.js", "REST APIs"],
  },
];
