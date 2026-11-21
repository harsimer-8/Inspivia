import { NextRequest, NextResponse } from "next/server";
import { backendRequest, errorResponse, jsonError } from "@/lib/server/backend";
import { AUTH_PATHS } from "@/lib/server/authContract";
import {
  PASSWORD_MAX,
  PASSWORD_MIN,
  asString,
  isEmail,
  readJsonObject,
  rejectCrossOrigin,
} from "@/lib/server/request";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const blocked = rejectCrossOrigin(req);
  if (blocked) return blocked;

  const body = await readJsonObject(req);
  const action = asString(body?.action);

  // Phase 1: ask the backend to email a reset link.
  if (action === "request") {
    const email = asString(body?.email).trim();
    if (!isEmail(email)) return jsonError(400, "Please enter a valid email address.", "VALIDATION_ERROR");

    const result = await backendRequest(AUTH_PATHS.forgotPassword, { method: "POST", body: { email } });
    if (!result.ok && (result.status >= 500 || result.error?.code === "NOT_IMPLEMENTED")) return errorResponse(result);

    // Identical response whether or not the account exists. The token is only ever emailed.
    return NextResponse.json({
      success: true,
      message: "If your email is registered with INSPIVIA, a password reset link has been sent.",
    });
  }

  // Phase 2: set a new password using the emailed token.
  if (action === "reset") {
    const token = asString(body?.token).trim();
    const newPassword = asString(body?.newPassword);
    const confirmPassword = asString(body?.confirmPassword);

    if (!token || token.length > 512) {
      return jsonError(400, "Reset link is missing or expired. Please request a new one.", "VALIDATION_ERROR");
    }
    if (newPassword.length < PASSWORD_MIN || newPassword.length > PASSWORD_MAX) {
      return jsonError(400, `New password must be ${PASSWORD_MIN}–${PASSWORD_MAX} characters long.`, "VALIDATION_ERROR");
    }
    if (newPassword !== confirmPassword) {
      return jsonError(400, "Passwords do not match. Please re-enter identical passwords.", "VALIDATION_ERROR");
    }

    const result = await backendRequest(AUTH_PATHS.resetPassword, { method: "POST", body: { token, newPassword } });
    if (!result.ok) {
      if (result.status === 400 || result.status === 404 || result.status === 410) {
        return jsonError(400, "Invalid or expired reset link. Please request a new password reset.", "INVALID_TOKEN");
      }
      return errorResponse(result);
    }
    return NextResponse.json({ success: true, message: "Password updated. You may now sign in." });
  }

  return jsonError(400, "Invalid reset action.", "VALIDATION_ERROR");
}
