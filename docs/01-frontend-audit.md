# INSPIVIA — Stage 1: Frontend Audit & Integration Mapping

Source: `inspivia-creative-agency-website.zip` (22 source files, ~2,500 lines). Everything below comes from reading the code, not from assumptions.

## 1. What the frontend actually is

A **single-page, anchor-scrolling marketing site**. `src/app/page.tsx` is one `"use client"` page that stacks ten sections. There are **no routes besides `/`**, **no API calls (`fetch`/axios: none)**, **no auth, no global state, no env config, no shared API types**. Stack matches your brief (Next 14.2.15 App Router, React 18, TS strict, Tailwind 3, Framer Motion, GSAP, three/R3F, Lenis, lucide-react). Path alias `@/*` → `src/*`.

Design system worth preserving: 5-colour palette as CSS vars (`dark-green`, `moss-green`, `beige`, `rosy-brown`, `midnight-green`), fonts Playfair (serif), Syne (sans), Plus Jakarta (body), custom cursor driven by `data-cursor` attributes, noise overlay, Lenis smooth scroll.

## 2. Component inventory

| Component | Type | Interactions | Backend need |
|---|---|---|---|
| `layout.tsx` | Static shell | fonts, metadata (agency title/description) | Metadata copy; add `AuthProvider` |
| `page.tsx` | Client page | `introComplete` state gates Hero | Keep as marketing landing page |
| `Preloader` | Visual | percent counter, GSAP exit | None. Copy says "Creative & Digital Studio" |
| `Navbar` | Interactive | scroll state, overlay menu, smooth-scroll to `#anchors` | **Yes (UI):** needs Login/Register/Dashboard entry points and auth-aware state. Hash links only work on `/` |
| `Hero` + `HeroCanvas` | Visual/animated | 2 scroll buttons, WebGL sculpture | None (copy + hard-coded stats "48+", "14") |
| `AboutUs` | Visual (GSAP ScrollTrigger) | none | None (copy rewrite) |
| `Services` | Interactive accordion | `useState(activeId)`, CTA to `#contact` | Optional: could list real mentorship services/domains from `/domains` |
| `OurWork` | Interactive modal | select project → modal, CTA to `#contact` | Optional: project catalogue preview from `/projects` |
| `OurTeam` | Static grid | hover only | Optional: featured mentors from `/mentors` |
| `Community` | Static list | whileInView animation only | Needs product decision (see §5) |
| `ContactUs` | **Interactive form** | 4 scope chips, name/email/message state, local success screen | **Yes — only real form in the app** |
| `Footer` | Static | anchor links, mailto | None |
| `ui/*` (cursor, smooth scroll, logo) | Infrastructure | — | None |

**Static / decorative (leave alone):** Preloader, HeroCanvas, AboutUs animation, noise, cursor, logo, scroll wrapper.
**Interactive but client-only:** Navbar menu, Services accordion, OurWork modal.
**Requires backend integration:** ContactUs (now); Navbar auth entry (new); the three data-driven sections (Services/Work/Team) if you want them real.

## 3. ContactUs.tsx findings (the one integration point that exists today)

