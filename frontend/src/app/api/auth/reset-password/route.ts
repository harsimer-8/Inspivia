import { NextRequest, NextResponse } from "next/server";
import { findStudentByEmail, findStudentByResetToken, hashPassword } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, token, newPassword, confirmPassword } = body;

    // Phase 1: Request Password Reset Link
    if (action === "request") {
      if (!email || !email.includes("@")) {
        return NextResponse.json(
          { error: "Please enter a valid student email address." },
          { status: 400 }
        );
      }

      const student = findStudentByEmail(email);
      if (!student) {
        // Return friendly message even if email not found to prevent user enumeration
        return NextResponse.json({
          success: true,
          message: "If your email is registered with INSPIVIA, a password reset link has been dispatched.",
        });
      }

      // Generate reset token valid for 1 hour
      const resetToken = randomBytes(20).toString("hex");
      student.resetPasswordToken = resetToken;
      student.resetPasswordExpires = Date.now() + 3600000; // 1 hr

      return NextResponse.json({
        success: true,
        message: "Password reset instructions generated.",
        resetToken, // Returned for UI testing / preview flow
      });
    }

    // Phase 2: Complete Password Reset with New Password
    if (action === "reset") {
      if (!token) {
        return NextResponse.json(
          { error: "Reset token is missing or expired. Please request a new link." },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: "Passwords do not match. Please re-enter identical passwords." },
          { status: 400 }
        );
      }

      const student = findStudentByResetToken(token);
      if (!student) {
        return NextResponse.json(
          { error: "Invalid or expired reset token. Please request a new password reset." },
          { status: 400 }
        );
      }

      // Hash new password securely
      const { hash, salt } = hashPassword(newPassword);
      student.passwordHash = hash;
      student.salt = salt;
      student.resetPasswordToken = undefined;
      student.resetPasswordExpires = undefined;

      return NextResponse.json({
        success: true,
        message: "Password has been successfully updated. You may now Sign In.",
      });
    }

    return NextResponse.json({ error: "Invalid reset action specified." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An error occurred while processing password reset." },
      { status: 500 }
    );
  }
}
