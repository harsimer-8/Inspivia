import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/server/backend";
import { AUTH_PATHS, toSessionUser } from "@/lib/server/authContract";
import { authedBackendCall, withSession } from "@/lib/server/proxy";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return withSession(req, authedBackendCall(AUTH_PATHS.me), (result) => {
    const user = toSessionUser(result.data);
    if (!user) return jsonError(502, "Could not load your account. Please try again.", "BAD_UPSTREAM_RESPONSE");
    return NextResponse.json({ authenticated: true, user });
  });
}
