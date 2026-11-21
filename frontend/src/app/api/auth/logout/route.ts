import { NextRequest, NextResponse } from "next/server";
import { backendRequest } from "@/lib/server/backend";
import { AUTH_PATHS } from "@/lib/server/authContract";
import { rejectCrossOrigin } from "@/lib/server/request";
import { clearSessionCookies, readSession } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const blocked = rejectCrossOrigin(req);
  if (blocked) return blocked;

  const { accessToken, refreshToken } = readSession(req);

  // Best effort: ask the backend to revoke the refresh-token family. Local sign-out must
  // succeed even if the backend is unreachable or has no logout endpoint yet.
  if (refreshToken) {
    await backendRequest(AUTH_PATHS.logout, { method: "POST", body: { refreshToken }, token: accessToken });
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  clearSessionCookies(response);
  return response;
}
