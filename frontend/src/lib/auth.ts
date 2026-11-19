import { createHash, randomBytes } from "crypto";

export interface StudentUser {
  id: string;
  email: string;
  name: string;
  course: string;
  year: string;
  enrolledTrack: string;
  avatarInitials: string;
  registeredAt: string;
  isEmailVerified: boolean;
  passwordHash: string;
  salt: string;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  completedMilestones: string[];
  activeProject?: string;
  upcomingSession?: {
    mentorName: string;
    mentorRole: string;
    topic: string;
    date: string;
    time: string;
    status: "Confirmed" | "Completed" | "Pending";
  };
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || randomBytes(16).toString("hex");
  const hash = createHash("sha256")
    .update(password + generatedSalt)
    .digest("hex");
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computed = createHash("sha256")
    .update(password + salt)
    .digest("hex");
  return computed === hash;
}

// Default seeded student with secure hashed password ("inspivia2026")
const demoCredentials = hashPassword("inspivia2026", "inspivia_static_salt_001");

export const DEMO_STUDENT: StudentUser = {
  id: "std-001",
  email: "student@inspivia.org",
  name: "Ananya Sharma",
  course: "B.Tech Computer Science & Engineering",
  year: "2nd Year",
  enrolledTrack: "Full-Stack Web & Cloud Architecture",
  avatarInitials: "AS",
  registeredAt: "2026-08-15",
  isEmailVerified: true,
  passwordHash: demoCredentials.hash,
  salt: demoCredentials.salt,
  completedMilestones: ["m-web-1", "m-web-2"],
  activeProject: "EcoPulse: Ambient Micro-Telemetry Node",
  upcomingSession: {
    mentorName: "Wallabhi Saxena",
    mentorRole: "Founder & Lead Mentor",
    topic: "Milestone 3 Architecture & ESP32 FreeRTOS Walkthrough",
    date: "Thursday, Nov 20",
    time: "6:00 PM IST",
    status: "Confirmed",
  },
};

export const AUTH_COOKIE_NAME = "inspivia_session";

// Global student repository for active runtime
export const STUDENTS_DB: StudentUser[] = [DEMO_STUDENT];

export function findStudentByEmail(email: string): StudentUser | undefined {
  if (!email) return undefined;
  return STUDENTS_DB.find((s) => s.email.toLowerCase() === email.trim().toLowerCase());
}

export function findStudentById(id: string): StudentUser | undefined {
  return STUDENTS_DB.find((s) => s.id === id);
}

export function findStudentByVerificationToken(token: string): StudentUser | undefined {
  return STUDENTS_DB.find((s) => s.verificationToken === token);
}

export function findStudentByResetToken(token: string): StudentUser | undefined {
  return STUDENTS_DB.find(
    (s) => s.resetPasswordToken === token && s.resetPasswordExpires && s.resetPasswordExpires > Date.now()
  );
}

export function registerStudent(data: {
  email: string;
  name: string;
  password: string;
  course: string;
  year: string;
  track?: string;
}): StudentUser {
  const existing = findStudentByEmail(data.email);
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const { hash, salt } = hashPassword(data.password);
  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const verificationToken = randomBytes(24).toString("hex");

  const newStudent: StudentUser = {
    id: `std-${Date.now().toString(36)}`,
    email: data.email.toLowerCase().trim(),
    name: data.name.trim(),
    course: data.course || "B.Tech Engineering",
    year: data.year || "1st Year",
    enrolledTrack: data.track || "Full-Stack Web & Cloud Architecture",
    avatarInitials: initials || "ST",
    registeredAt: new Date().toISOString().split("T")[0],
    isEmailVerified: true, // Auto-verified for instant access with simulation support
    passwordHash: hash,
    salt,
    verificationToken,
    completedMilestones: [],
    activeProject: undefined,
  };

  STUDENTS_DB.push(newStudent);
  return newStudent;
}
