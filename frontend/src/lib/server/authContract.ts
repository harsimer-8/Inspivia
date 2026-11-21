import "server-only";
import type { SessionUser, UserRole } from "@/lib/types";
import { initialsFor } from "@/lib/types";
import type { TokenPair } from "./session";

/**
 * ---------------------------------------------------------------------------------------------
 *  AUTH CONTRACT  -  *** NOT YET IMPLEMENTED BY THE BACKEND ***
 * ---------------------------------------------------------------------------------------------
 * backend/app/main.py currently serves only /api/v1/ai/* and /actuator/*. The /api/v1/auth/*
 * paths below are whitelisted by its JWT middleware but have no handlers, and docs/*.md list
 * them as planned without request/response schemas.
 *
 * Everything the frontend assumes about those endpoints is confined to THIS FILE so that, once
 * the backend ships them, any mismatch is fixed here and nowhere else. The assumed contract is
 * written out in docs/05-frontend-integration.md, which the backend owner should confirm or
 * change. Field names follow the camelCase convention of the existing frontend-facing AI API.
 * ---------------------------------------------------------------------------------------------
 */

export const AUTH_PATHS = {
  login: "/auth/login",
  registerStudent: "/auth/register/student",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  me: "/auth/me",
  verifyEmail: "/auth/verify-email",
  resendVerification: "/auth/resend-verification",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
} as const;

/** ASSUMED: login and refresh respond with these fields in the JSON body. */
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

/** ASSUMED: GET /auth/me returns { id, email, fullName, role }. */
interface MeResponse {
  id?: string;
  email?: string;
  fullName?: string;
  role?: string;
}

export function toSessionUser(data: unknown): SessionUser | null {
  const me = (data ?? {}) as MeResponse;
  if (!me.id || !me.email) return null;
  const name = me.fullName?.trim() || me.email.split("@")[0];
  const role: UserRole = me.role === "MENTOR" || me.role === "ADMIN" ? me.role : "STUDENT";
  return { id: me.id, email: me.email, name, role, avatarInitials: initialsFor(name) };
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
 * ASSUMED request body for POST /auth/register/student. Field choices come from the
 * `users` and `student_profiles` columns in V1__init_schema.sql (full_name, college, degree,
 * current_year 1-8). The frontend's "track" is intentionally NOT sent: its values (IoT, VLSI...)
 * have no counterpart in the backend `domains` taxonomy (V2 seed).
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
