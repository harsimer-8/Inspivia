import { NextRequest, NextResponse } from "next/server";
import { backendRequest, errorResponse, jsonError } from "@/lib/server/backend";
import { AUTH_PATHS, extractTokens, toSessionUser } from "@/lib/server/authContract";
import { asString, isEmail, readJsonObject, rejectCrossOrigin } from "@/lib/server/request";
import { setSessionCookies } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const blocked = rejectCrossOrigin(req);
  if (blocked) return blocked;

  const body = await readJsonObject(req);
  const email = asString(body?.email).trim();
  const password = asString(body?.password);

  if (!email || !password) return jsonError(400, "Email and password are required.", "VALIDATION_ERROR");
  if (!isEmail(email)) return jsonError(400, "Please enter a valid email address.", "VALIDATION_ERROR");

  const login = await backendRequest(AUTH_PATHS.login, { method: "POST", body: { email, password } });
  if (!login.ok) {
    // Do not reveal whether the account exists or which credential was wrong.
    if (login.status === 401 || login.status === 403) {
      return jsonError(401, "Invalid email or password, or the account isn't verified yet.", "INVALID_CREDENTIALS");
    }
    return errorResponse(login);
  }

  const tokens = extractTokens(login.data);
  if (!tokens) {
    console.error("[auth] login response did not contain an access token");
    return jsonError(502, "Sign-in failed. Please try again later.", "BAD_UPSTREAM_RESPONSE");
  }

  const me = await backendRequest(AUTH_PATHS.me, { token: tokens.accessToken });
  const user = me.ok ? toSessionUser(me.data) : null;
  if (!user) return me.ok ? jsonError(502, "Sign-in failed. Please try again later.", "BAD_UPSTREAM_RESPONSE") : errorResponse(me);

  const response = NextResponse.json({ success: true, user });
  setSessionCookies(response, tokens);
  return response;
}
