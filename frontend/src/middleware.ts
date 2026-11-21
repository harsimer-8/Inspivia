import { NextRequest, NextResponse } from "next/server";

/**
 * Cheap first line of defence: a visitor with no session cookies at all never reaches the
 * dashboard shell. This does NOT validate tokens - the dashboard layout calls /api/auth/me,
 * which makes the Python backend the real authority (and refreshes expired access tokens).
 */
export function middleware(req: NextRequest) {
  // The access cookie expires after minutes but the refresh cookie lasts ~2 weeks; either one means
  // "may have a session" and the dashboard layout will renew or reject it via /api/auth/me.
  const hasSession = req.cookies.has("inspivia_access") || req.cookies.has("inspivia_refresh");
  if (hasSession) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/auth/login";
  loginUrl.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/dashboard/:path*"] };
