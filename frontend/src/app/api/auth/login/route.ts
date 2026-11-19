import { NextRequest, NextResponse } from "next/server";
import { findStudentByEmail, verifyPassword, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const student = findStudentByEmail(email);

    if (!student) {
      return NextResponse.json(
        { error: "No student account found with this email. Please check your credentials or register." },
        { status: 401 }
      );
    }

    // Verify hashed password
    const isPasswordValid = verifyPassword(password, student.passwordHash, student.salt);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid password. Please verify and try again." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        course: student.course,
        year: student.year,
        enrolledTrack: student.enrolledTrack,
        avatarInitials: student.avatarInitials,
      },
    });

    // Set secure HTTP-only session cookie
    response.cookies.set(AUTH_COOKIE_NAME, student.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
