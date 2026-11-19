import { NextRequest, NextResponse } from "next/server";
import { registerStudent, AUTH_COOKIE_NAME, findStudentByEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword, course, year, track, terms } = body;

    // Strict Validations
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full legal name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please provide a valid student or institutional email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match. Please re-enter your password." },
        { status: 400 }
      );
    }

    if (!terms) {
      return NextResponse.json(
        { error: "You must accept the Inspivia Student Mentorship Terms & Honor Code." },
        { status: 400 }
      );
    }

    if (findStudentByEmail(email)) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please Sign In instead." },
        { status: 409 }
      );
    }

    // Register with securely hashed password
    const student = registerStudent({
      name,
      email,
      password,
      course: course || "B.Tech Computer Science",
      year: year || "1st Year",
      track: track || "Full-Stack Web & Cloud Architecture",
    });

    const response = NextResponse.json({
      success: true,
      message: "Registration completed successfully. Welcome to INSPIVIA!",
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during student registration." },
      { status: 500 }
    );
  }
}
