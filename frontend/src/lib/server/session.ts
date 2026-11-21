import "server-only";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Session cookies. Tokens live only in HttpOnly cookies, so browser JavaScript can never read them.
 *   inspivia_access  - access JWT (short-lived), sent to the backend as a Bearer token.
 *   inspivia_refresh - opaque refresh token. Sent only to our own route handlers (never to the
 *                      backend by the browser) so any /api/* handler can transparently renew an
 *                      expired access token.
 */
export const ACCESS_COOKIE = "inspivia_access";
export const REFRESH_COOKIE = "inspivia_refresh";

const FALLBACK_ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_SECONDS = 14 * 24 * 60 * 60;
/** Treat a token as expired slightly early so we never forward one that dies in flight. */
const EXPIRY_SKEW_SECONDS = 10;

export interface TokenPair {
  accessToken: string;
  refreshToken?: string;
}

export interface Session {
  accessToken?: string;
  refreshToken?: string;
}

const secure = () => process.env.NODE_ENV === "production";

export function readSession(req: NextRequest): Session {
  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;
  return {
    accessToken: access && !isExpired(access) ? access : undefined,
    refreshToken: refresh || undefined,
  };
}

export function setSessionCookies(res: NextResponse, tokens: TokenPair): void {
  const accessMaxAge = secondsUntilExpiry(tokens.accessToken) ?? FALLBACK_ACCESS_TTL_SECONDS;
  res.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure: secure(),
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(accessMaxAge, 1),
  });
  if (tokens.refreshToken) {
    res.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
      httpOnly: true,
      secure: secure(),
      sameSite: "lax",
      // Path "/" (not "/api/auth") so that /api/ai-companion and other handlers receive it and can
      // renew an expired access token. It is HttpOnly, so page scripts still cannot read it.
      path: "/",
      maxAge: REFRESH_TTL_SECONDS,
    });
  }
}

export function clearSessionCookies(res: NextResponse): void {
  res.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, secure: secure(), sameSite: "lax", path: "/", maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { httpOnly: true, secure: secure(), sameSite: "lax", path: "/", maxAge: 0 });
}

/**
 * Reads the `exp` claim WITHOUT verifying the signature. This is only used to decide when to
 * refresh and when to expire the cookie; the backend remains the sole authority on token validity.
 */
function secondsUntilExpiry(jwt: string): number | null {
  try {
    const payload = jwt.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof json.exp === "number" ? Math.floor(json.exp - Date.now() / 1000) : null;
  } catch {
    return null;
  }
}

function isExpired(jwt: string): boolean {
  const remaining = secondsUntilExpiry(jwt);
  return remaining !== null && remaining <= EXPIRY_SKEW_SECONDS;
}