- Fields: `selectedScope` (default `"Interactive Website / 3D"`), `name`, `email`, `message`.
- Validation: HTML `required` on name+email; `handleSubmit` only sets `submitted=true`. **Nothing is sent.** Message is optional.
- Scopes are agency services: *Brand Identity & Strategy, Interactive Website / 3D, Motion & Campaign Direction, Full Digital Flagship* → **do not map to a mentorship platform**.
- Success screen promises a "response within 24 hours" (an SLA you haven't decided on) and echoes name + scope.
- No loading state, no error state, no double-submit guard, no honeypot.
- Hard-coded `hello@inspivia.studio`, "Mumbai • London • Zurich", 5 dead social links (`preventDefault`).

**Plan:** keep the layout and animation untouched; replace the scope chips with backend-served inquiry categories, add `submitting`/`error` state, call `POST /api/v1/contact`, show field errors from the standard error envelope.

## 4. Placeholder content (not real; must be replaced or removed)

All from `src/data/agencyData.ts` plus inline copy. None of it should be treated as real mentors, students, clients or projects.

| Where | Placeholder | Proposed replacement |
|---|---|---|
| `SERVICES` (4) | Brand identity, WebGL, motion, campaigns | Platform pillars: Domain Discovery, Mentor Matching, Project-Based Learning, AI Career Guidance |
| `PROJECTS` (4) | Aether Kinetics, Solis Monograph, Velora, Kronos; fake clients, "+214% Engagement", "Awwwards SOTD", "3.4x Conversion", "1.8M impressions" | Live **project catalogue** from `GET /projects`. No metrics unless real. Until seeded: hide the section rather than invent |
| `TEAM_MEMBERS` (4) | Arjun Mehta, Elena Vance, Devon Khoury, Sara Lindqvist, invented bios ("12+ years…London, Mumbai, Zurich") | **Founding team** (your real team) as static content, *and/or* featured **approved** mentors from `GET /mentors` |
| `COMMUNITY_PARTNERS` (5) | Form & Void Labs, Typographica, Monolith Sound, NextGen Creative Fellowship, Kinetic Arts Symposium | Real partners (colleges/orgs) or remove |
| Community callout | "Open Studio Residency 2026 · 18 Countries · 32 Fellows" | Remove unless real |
| Hero stats | "48+ Global Launches", "14 Design Honors" | Real counts from `GET /public/stats` (approved mentors, students, projects) or remove |
| Hero/About/Footer/metadata/Preloader copy | "Creative & Digital Experience Studio", "Interactive Monograph 2026" | Mentorship positioning |
| Contact/Navbar/Footer | `hello@inspivia.studio`, offices, socials | Your real contact details |
| Nav CTA | "Start a Project" | "Get Started" / "Find a Mentor" |

I will **not** seed fake mentors, students, or stats into the database (your rule #6). Empty states will be designed instead.

## 5. Community section — what a real community would need

Today it is a decorative partner list. Your brief says not to invent features, so:

- **Implement now:** nothing beyond optionally serving partner logos/names from static config.
- **Proposed separately (needs your approval):** discussion forum/Q&A, cohort groups, events/webinars, mentor office hours listing, newsletter signup, achievements/leaderboard. Each implies moderation, reporting, and abuse handling, so it's a separate phase.

## 6. Frontend–backend integration mapping

| Frontend element | Backend API | Status |
|---|---|---|
| ContactUs form | `POST /api/v1/contact`, `GET /api/v1/contact/categories` | Exists in UI, wire up |
| Navbar auth entry | `GET /auth/me`, `POST /auth/logout` | New UI |
| Services (optional) | `GET /domains` | Optional |
| OurWork (optional) | `GET /projects?featured=true` | Optional |
| OurTeam (optional) | `GET /mentors?featured=true` | Optional |
| Hero stats (optional) | `GET /public/stats` | Optional |

### New pages required (none exist)
`/register/student`, `/register/mentor`, `/login`, `/verify-email`, `/forgot-password`, `/reset-password`, `/dashboard` (student), `/mentor` (mentor dashboard), `/admin`, `/ai` (AI mentor chat + recommendations), `/projects` and `/projects/[id]` (catalogue/detail/progress), `/mentors` and `/mentors/[id]`. Marketing visuals stay on `/`.

### Technical issues to handle in the integration layer
1. Hash anchors (`#contact`) only work on `/`. Nav links on other routes must become `/#contact`.
2. `page.tsx` is a client component; fine for now, but auth-aware Navbar should read from a context provider mounted in `layout.tsx`.
3. `CustomCursor`/`SmoothScroll`/noise overlay are global in `layout.tsx` and would affect dashboards. Dashboards should be a route group `(app)` with a lighter layout (no Preloader, cursor optional) while reusing the palette.
4. No `.env`, no API client, no shared types → add `src/lib/api/*`, `.env.example` with `NEXT_PUBLIC_API_BASE_URL`.
5. `next.config.mjs` has no rewrites/headers; add a dev rewrite for `/api/v1/*` (see architecture).

## 7. Missing product decisions & my working assumptions

| # | Decision needed | Assumption I'll use unless you say otherwise |
|---|---|---|
| 1 | One role per user? | Yes: `users.role` enum (STUDENT/MENTOR/ADMIN) |
| 2 | Mentor signup vs "apply" | Registering as mentor creates user + `MentorApplication(PENDING)`; mentor cannot be matched or listed until ADMIN approves. Existing student accounts upgrading to mentor is **not** supported in v1, so `POST /mentors/apply` is dropped |
| 3 | Can mentors self-publish projects? | Mentors create projects in `DRAFT`; ADMIN approves to `PUBLISHED` |
| 4 | Mentorship initiation | Student requests → mentor accepts/declines; max active mentors per student = 1 (configurable) |
| 5 | Sessions | Scheduling records only (time, link, notes). No built-in video |
| 6 | Email provider | SMTP via Spring Mail; MailHog in dev |
| 7 | LLM provider | Anthropic as default behind a provider interface; key via env |
| 8 | Contact "24 hour" promise | Removed from UI copy unless you commit to it |
| 9 | Data residency/privacy policy, minors | Not designed; students may be under 18 → needs decision before launch |
| 10 | Admin bootstrap | First admin created from env vars on startup (never a hard-coded password) |
