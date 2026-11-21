import { NextRequest, NextResponse } from "next/server";
import { backendRequest, errorResponse, jsonError } from "@/lib/server/backend";
import { AUTH_PATHS } from "@/lib/server/authContract";
import { asString, isEmail, readJsonObject, rejectCrossOrigin } from "@/lib/server/request";

export const dynamic = "force-dynamic";

/**
 * POST { token }            -> verify an email using the emailed token
 * POST { resend: true, email } -> request a fresh verification email
 */
export async function POST(req: NextRequest) {
  const blocked = rejectCrossOrigin(req);
  if (blocked) return blocked;

  const body = await readJsonObject(req);

  if (body?.resend === true) {
    const email = asString(body.email).trim();
    if (!isEmail(email)) return jsonError(400, "Please enter a valid email address.", "VALIDATION_ERROR");
    const result = await backendRequest(AUTH_PATHS.resendVerification, { method: "POST", body: { email } });
    // Same answer whether or not the account exists, to prevent account enumeration.
    if (!result.ok && result.status >= 500) return errorResponse(result);
    if (!result.ok && result.error?.code === "NOT_IMPLEMENTED") return errorResponse(result);
    return NextResponse.json({
      success: true,
      message: "If that email has an unverified account, a new verification link is on its way.",
    });
  }

  const token = asString(body?.token).trim();
  if (token.length < 20 || token.length > 256) {
    return jsonError(400, "This verification link is missing or invalid. Request a new one below.", "VALIDATION_ERROR");
  }
  const result = await backendRequest(AUTH_PATHS.verifyEmail, { method: "POST", body: { token } });
  if (!result.ok) {
    if (result.status === 400 || result.status === 404 || result.status === 410 || result.status === 422) {
      return jsonError(400, "This verification link is invalid or has expired. Request a new one below.", "INVALID_TOKEN");
    }
    return errorResponse(result);
  }
  return NextResponse.json({
    success: true,
    message: "Your email has been verified. You can now sign in.",
  });
}
