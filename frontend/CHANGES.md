# INSPIVIA — Change Log

## New
- `src/components/motion/InspiviaJourney.tsx` — "The INSPIVIA Journey" timeline (home page, after the stats section). Content: `JOURNEY_MILESTONES` in `src/data/inspiviaData.ts`.
- `src/components/sections/FounderSection.tsx` — "Meet the Founder" (About page, after the story timeline). Photo / name / LinkedIn.
- `src/components/ui/FounderPortrait.tsx` — shows the founder photo; falls back to "WS" monogram if the file is missing.
- `src/components/motion/FeedbackFlashcards.tsx` — closed "Student Feedback" box; click -> all feedback open as flashcards (Community page).

## Founder photo
Put the photo at `public/team/wallabhi-saxena.jpg` (square, min 600x600). No code change needed.

## Renamed
- Quaithe -> "AI Companion" everywhere (text, metadata, keywords, comments, identifiers).
- Routes: `/dashboard/quaithe` -> `/dashboard/ai-companion`, `/api/quaithe` -> `/api/ai-companion`.
- "Senior" -> "Expert" in all display text.
- Super 30 -> Super 50. (Kept "Super 30" only in the About-story sentence about the original pilot cohort, and in the Journey title "Super 30 to Super 50".)
- "27+ projects" -> "500+ projects" (home stats, services page, services card, About story).
- All "Banasthali Vidyapith" mentions removed.

## Links
- Founder LinkedIn: https://www.linkedin.com/in/wallabhi-saxena-8a84b4248/
- Company LinkedIn + Instagram: footer icons and About page founder section.

## Professional-wording fixes
- Removed visible placeholder text: "Photo Slot: /public/team/..." (Team page) and "Slot: /public/campaigns/..." (Work page).
- Removed claim "fine-tuned" for the AI companion (it is a prompted model, not fine-tuned) -> "built for".
- Chat footer label "Gemini 1.5 Flash (Verified Server Key)" -> "INSPIVIA AI Engine".
- "Wallabhi Didi" in system copy -> "Wallabhi Saxena".
- Footer social icons: removed generic GitHub / Discord / X links (they pointed to the sites' homepages).
- Founder card "EST. 2024" (also in preloader) -> "EST. 2026" to match the Journey launch date.
- Placeholder email "ananya@banasthali.in" -> "ananya@university.edu".

## Backend integration (feature/frontend-backend-integration)
- Mock auth (`lib/auth.ts`, in-memory students, demo account) removed. Auth now goes through server route handlers to the Python backend using HttpOnly JWT cookies.
- AI companion calls `POST /api/v1/ai/chat` via the backend; no direct Gemini calls.
- New: `lib/api.ts`, `lib/session-context.tsx`, `lib/server/*`, `middleware.ts`, `.env.example`.
- See `docs/05-frontend-integration.md` for the contract, missing backend endpoints and deployment steps.
