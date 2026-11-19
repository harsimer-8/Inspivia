export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  domain: string;
  experience: string;
  institution: string;
  bio: string;
  initials: string;
  rating: number;
  reviewsCount: number;
  availableDays: string[];
  sessionSlots: string[];
  skills: string[];
  accentColor: string;
  isFounder?: boolean;
}

export const MENTORS_LIST: MentorProfile[] = [
  {
    id: "wallabhi-saxena",
    name: "Wallabhi Saxena",
    role: "Founder & Lead Mentor",
    domain: "Systems Leadership, Patents & Project Strategy",
    experience: "Founder, Inspivia / Super 50 Lead",
    institution: "INSPIVIA Mentor Network",
    bio: "Pioneer of Inspivia and Super 50. Guides students from Day 1 on how to overcome initial hesitation, choose ambitious projects, draft provisional patents, and cultivate engineering discipline.",
    initials: "WS",
    rating: 5.0,
    reviewsCount: 30,
    availableDays: ["Monday", "Wednesday", "Saturday"],
    sessionSlots: ["4:00 PM - 5:00 PM", "6:30 PM - 7:30 PM", "8:00 PM - 9:00 PM"],
    skills: ["Project Ideation", "Patents", "Career Strategy", "Architecture Review"],
    accentColor: "#D3968C",
    isFounder: true,
  },
  {
    id: "oorja-tiwari",
    name: "Oorja Tiwari",
    role: "Expert Lead Mentor",
    domain: "Artificial Intelligence & Signal Processing",
    experience: "3rd Year ECE Lead",
    institution: "INSPIVIA Mentor Network",
    bio: "Rebuilding genuine mentor-mentee connections. Specializes in guiding 1st and 2nd years in neural networks, computer vision, and wireless communications without confusing jargon.",
    initials: "OT",
    rating: 4.9,
    reviewsCount: 22,
    availableDays: ["Tuesday", "Thursday", "Sunday"],
    sessionSlots: ["5:00 PM - 6:00 PM", "7:00 PM - 8:00 PM"],
    skills: ["PyTorch", "Computer Vision", "Wireless Communications", "Signal Processing"],
    accentColor: "#105666",
  },
  {
    id: "pratiksha-khare",
    name: "Pratiksha Khare",
    role: "Expert Lead Mentor",
    domain: "Full-Stack Web & Backend Engineering",
    experience: "2nd Year CS Lead",
    institution: "INSPIVIA Mentor Network",
    bio: "Patient mentor with a focus on practical solutions. Helps students overcome code bugs, design relational schemas, and build polished, production-ready web platforms.",
    initials: "PK",
    rating: 4.9,
    reviewsCount: 19,
    availableDays: ["Monday", "Friday", "Saturday"],
    sessionSlots: ["3:30 PM - 4:30 PM", "6:00 PM - 7:00 PM"],
    skills: ["React & Next.js", "Node.js", "PostgreSQL", "API Security"],
    accentColor: "#839958",
  },
  {
    id: "archi-gupta",
    name: "Archi Gupta",
    role: "Lead Hardware Mentor",
    domain: "IoT, Embedded C++ & Microcontrollers",
    experience: "ECE Hardware Specialist",
    institution: "INSPIVIA Mentor Network",
    bio: "Hands-on guide for microcontroller circuits, sensor calibration, FreeRTOS, and MQTT telemetry. Loves turning breadboard prototypes into enclosed hardware products.",
    initials: "AG",
    rating: 4.8,
    reviewsCount: 16,
    availableDays: ["Wednesday", "Saturday", "Sunday"],
    sessionSlots: ["4:30 PM - 5:30 PM", "7:30 PM - 8:30 PM"],
    skills: ["ESP32", "C / C++", "Circuit Design", "MQTT Telemetry"],
    accentColor: "#0A3323",
  },
  {
    id: "tanishka-awasthi",
    name: "Tanishka Awasthi",
    role: "Lead Portfolio Mentor",
    domain: "Frontend Motion & Creative Engineering",
    experience: "2nd Year CS Portfolio Architect",
    institution: "INSPIVIA Mentor Network",
    bio: "Guides students to build distinctive, animated portfolio websites that immediately stand out to recruiters and academic reviewers.",
    initials: "TA",
    rating: 4.9,
    reviewsCount: 18,
    availableDays: ["Thursday", "Friday", "Sunday"],
    sessionSlots: ["5:30 PM - 6:30 PM", "8:00 PM - 9:00 PM"],
    skills: ["Tailwind CSS", "Framer Motion", "UI/UX Systems", "Portfolio Strategy"],
    accentColor: "#D3968C",
  },
];
