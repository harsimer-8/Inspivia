import "server-only";
import type { NextRequest, NextResponse } from "next/server";
import { jsonError } from "./backend";

/**
 * CSRF defence in depth on top of SameSite=Lax cookies: state-changing requests must come from
 * our own origin. Requests without an Origin header (non-browser clients) are allowed because
 * they carry no ambient browser credentials.
 */
export function rejectCrossOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin");
  if (!origin) return null;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    if (host && new URL(origin).host === host) return null;
  } catch {
    /* fall through */
  }
  return jsonError(403, "Cross-origin request blocked.", "CSRF_BLOCKED");
}

/** Parses a JSON object body; returns null for malformed or non-object payloads. */
export async function readJsonObject(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await req.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const asString = (value: unknown): string => (typeof value === "string" ? value : "");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (value: string): boolean => value.length <= 254 && EMAIL_PATTERN.test(value);

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
