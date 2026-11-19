"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import { ArrowRight, Lock, Mail, AlertCircle, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("student@inspivia.org");
    setPassword("inspivia2026");
    setError("");
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

          {/* Quick Demo Pre-Fill Helper */}
          <div className="mt-6 pt-6 border-t border-beige/10">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="w-full py-2.5 rounded-xl bg-forest-green/60 border border-beige/20 text-xs text-beige/90 hover:text-rosy-brown hover:border-rosy-brown font-mono flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-rosy-brown" />
              <span>Use Seeded Student Account (Ananya Sharma)</span>
            </button>
          </div>

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
