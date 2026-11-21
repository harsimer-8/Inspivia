"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import { apiFetch, errorMessage, safeNextPath } from "@/lib/api";
import { ArrowRight, Lock, Mail, AlertCircle, ShieldCheck, HelpCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("expired") === "1") {
      setError("Your session has expired. Please sign in again.");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        json: { email: email.trim(), password },
        redirectOnUnauthorized: false,
      });

      const next = safeNextPath(new URLSearchParams(window.location.search).get("next"));
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "An unexpected error occurred during login."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-green flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-midnight-green/30 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <InspiviaLogo size="md" className="justify-center mb-6" />
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-beige">
          Student Portal Sign In
        </h1>
        <p className="mt-2 text-xs md:text-sm text-beige/75 font-sans">
          Access your personal learning roadmaps, AI Companion, and mentor sessions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-midnight-green/45 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl border border-beige/15 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-2">
                Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@inspivia.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-forest-green/80 border border-beige/15 text-[#111827] placeholder:text-[#6B7280] text-xs focus:outline-none focus:border-rosy-brown"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-beige/70 font-semibold block">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] font-mono text-rosy-brown hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-forest-green/80 border border-beige/15 text-[#111827] placeholder:text-[#6B7280] text-xs focus:outline-none focus:border-rosy-brown"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-beige/70">
            <span>New engineering scholar? </span>
            <Link
              href="/auth/register"
              className="text-rosy-brown font-semibold hover:underline"
            >
              Register here
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
