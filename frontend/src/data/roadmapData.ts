export interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  expertTip: string;
  resourceTitle?: string;
  resourceLink?: string;
  deliverable: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseTitle: string;
  duration: string;
  summary: string;
  milestones: MilestoneItem[];
}

export interface DomainRoadmap {
  id: string;
  slug: string;
  title: string;
  badge: string;
  category: string;
  description: string;
  totalWeeks: number;
  targetYear: string;
  iconName: string;
  accentColor: string;
  phases: RoadmapPhase[];
}

export const DOMAIN_ROADMAPS: DomainRoadmap[] = [
  {
    id: "web-dev",
    slug: "full-stack-web",
    title: "Full-Stack Web & Cloud Architecture",
    badge: "Web Systems",
    category: "Software Engineering",
    description: "From modern TypeScript fundamentals to high-performance Next.js full-stack applications with server components, database transactions, and cloud deployments.",
    totalWeeks: 10,
    targetYear: "1st & 2nd Year",
    iconName: "Globe",
    accentColor: "#D3968C",
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "TypeScript & Component Design",
        duration: "Weeks 1-3",
        summary: "Master type safety, asynchronous patterns, and component composition in React.",
        milestones: [
          {
            id: "m-web-1",
            title: "Strict TypeScript & React Hooks Mastery",
            description: "Build clean, reusable functional components with strict props typing, custom hooks, and state management.",
            estimatedHours: 12,
            expertTip: "Don't use `any`. Defining strict interfaces early saves hours of debugging later.",
            resourceTitle: "Official TypeScript Handbook: Strict Typing & Generics",
            resourceLink: "https://www.typescriptlang.org/docs/handbook/intro.html",
            deliverable: "Interactive portfolio shell with dark mode and custom hook state.",
          },
          {
            id: "m-web-2",
            title: "Tailwind CSS & Responsive Layout Systems",
            description: "Implement mobile-first responsive flex and grid layouts, typography scales, and CSS transitions.",
            estimatedHours: 10,
            expertTip: "Design for mobile screens first before expanding to desktop viewports.",
            resourceTitle: "Tailwind CSS Responsive Design & Flexbox Guide",
            resourceLink: "https://tailwindcss.com/docs/responsive-design",
            deliverable: "Responsive student project showcase grid.",
          },
        ],
      },
      {
        phaseNumber: 2,
        phaseTitle: "Full-Stack Next.js & Server Actions",
        duration: "Weeks 4-7",
        summary: "Learn Next.js App Router, Server Actions, REST/tRPC APIs, and PostgreSQL schema design.",
        milestones: [
          {
            id: "m-web-3",
            title: "App Router & Dynamic Route Handling",
            description: "Create nested route layouts, error boundaries, loading skeletons, and server-side data fetching.",
            estimatedHours: 16,
            expertTip: "Leverage React Server Components to minimize client bundle size.",
            resourceTitle: "Next.js App Router Documentation & Server Actions",
            resourceLink: "https://nextjs.org/docs/app",
            deliverable: "Full CRUD project management module with server authentication.",
          },
          {
            id: "m-web-4",
            title: "Database Integration & Relational Schemas",
            description: "Connect to PostgreSQL using Prisma or Drizzle ORM. Write type-safe queries and database migrations.",
            estimatedHours: 14,
            expertTip: "Always index foreign keys and write database transactions for multi-step writes.",
            resourceTitle: "Prisma Schema Modeling & Migration Documentation",
            resourceLink: "https://www.prisma.io/docs/concepts/components/prisma-schema",
            deliverable: "Relational database schema for student mentorship booking.",
          },
        ],
      },
      {
        phaseNumber: 3,
        phaseTitle: "Production Deployment & Security",
        duration: "Weeks 8-10",
        summary: "Harden authentication with HTTP-only cookies, configure CI/CD pipelines, and deploy on edge infrastructure.",
        milestones: [
          {
            id: "m-web-5",
            title: "Secure Session Auth & API Protection",
            description: "Implement password hashing with bcrypt, CSRF protection, and role-based route middleware.",
            estimatedHours: 12,
            expertTip: "Never store credentials in local storage; always use HTTP-only cookies.",
            resourceTitle: "OWASP Web Security Testing Guide & Session Best Practices",
            resourceLink: "https://owasp.org/www-project-web-security-testing-guide/",
            deliverable: "Protected student portal with verified student email domain checks.",
          },
          {
            id: "m-web-6",
            title: "Cloud Deployment & Performance Auditing",
            description: "Deploy to Vercel/AWS, optimize Core Web Vitals (LCP < 1.2s), and configure automated GitHub Actions.",
            estimatedHours: 8,
            expertTip: "Run Lighthouse audits before sharing your portfolio with hiring managers.",
            resourceTitle: "Google Web Vitals & Production Deployment Checklist",
            resourceLink: "https://web.dev/vitals/",
            deliverable: "Live public URL with 95+ Lighthouse score.",
          },
        ],
      },
    ],
  },
  {
    id: "ai-ml",
    slug: "ai-machine-learning",
    title: "Applied AI & Deep Learning Systems",
    badge: "Artificial Intelligence",
    category: "Machine Learning",
    description: "Build, train, and deploy practical deep learning models for computer vision, NLP, and predictive medical diagnostics.",
    totalWeeks: 12,
    targetYear: "1st, 2nd & 3rd Year",
    iconName: "BrainCircuit",
    accentColor: "#105666",
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "Foundations of Mathematical AI & PyTorch",
        duration: "Weeks 1-4",
        summary: "Linear algebra intuition, gradient descent, tensor calculus, and PyTorch model building.",
        milestones: [
          {
            id: "m-ai-1",
            title: "Tensor Operations & Custom Neural Networks",
            description: "Implement forward propagation, backpropagation, and loss optimizers from scratch in PyTorch.",
            estimatedHours: 18,
            expertTip: "Visualize loss curves frequently; an exploding loss usually indicates high learning rate.",
            resourceTitle: "PyTorch Official Deep Learning with PyTorch: A 60 Minute Blitz",
            resourceLink: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
            deliverable: "Modular neural classifier trained on custom feature dataset.",
          },
          {
            id: "m-ai-2",
            title: "Data Pipelines & Feature Preprocessing",
            description: "Clean real-world tabular and image datasets with Pandas, NumPy, and torchvision transforms.",
            estimatedHours: 14,
            expertTip: "Never train on validation data; set up strict train/val/test splits early.",
            resourceTitle: "Torchvision Transforms & Data Loading Architecture",
            resourceLink: "https://pytorch.org/vision/stable/transforms.html",
            deliverable: "Automated data ingestion and normalization pipeline.",
          },
        ],
      },
      {
        phaseNumber: 2,
        phaseTitle: "Deep Convolutional & Vision Architectures",
        duration: "Weeks 5-8",
        summary: "CNN architectures, transfer learning (ResNet, EfficientNet), and visual explainability (Grad-CAM).",
        milestones: [
          {
            id: "m-ai-3",
            title: "Transfer Learning & Fine-Tuning SOTA Models",
            description: "Freeze pre-trained convolutional backbones, fine-tune classification heads on target medical/diagnostic images.",
            estimatedHours: 20,
            expertTip: "Start by training only the final linear head, then unfreeze the top layers with a 10x lower learning rate.",
            resourceTitle: "Transfer Learning for Computer Vision Tutorial (PyTorch)",
            resourceLink: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html",
            deliverable: "Fine-tuned classifier with >90% precision on test split.",
          },
          {
            id: "m-ai-4",
            title: "Grad-CAM Model Explainability",
            description: "Extract activation maps from the final convolutional layer to generate diagnostic heatmaps for clinician review.",
            estimatedHours: 16,
            expertTip: "Explainability is what turns an ordinary model into an award-winning academic publication.",
            resourceTitle: "Grad-CAM: Visual Explanations from Deep Networks (ArXiv 1610.02391)",
            resourceLink: "https://arxiv.org/abs/1610.02391",
            deliverable: "Interactive Grad-CAM visualizer overlaying heatmaps on test images.",
          },
        ],
      },
      {
        phaseNumber: 3,
        phaseTitle: "Model Serving & Edge Deployment",
        duration: "Weeks 9-12",
        summary: "Export models to ONNX/TorchScript, containerize with Docker, and serve predictions via FastAPI endpoints.",
        milestones: [
          {
            id: "m-ai-5",
            title: "FastAPI Model Microservice & Dockerization",
            description: "Wrap PyTorch inference logic in async FastAPI endpoints with batching and request validation.",
            estimatedHours: 15,
            expertTip: "Load your PyTorch model into memory during startup, never inside the route handler.",
            resourceTitle: "FastAPI Async Web Framework & Docker Production Guide",
            resourceLink: "https://fastapi.tiangolo.com/deployment/docker/",
            deliverable: "Docker container responding to image inference requests in <200ms.",
          },
        ],
      },
    ],
  },
  {
    id: "iot-embedded",
    slug: "iot-embedded-systems",
    title: "IoT, Embedded Firmware & Hardware Telemetry",
    badge: "Hardware & IoT",
    category: "Embedded Engineering",
    description: "Design low-power ESP32 and ARM Cortex microcontrollers, write clean C/C++ firmware, manage RTOS tasks, and stream MQTT sensor data.",
    totalWeeks: 10,
    targetYear: "1st, 2nd & 3rd Year",
    iconName: "Cpu",
    accentColor: "#839958",
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "C/C++ Microcontroller Fundamentals",
        duration: "Weeks 1-3",
        summary: "Memory management, GPIO control, interrupts, I2C/SPI protocols, and register-level programming on ESP32.",
        milestones: [
          {
            id: "m-iot-1",
            title: "Peripheral Interfacing & Analog Signal Conditioning",
            description: "Wire analog sensors, calibrate ADC readings, and implement hardware debounce routines.",
            estimatedHours: 14,
            expertTip: "Always use pull-up resistors on I2C communication lines to prevent signal floating.",
            resourceTitle: "Espressif ESP-IDF Programming Guide & Peripheral API",
            resourceLink: "https://docs.espressif.com/projects/esp-idf/en/latest/esp32/",
            deliverable: "Multi-sensor test bench reporting calibrated physical telemetry.",
          },
        ],
      },
      {
        phaseNumber: 2,
        phaseTitle: "RTOS Multithreading & Power Optimization",
        duration: "Weeks 4-7",
        summary: "Task scheduling in FreeRTOS, semaphores, queues, and deep sleep power cycling.",
        milestones: [
          {
            id: "m-iot-2",
            title: "FreeRTOS Concurrent Task Orchestration",
            description: "Create isolated tasks for sensor polling, display rendering, and network communications.",
            estimatedHours: 16,
            expertTip: "Watch out for stack overflows in tasks; allocate adequate stack depth.",
            resourceTitle: "FreeRTOS Real-Time Kernel Concepts & Practical API Reference",
            resourceLink: "https://www.freertos.org/Documentation/RTOS_book.html",
            deliverable: "Firmware binary running 3 concurrent sensor tasks without blocking.",
          },
        ],
      },
      {
        phaseNumber: 3,
        phaseTitle: "MQTT Telemetry & Edge Dashboard",
        duration: "Weeks 8-10",
        summary: "Stream telemetry securely over TLS to an MQTT broker and visualize live graphs on Next.js.",
        milestones: [
          {
            id: "m-iot-3",
            title: "Secure MQTT Cloud Ingestion",
            description: "Publish JSON telemetry packets with QoS 1 and subscribe to remote control commands.",
            estimatedHours: 14,
            expertTip: "Implement automatic WiFi reconnection logic to handle campus network drops.",
            resourceTitle: "HiveMQ MQTT Essentials & Edge Architecture Guide",
            resourceLink: "https://www.hivemq.com/mqtt-essentials/",
            deliverable: "Live environmental telemetry node with cloud dashboard.",
          },
        ],
      },
    ],
  },
  {
    id: "vlsi",
    slug: "vlsi-digital-design",
    title: "VLSI, Verilog HDL & Silicon Architecture",
    badge: "VLSI & Chips",
    category: "Hardware Systems",
    description: "Digital circuit design, Verilog HDL synthesis, timing analysis, and FPGA implementation for signal processing.",
    totalWeeks: 10,
    targetYear: "1st, 2nd & 3rd Year",
    iconName: "Layers",
    accentColor: "#105666",
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: "Digital Logic & Structural Verilog",
        duration: "Weeks 1-3",
        summary: "Combinational and sequential logic design, finite state machines (FSM), and testbench creation.",
        milestones: [
          {
            id: "m-vlsi-1",
            title: "FSM Design & Simulation Verification",
            description: "Design Moore/Mealy state machines in Verilog HDL and verify timing waveforms in ModelSim.",
            estimatedHours: 16,
            expertTip: "Separate combinational next-state logic from clocked register updates.",
            resourceTitle: "ASIC World: Verilog HDL Synthesis & Verification Guide",
            resourceLink: "http://www.asic-world.com/verilog/veritut.html",
            deliverable: "Synthesizable traffic controller FSM with self-checking testbench.",
          },
        ],
      },
      {
        phaseNumber: 2,
        phaseTitle: "Pipelined Signal Processing Cores",
        duration: "Weeks 4-7",
        summary: "FIR filter architectures, Booth multipliers, and pipelined arithmetic logic units.",
        milestones: [
          {
            id: "m-vlsi-2",
            title: "32-Tap Pipelined FIR Filter Synthesizer",
            description: "Implement fixed-point filter arithmetic with register balancing to maximize clock frequency.",
            estimatedHours: 20,
            expertTip: "Check setup and hold slack violations in Vivado static timing analysis.",
            resourceTitle: "Xilinx Vivado High-Level Synthesis & Digital Signal Processing",
            resourceLink: "https://docs.xilinx.com/v/u/en-US/ug902-vivado-high-level-synthesis",
            deliverable: "RTL netlist with power dissipation and area utilization reports.",
          },
        ],
      },
    ],
  },
];
