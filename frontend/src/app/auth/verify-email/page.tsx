"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import { apiFetch, errorMessage } from "@/lib/api";
import { Mail, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailInput, setEmailInput] = useState(emailParam);
  const [notice, setNotice] = useState(
    searchParams.get("sent") === "1" ? "Account created. We've sent a verification link to your email." : ""
  );

  // Verification only ever happens with the emailed token. Without one, this form re-sends the link.
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      if (token) {
        await apiFetch("/api/auth/verify-email", {
          method: "POST",
          json: { token },
          redirectOnUnauthorized: false,
        });
        setVerified(true);
      } else {
        const data = await apiFetch<{ message?: string }>("/api/auth/verify-email", {
          method: "POST",
          json: { resend: true, email: emailInput.trim() },
          redirectOnUnauthorized: false,
        });
        setNotice(data.message || "A new verification link is on its way.");
      }
    } catch (err) {
      setError(errorMessage(err, "An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-midnight-green/45 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl border border-beige/15 shadow-2xl">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {notice && !verified && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{notice}</span>
        </div>
      )}

      {verified ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-moss-green/20 border-2 border-moss-green flex items-center justify-center text-moss-green">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-beige">Email Successfully Verified</h2>
          <p className="text-xs md:text-sm text-beige/80 max-w-sm mx-auto">
            Your student identity has been verified on the INSPIVIA network. Your account now has full access to 1-on-1 mentor pairings and the AI Companion.
          </p>
          <div className="pt-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-all"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-forest-green border border-beige/20 flex items-center justify-center text-rosy-brown">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-serif font-bold text-beige">Student Email Verification</h2>
            <p className="text-xs text-beige/75">
              Confirm your college email to activate peer collaboration badges and priority mentor bookings.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            {!token && (
              <div>
                <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
                  Registered Student Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@inspivia.org"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/30 text-xs focus:outline-none focus:border-rosy-brown"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>{token ? "Confirming Student Verification..." : "Sending..."}</span>
              ) : (
                <>
                  <span>{token ? "Verify Email Address" : "Resend Verification Email"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-beige/10 text-center text-xs text-beige/60">
            <Link href="/auth/login" className="text-rosy-brown hover:underline font-mono">
              Already verified? Sign in →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-forest-green flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-midnight-green/30 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <InspiviaLogo size="md" className="justify-center mb-6" />
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Suspense fallback={<div className="p-8 text-center text-xs text-beige">Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
