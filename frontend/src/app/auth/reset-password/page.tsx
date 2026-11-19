"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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

      {success ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-moss-green/20 border border-moss-green flex items-center justify-center text-moss-green">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-beige">Password Successfully Updated</h2>
          <p className="text-xs text-beige/80">
            Your credentials have been securely updated. You can now access your student portal.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              <span>Sign In with New Password</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          {!tokenFromUrl && (
            <div>
              <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
                Reset Security Token
              </label>
              <input
                type="text"
                required
                placeholder="Paste token received in email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/30 text-xs font-mono focus:outline-none focus:border-rosy-brown"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
              New Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/30 text-xs focus:outline-none focus:border-rosy-brown"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1.5">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/30 text-xs focus:outline-none focus:border-rosy-brown"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 rounded-xl bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Updating Password...</span>
            ) : (
              <>
                <span>Save New Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-xs text-beige/70">
        <Link href="/auth/login" className="text-rosy-brown font-semibold hover:underline">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-forest-green flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-midnight-green/30 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <InspiviaLogo size="md" className="justify-center mb-6" />
        <h1 className="text-3xl font-serif font-bold tracking-tight text-beige">
          Set New Password
        </h1>
        <p className="mt-2 text-xs md:text-sm text-beige/75 font-sans">
          Create a strong password for your INSPIVIA student account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Suspense fallback={<div className="p-8 text-center text-xs text-beige">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
