import "server-only";
import type { SessionUser, UserRole } from "@/lib/types";
import { initialsFor } from "@/lib/types";
import type { TokenPair } from "./session";

/**
 * Auth contract as implemented by backend/app/auth.py (commit eb4b0f7). Every backend path and
 * field name the frontend relies on for authentication is confined to this file, so a backend
 * change is a one-file fix here. See docs/05-frontend-integration.md.
 */

export const AUTH_PATHS = {
  login: "/auth/login",
  registerStudent: "/auth/register/student",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  me: "/auth/me",
  studentProfile: "/students/me",
  verifyEmail: "/auth/verify-email",
  resendVerification: "/auth/resend-verification",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
} as const;

/** POST /auth/login and /auth/refresh respond with these fields in the JSON body. */
interface TokenResponse {
  accessToken?: string;
  refreshToken?: string;
}

export function extractTokens(data: unknown): TokenPair | null {
  const body = (data ?? {}) as TokenResponse;
  if (typeof body.accessToken !== "string" || !body.accessToken) return null;
  return {
    accessToken: body.accessToken,
    refreshToken: typeof body.refreshToken === "string" && body.refreshToken ? body.refreshToken : undefined,
  };
}

/** GET /auth/me -> { id, email, fullName, role } */
interface MeResponse {
  id?: string;
  email?: string;
  fullName?: string;
  role?: string;
}

/** GET /students/me -> { college, degree, currentYear, selectedDomain (a domain slug or null) } */
export interface StudentProfileResponse {
  college?: string;
  degree?: string;
  currentYear?: number;
  selectedDomain?: string | null;
}

export function toSessionUser(data: unknown, profile?: StudentProfileResponse | null): SessionUser | null {
  const me = (data ?? {}) as MeResponse;
  if (!me.id || !me.email) return null;
  const name = me.fullName?.trim() || me.email.split("@")[0];
  const role: UserRole = me.role === "MENTOR" || me.role === "ADMIN" ? me.role : "STUDENT";
  return {
    id: me.id,
    email: me.email,
    name,
    role,
    avatarInitials: initialsFor(name),
    course: profile?.degree || undefined,
    year: profile?.currentYear ? yearLabel(profile.currentYear) : undefined,
    enrolledTrack: profile?.selectedDomain ? domainLabel(profile.selectedDomain) : undefined,
  };
}

/** 1 -> "1st Year", 2 -> "2nd Year", 4 -> "4th Year" (matches the register form's labels). */
export function yearLabel(year: number): string {
  const suffix = year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th";
  return `${year}${suffix} Year`;
}

const ACRONYMS = new Set(["ai", "ml", "iot", "vlsi", "ui", "ux"]);

/** The API only returns a domain slug ("ai-ml"); turn it into a display label ("AI ML"). */
export function domainLabel(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => (ACRONYMS.has(part) ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)))
    .join(" ");
}

export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
  college: string;
  course: string;
  year: string;
}

/**
 * Request body for POST /auth/register/student. The frontend's "track" is intentionally NOT sent
 * (as `selectedDomain` or otherwise): its labels (IoT, VLSI, ...) are not yet mapped to backend
 * domain slugs, and the backend asked us to send it only once that mapping is agreed.
 */
export function toRegistrationBody(input: RegistrationInput) {
  return {
    fullName: input.name,
    email: input.email,
    password: input.password,
    college: input.college,
    degree: input.course,
    currentYear: yearToNumber(input.year),
  };
}

export function yearToNumber(label: string): number {
  const parsed = Number.parseInt(label, 10); // "2nd Year" -> 2
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 8 ? parsed : 1;
}
