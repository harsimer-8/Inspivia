# INSPIVIA — Student Mentorship & Project-Building Platform

> **"Don't Just Learn. Build With Direction."**

INSPIVIA is a premium, highly interactive student mentorship and project-building platform designed to help engineering students overcome confusion, break tutorial paralysis, and build portfolio-grade proof of work from Day 1.

Founded by **Wallabhi Saxena**, Inspivia pioneered the **Super 50** cohort and **NextYou** initiatives, achieving a 100% project delivery rate across hardware IoT, neural computer vision, web systems, and VLSI digital design.

---

## 🎨 Architectural Design System & Brand Palette

The platform adheres to a strict 5-color architectural token system:

| Token Name | CSS Variable | Hex Code | Purpose |
|---|---|---|---|
| **Forest Green** | `--color-forest-green` | `#0A3323` | Canvas background, immersive dark hero, footer |
| **Moss Green** | `--color-moss-green` | `#839958` | Subheadings, badges, success chips, active nodes |
| **Beige** | `--color-beige` | `#F7F4D5` | Primary light text, high-contrast editorial surfaces |
| **Rosy Brown** | `--color-rosy-brown` | `#D3968C` | Primary CTAs, key accent buttons, metrics, glows |
| **Midnight Green** | `--color-midnight-green` | `#105666` | Elevated cards, AI companion theme |

### Typography
- **Headings & Accents:** Playfair Display (Serif), Syne (Display), Manrope
- **Interface & Code:** Manrope, Inter, JetBrains / System Monospace

---

## 🚀 Key Features

### 1. Public Experience
- **Hero & 3D Interactive Sculpture (`/`):** React Three Fiber WebGL sculpture reacting to cursor tilt and scroll with distorted Icosahedron core, Rosy Brown and Moss Green orbital rings, and satellite nodes.
- **Signature Flashcard Animation:** Scroll-driven alternating entry from left and right viewports assembling into a clean ordered deck explaining:
  1. *Discover* — Untangle confusion, diagnose skills.
  2. *Learn* — Curated expert roadmaps without tutorial fluff.
  3. *Build* — 1-on-1 mentor guidance & AI Companion code companion.
  4. *Grow* — Ship live demos, file provisional patents, pass the torch.
- **Horizontal Sliding Project Showcase:** Categorized hardware, AI, web, and VLSI projects with interactive modal inspection.
- **Authentic Student Community (`/community`):** 27 verified testimonials from Super 50 scholars with search and category filtering.
- **Origin Story (`/about`):** The true story of a 1st-year student asking *"How do I start building real projects?"* and the gap in traditional collegiate guidance.
- **Leadership & Founder (`/team`):** Founder profile for **Wallabhi Saxena** with verified credentials and expert leads across AI, Web, IoT, and VLSI.
- **Contact Us (`/contact`):** Validated inquiry form, office hours, and interactive FAQ accordion.

### 2. Protected Student Product Suite
- **Real Authentication (`/auth/login` & `/auth/register`):** Secure cookie sessions, domain verification, demo account launcher.
- **Student Dashboard (`/dashboard`):** Active cohort sprint tracker, streak monitor, milestone progression.
- **AI Project Companion (`/dashboard/ai-companion`):** 24/7 intelligent project ideation, architectural blueprints, compiler bug resolution, and patent guidance.
- **Personalized Learning Roadmaps (`/dashboard/roadmap`):** Multi-week milestones for Full-Stack Web, AI/ML, IoT/Hardware, and VLSI with completion toggles and expert tips.
- **Curated Project Matchmaker (`/dashboard/projects`):** Level-rated problem statements (Explorer, Builder, Innovator) with ready-to-fork starter templates.
- **Mentor Discovery & Booking (`/dashboard/mentors`):** Expert mentor office hour reservation modal with time-slot selection and Google Meet links.

---

## 🛠️ Tech Stack & Dependencies

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.6
- **Styling:** Tailwind CSS 3.4
- **3D & Canvas:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animation & Motion:** Framer Motion 11, GSAP 3.12, Lenis smooth scroll
- **Icons:** Lucide React

---

## 💻 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open browser
http://localhost:3000
```

### Demo Student Credentials
- **Email:** `student@inspivia.org`
- **Password:** `inspivia2026`
*(Or sign up with any valid student email for instant session access)*

---

## 📸 Asset Drop-In Guidelines
- **Founder Photo:** Place `wallabhi-saxena.jpg` into `public/team/wallabhi-saxena.jpg`.
- **Team Photos:** Drop individual expert portraits into `public/team/{mentor-id}.jpg`.
