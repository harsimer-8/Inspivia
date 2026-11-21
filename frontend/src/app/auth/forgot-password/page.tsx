"use client";

import React, { useState } from "react";
import Link from "next/link";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import { apiFetch, errorMessage } from "@/lib/api";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const data = await apiFetch<{ message?: string }>("/api/auth/reset-password", {
        method: "POST",
        json: { action: "request", email: email.trim() },
        redirectOnUnauthorized: false,
      });

      setSuccessMessage(data.message || "Password reset instructions sent.");
    } catch (err) {
      setError(errorMessage(err, "An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-green flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-midnight-green/30 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <InspiviaLogo size="md" className="justify-center mb-6" />
        <h1 className="text-3xl font-serif font-bold tracking-tight text-beige">
          Reset Your Password
        </h1>
        <p className="mt-2 text-xs md:text-sm text-beige/75 font-sans">
          Enter your registered student email and we'll issue a secure reset link.
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

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleRequestReset} className="space-y-5">
            <div>
              <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-2">
                Student Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@inspivia.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/30 text-xs focus:outline-none focus:border-rosy-brown"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Generating Instructions...</span>
              ) : (
                <>
                  <span>Send Reset Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-beige/70">
            <Link href="/auth/login" className="text-rosy-brown font-semibold hover:underline">
              ← Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
