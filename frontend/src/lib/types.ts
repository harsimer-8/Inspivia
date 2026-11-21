/** Shapes shared between the Next.js route handlers and the browser. */

export type UserRole = "STUDENT" | "MENTOR" | "ADMIN";

/** The user object the browser receives from `/api/auth/me`. It never contains tokens. */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarInitials: string;
  /** Present only once the backend exposes the student profile (see docs/05-frontend-integration.md). */
  course?: string;
  year?: string;
  enrolledTrack?: string;
}

/** Uniform error body returned by every `/api/*` route handler. */
export interface ApiErrorBody {
  error: string;
  code?: string;
  fieldErrors?: Record<string, string>;
}

export function initialsFor(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return letters || "ST";
}
