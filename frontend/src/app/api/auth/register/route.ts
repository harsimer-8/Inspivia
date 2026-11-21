import { NextRequest, NextResponse } from "next/server";
import { backendRequest, errorResponse, jsonError } from "@/lib/server/backend";
import { AUTH_PATHS, toRegistrationBody } from "@/lib/server/authContract";
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
  const name = asString(body?.name).trim();
  const email = asString(body?.email).trim();
  const password = asString(body?.password);
  const confirmPassword = asString(body?.confirmPassword);
  const college = asString(body?.college).trim();
  const course = asString(body?.course).trim();
  const year = asString(body?.year).trim();

  if (name.length < 2 || name.length > 120) {
    return jsonError(400, "Please enter your full name (2–120 characters).", "VALIDATION_ERROR", { name: "Invalid name" });
  }
  if (!isEmail(email)) {
    return jsonError(400, "Please provide a valid email address.", "VALIDATION_ERROR", { email: "Invalid email" });
  }
  if (college.length < 2 || college.length > 200) {
    return jsonError(400, "Please enter your college or institution.", "VALIDATION_ERROR", { college: "Required" });
  }
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return jsonError(400, `Password must be ${PASSWORD_MIN}–${PASSWORD_MAX} characters long.`, "VALIDATION_ERROR", {
      password: "Invalid length",
    });
  }
  if (password !== confirmPassword) {
    return jsonError(400, "Passwords do not match. Please re-enter your password.", "VALIDATION_ERROR");
  }
  if (body?.terms !== true) {
    return jsonError(400, "You must accept the Inspivia Student Mentorship Terms & Honor Code.", "VALIDATION_ERROR");
  }

  const result = await backendRequest(AUTH_PATHS.registerStudent, {
    method: "POST",
    body: toRegistrationBody({ name, email, password, college, course, year }),
  });
  if (!result.ok) return errorResponse(result);

  // The backend plan creates accounts as PENDING_VERIFICATION, so registration does NOT sign the user in.
  return NextResponse.json({
    success: true,
    message: "Account created. Check your inbox for a verification link to activate it.",
    email,
  });
}
