"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import { apiFetch, errorMessage } from "@/lib/api";
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  BookOpen,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    course: "B.Tech Computer Science",
    year: "1st Year",
    track: "Full-Stack Web & Cloud Architecture",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please ensure both password fields are identical.");
      return;
    }

    if (!formData.terms) {
      setError("Please accept the Inspivia Student Mentorship Terms & Honor Code to continue.");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        json: formData,
        redirectOnUnauthorized: false,
      });

      // Accounts start unverified, so send the student to the verification step rather than the dashboard.
      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email.trim())}&sent=1`);
    } catch (err) {
      setError(errorMessage(err, "An unexpected error occurred during registration."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-green flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-midnight-green/30 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center relative z-10 px-4">
        <InspiviaLogo size="md" className="justify-center mb-6" />
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-beige">
          Join the Inspivia Student Network
        </h1>
        <p className="mt-2 text-xs md:text-sm text-beige/75 font-sans">
          Get personalized roadmaps, 1-on-1 expert mentor support, and the AI Companion.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        <div className="bg-midnight-green/45 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl border border-beige/15 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-[#111827] placeholder:text-[#6B7280] text-xs focus:outline-none focus:border-rosy-brown"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
                Student / Institutional Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="ananya@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-[#111827] placeholder:text-[#6B7280] text-xs focus:outline-none focus:border-rosy-brown"
                />
              </div>
            </div>

            {/* College */}
            <div>
              <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
                College / Institution *
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={200}
                  placeholder="e.g. Your university or college"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-[#111827] placeholder:text-[#6B7280] text-xs focus:outline-none focus:border-rosy-brown"
                />
              </div>
            </div>

            {/* Course & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
                  Course / Discipline
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-[#111827] text-xs focus:outline-none focus:border-rosy-brown [&>option]:bg-white [&>option]:text-[#111827]"
                >
                  <option value="B.Tech Computer Science">B.Tech CS / IT</option>
                  <option value="B.Tech CS-AI">B.Tech CS-AI</option>
                  <option value="B.Tech ECE">B.Tech ECE</option>
                  <option value="B.Tech EEE">B.Tech EEE</option>
                  <option value="B.Tech VLSI Design">B.Tech VLSI Design</option>
                  <option value="BCA / MCA">BCA / MCA</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
                  Current Year
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-[#111827] text-xs focus:outline-none focus:border-rosy-brown [&>option]:bg-white [&>option]:text-[#111827]"
                >
                  <option value="1st Year">1st Year (Junior Explorer)</option>
                  <option value="2nd Year">2nd Year (Builder)</option>
                  <option value="3rd Year">3rd Year (Innovator)</option>
                  <option value="4th Year">4th Year (Expert Lead)</option>
                </select>
              </div>
            </div>

            {/* Mentorship Track */}
            <div>
              <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
                Target Engineering Track
              </label>
              <select
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-[#111827] text-xs focus:outline-none focus:border-rosy-brown [&>option]:bg-white [&>option]:text-[#111827]"
              >
                <option value="Full-Stack Web & Cloud Architecture">
                  Full-Stack Web &amp; Cloud Architecture
                </option>
                <option value="Applied AI & Deep Learning Systems">
                  Applied AI &amp; Deep Learning Systems
                </option>
                <option value="IoT, Embedded Firmware & Telemetry">
                  IoT, Embedded Firmware &amp; Telemetry
                </option>
                <option value="VLSI, Verilog HDL & Silicon Architecture">
                  VLSI, Verilog HDL &amp; Silicon Architecture
                </option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
                Create Secure Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-[#111827] placeholder:text-[#6B7280] text-xs focus:outline-none focus:border-rosy-brown"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-[#111827] placeholder:text-[#6B7280] text-xs focus:outline-none focus:border-rosy-brown"
                />
              </div>
            </div>

            {/* Terms and Honor Code Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-beige/20 text-rosy-brown focus:ring-rosy-brown bg-forest-green"
                />
                <span className="text-[11px] text-beige/80 leading-snug">
                  I agree to the{" "}
                  <span className="text-rosy-brown font-semibold">INSPIVIA Honor Code</span> and
                  commit to authentic project building, regular milestone updates, and respectful mentorship.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Student Account...</span>
              ) : (
                <>
                  <span>Create Account &amp; Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-beige/70">
            <span>Already registered? </span>
            <Link
              href="/auth/login"
              className="text-rosy-brown font-semibold hover:underline"
            >
              Sign In to Your Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-mono text-beige/50 hover:text-beige transition-colors"
          >
            ← Back to INSPIVIA Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
