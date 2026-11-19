import { NextRequest, NextResponse } from "next/server";
import { findStudentByVerificationToken, findStudentByEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, email } = body;

    if (!token && !email) {
      return NextResponse.json(
        { error: "Verification token or student email is required." },
        { status: 400 }
      );
    }

    let student = token ? findStudentByVerificationToken(token) : null;
    if (!student && email) {
      student = findStudentByEmail(email) || null;
    }

    if (!student) {
      return NextResponse.json(
        { error: "Invalid verification link or student not found." },
        { status: 404 }
      );
    }

    student.isEmailVerified = true;
    student.verificationToken = undefined;

    return NextResponse.json({
      success: true,
      message: "Student email has been verified. Welcome to the INSPIVIA network!",
      email: student.email,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An error occurred during email verification." },
      { status: 500 }
    );
  }
}
