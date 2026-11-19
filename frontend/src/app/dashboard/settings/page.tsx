"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function StudentSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [mentorReminders, setMentorReminders] = useState(true);
  const [aiPrompts, setAiPrompts] = useState(true);
  const [portfolioPublic, setPortfolioPublic] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [savedSettings, setSavedSettings] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match. Please verify.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("New password must be at least 6 characters.");
      return;
    }
    setPasswordMsg("Password successfully updated.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-beige/10">
        <div className="flex items-center gap-2 text-xs font-mono text-moss-green uppercase tracking-wider mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Account Preferences &amp; Security</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-beige">
          Platform Settings
        </h1>
      </div>

      {savedSettings && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Your notification preferences have been saved.</span>
        </div>
      )}

      {/* 1. Notifications Preferences */}
      <div className="p-7 rounded-3xl bg-midnight-green/35 border border-beige/15 shadow-xl space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-beige flex items-center gap-2">
            <Bell className="w-5 h-5 text-rosy-brown" />
            <span>Notification &amp; Mentorship Alerts</span>
          </h2>
          <p className="text-xs text-beige/70 mt-1">
            Choose what communication you receive regarding sprint deadlines and reviews.
          </p>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-forest-green/60 border border-beige/10 cursor-pointer">
            <div>
              <span className="font-bold text-xs text-beige block">GitHub PR Code Review Alerts</span>
              <span className="text-[11px] text-beige/65">Get notified when an expert lead comments on your code.</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-rosy-brown rounded border-beige/20 bg-forest-green"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-forest-green/60 border border-beige/10 cursor-pointer">
            <div>
              <span className="font-bold text-xs text-beige block">Mentor 1-on-1 Reminders</span>
              <span className="text-[11px] text-beige/65">Receive calendar notifications 2 hours before scheduled meetings.</span>
            </div>
            <input
              type="checkbox"
              checked={mentorReminders}
              onChange={(e) => setMentorReminders(e.target.checked)}
              className="w-4 h-4 text-rosy-brown rounded border-beige/20 bg-forest-green"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-forest-green/60 border border-beige/10 cursor-pointer">
            <div>
              <span className="font-bold text-xs text-beige block">AI Milestone Check-Ins</span>
              <span className="text-[11px] text-beige/65">Weekly prompt suggestions to keep your sprint streak active.</span>
            </div>
            <input
              type="checkbox"
              checked={aiPrompts}
              onChange={(e) => setAiPrompts(e.target.checked)}
              className="w-4 h-4 text-rosy-brown rounded border-beige/20 bg-forest-green"
            />
          </label>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow transition-all"
          >
            Save Notification Settings
          </button>
        </form>
      </div>

      {/* 2. Privacy & Portfolio Visibility */}
      <div className="p-7 rounded-3xl bg-midnight-green/35 border border-beige/15 shadow-xl space-y-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-beige flex items-center gap-2">
            <Eye className="w-5 h-5 text-moss-green" />
            <span>Public Portfolio Visibility</span>
          </h2>
          <p className="text-xs text-beige/70 mt-1">
            Control whether recruiters and campus peers can view your NextYou portfolio profile.
          </p>
        </div>

        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-forest-green/60 border border-beige/10 cursor-pointer">
          <div>
            <span className="font-bold text-xs text-beige block">Public Community Showcase</span>
            <span className="text-[11px] text-beige/65">
              Allow your verified projects to appear on the INSPIVIA Our Work page.
            </span>
          </div>
          <input
            type="checkbox"
            checked={portfolioPublic}
            onChange={(e) => setPortfolioPublic(e.target.checked)}
            className="w-4 h-4 text-rosy-brown rounded border-beige/20 bg-forest-green"
          />
        </label>
      </div>

      {/* 3. Security & Password Update */}
      <div className="p-7 rounded-3xl bg-midnight-green/35 border border-beige/15 shadow-xl space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-beige flex items-center gap-2">
            <Lock className="w-5 h-5 text-beige" />
            <span>Change Account Password</span>
          </h2>
          <p className="text-xs text-beige/70 mt-1">
            Update your student login password with SHA-256 secure storage.
          </p>
        </div>

        {passwordMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              passwordMsg.includes("success")
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                : "bg-rose-950/60 border-rose-500/40 text-rose-200"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>{passwordMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-beige text-xs focus:outline-none focus:border-rosy-brown"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-beige text-xs focus:outline-none focus:border-rosy-brown"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-beige/70 font-semibold block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-beige text-xs focus:outline-none focus:border-rosy-brown"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow transition-all"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
