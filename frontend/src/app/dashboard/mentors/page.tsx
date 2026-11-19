"use client";

import React, { useState } from "react";
import { MENTORS_LIST, MentorProfile } from "@/data/mentorsData";
import {
  Users,
  Star,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
  Linkedin,
} from "lucide-react";

export default function MentorsDiscoveryPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [bookingMentor, setBookingMentor] = useState<MentorProfile | null>(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [sessionTopic, setSessionTopic] = useState("Code & Architecture Review");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const domains = ["All", "AI/ML", "Full-Stack", "Hardware", "Patents"];

  const filteredMentors = MENTORS_LIST.filter((mentor) => {
    if (selectedDomain === "All") return true;
    if (selectedDomain === "AI/ML") return mentor.domain.includes("AI") || mentor.domain.includes("Intelligence");
    if (selectedDomain === "Full-Stack") return mentor.domain.includes("Full-Stack") || mentor.domain.includes("Portfolio");
    if (selectedDomain === "Hardware") return mentor.domain.includes("IoT") || mentor.domain.includes("Hardware");
    if (selectedDomain === "Patents") return mentor.domain.includes("Patent") || mentor.isFounder;
    return true;
  });

  const handleOpenBooking = (mentor: MentorProfile) => {
    setBookingMentor(mentor);
    setSelectedDay(mentor.availableDays[0] || "Saturday");
    setSelectedSlot(mentor.sessionSlots[0] || "6:00 PM - 7:00 PM");
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-beige/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-green/50 border border-beige/15 text-[11px] font-mono text-moss-green mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>1-on-1 Expert Guidance</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-beige">
            Mentor Discovery & Office Hours
          </h1>
          <p className="text-xs md:text-sm text-beige/75 mt-1 max-w-xl">
            Book dedicated 1-on-1 review sessions with Wallabhi Saxena and expert domain leads. Never struggle alone on a technical roadblock.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono uppercase text-beige/50 mr-2">Discipline:</span>
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
              selectedDomain === dom
                ? "bg-rosy-brown text-forest-green font-bold shadow-md"
                : "bg-forest-green/60 text-beige/70 hover:text-beige border border-beige/10"
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Mentors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="rounded-3xl p-8 bg-midnight-green/35 border border-beige/15 hover:border-rosy-brown/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-serif font-bold text-xl border border-beige/20 shadow-md"
                  style={{ backgroundColor: mentor.accentColor, color: "#0A3323" }}
                >
                  {mentor.initials}
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-mono text-rosy-brown font-bold justify-end">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{mentor.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] font-mono text-beige/50">
                    {mentor.reviewsCount} verified reviews
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-serif font-bold text-beige">
                    {mentor.name}
                  </h3>
                  {mentor.isFounder && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rosy-brown/20 text-rosy-brown border border-rosy-brown/30 font-semibold">
                      Founder
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-moss-green mt-0.5">
                  {mentor.role} • {mentor.experience}
                </p>
              </div>

              <p className="text-xs text-beige/80 leading-relaxed mb-6">
                {mentor.bio}
              </p>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {mentor.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/25 text-beige/70 border border-white/5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="pt-4 border-t border-beige/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-beige/65">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-moss-green" />
                    <span>{mentor.availableDays.join(", ")}</span>
                  </span>
                </div>

                <button
                  onClick={() => handleOpenBooking(mentor)}
                  className="w-full py-3 rounded-xl bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Book 1-on-1 Session</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Dialogue Modal */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-green/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl p-8 bg-midnight-green border border-rosy-brown/40 shadow-2xl text-beige">
            <button
              onClick={() => setBookingMentor(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-forest-green/60 text-beige/70 hover:text-beige flex items-center justify-center transition-colors"
              aria-label="Close booking modal"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingConfirmed ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-moss-green/20 border border-moss-green text-moss-green flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-beige">
                  Mentorship Session Confirmed!
                </h3>
                <p className="text-xs text-beige/80 max-w-sm mx-auto leading-relaxed">
                  Your 1-on-1 session with <strong className="text-rosy-brown">{bookingMentor.name}</strong> has been scheduled for{" "}
                  <strong className="text-beige">{selectedDay} ({selectedSlot})</strong>.
                </p>
                <div className="p-3 rounded-xl bg-forest-green/60 border border-white/5 text-xs font-mono text-moss-green">
                  Google Meet link sent to your registered student email.
                </div>
                <button
                  onClick={() => setBookingMentor(null)}
                  className="px-6 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-rosy-brown font-bold block mb-1">
                    Book Office Hours
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-beige">
                    {bookingMentor.name}
                  </h3>
                  <p className="text-xs font-mono text-moss-green mt-0.5">
                    {bookingMentor.domain}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-beige/70 font-semibold block">
                    Select Available Day
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {bookingMentor.availableDays.map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                          selectedDay === day
                            ? "bg-rosy-brown text-forest-green font-bold border-rosy-brown"
                            : "bg-forest-green/60 text-beige/80 border-beige/10 hover:border-beige/30"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-beige/70 font-semibold block">
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {bookingMentor.sessionSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono border transition-all text-left ${
                          selectedSlot === slot
                            ? "bg-rosy-brown text-forest-green font-bold border-rosy-brown"
                            : "bg-forest-green/60 text-beige/80 border-beige/10 hover:border-beige/30"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-beige/70 font-semibold block">
                    Session Focus / Agenda
                  </label>
                  <select
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-forest-green/80 border border-beige/15 text-beige text-xs focus:outline-none focus:border-rosy-brown"
                  >
                    <option value="Code & Architecture Review">Code & Architecture Review</option>
                    <option value="Hardware / Sensor Interfacing Debug">Hardware / Sensor Interfacing Debug</option>
                    <option value="Patent & Research Ideation">Patent & Research Ideation</option>
                    <option value="Roadmap Milestone Verification">Roadmap Milestone Verification</option>
                    <option value="Portfolio & Technical Interview Prep">Portfolio & Technical Interview Prep</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-lg flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <span>Confirm Office Hour Reservation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
