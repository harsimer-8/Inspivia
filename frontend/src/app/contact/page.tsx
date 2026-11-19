"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BRAND_INFO } from "@/data/inspiviaData";
import { Mail, Send, CheckCircle2, MessageSquare, HelpCircle, ChevronDown, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    year: "1st Year",
    domain: "Full-Stack Web Architecture",
    message: "",
  });

  const faqs = [
    {
      q: "Who is eligible to join Inspivia mentorship cohorts?",
      a: "Engineering and technology students from 1st year to 4th year across any recognized institution. We especially encourage 1st and 2nd year students who feel confused about where to start.",
    },
    {
      q: "How does the Super 50 cohort selection work?",
      a: "Super 50 is an intensive, milestone-driven project accelerator. Selection is based on curiosity, willingness to commit to weekly deadlines, and dedication to building authentic proof-of-work prototypes.",
    },
    {
      q: "Is the AI Companion accessible to all registered students?",
      a: "Yes! Every registered student has access to the AI Companion directly in their student dashboard for 24/7 architecture questions, code reviews, and project recommendations.",
    },
    {
      q: "How do one-to-one mentor reviews happen?",
      a: "Sessions take place virtually over Google Meet or scheduled lab reviews. You are matched with an expert who specializes in your exact project domain.",
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 pt-32 pb-24 md:pt-40 md:pb-32 bg-forest-green text-beige">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-green/50 border border-beige/20 text-xs font-mono uppercase tracking-widest text-rosy-brown mb-4">
              <Mail className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-beige mb-6">
              Connect With the{" "}
              <span className="italic text-rosy-brown font-normal block">
                Inspivia Mentorship Team.
              </span>
            </h1>
            <p className="text-base md:text-lg text-beige/80 leading-relaxed font-sans">
              Have questions about roadmap enrollment, starting a campus chapter, or bringing your project idea to our leads? Send us a note below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
            {/* Contact Form */}
            <div className="lg:col-span-7 rounded-3xl p-8 md:p-10 bg-midnight-green/35 border border-beige/15">
              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-moss-green/20 border border-moss-green text-moss-green flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-beige">
                    Message Received with Direction!
                  </h3>
                  <p className="text-sm text-beige/80 max-w-md mx-auto">
                    Thank you, {formData.name || "Student"}. A lead mentor will review your inquiry and follow up at{" "}
                    <strong className="text-rosy-brown">{formData.email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-beige/70 font-semibold block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/35 text-xs focus:outline-none focus:border-rosy-brown"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-beige/70 font-semibold block">
                        Student Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="student@college.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/35 text-xs focus:outline-none focus:border-rosy-brown"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-beige/70 font-semibold block">
                        College / University
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Your University / College"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/35 text-xs focus:outline-none focus:border-rosy-brown"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-beige/70 font-semibold block">
                        Current Year
                      </label>
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-forest-green/80 border border-beige/15 text-beige text-xs focus:outline-none focus:border-rosy-brown"
                      >
                        <option value="1st Year">1st Year Engineering</option>
                        <option value="2nd Year">2nd Year Engineering</option>
                        <option value="3rd Year">3rd Year Engineering</option>
                        <option value="4th Year">4th Year Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-beige/70 font-semibold block">
                      Target Discipline of Interest
                    </label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-forest-green/80 border border-beige/15 text-beige text-xs focus:outline-none focus:border-rosy-brown"
                    >
                      <option value="Full-Stack Web Architecture">Full-Stack Web Architecture</option>
                      <option value="AI & Deep Learning Systems">AI & Deep Learning Systems</option>
                      <option value="IoT, Embedded Firmware & Telemetry">IoT, Embedded Firmware & Telemetry</option>
                      <option value="VLSI & Digital Signal Processing">VLSI & Digital Signal Processing</option>
                      <option value="Data Analytics & Forecasting">Data Analytics & Forecasting</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-beige/70 font-semibold block">
                      Your Message or Project Ambition *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us what you want to build, what you are stuck on, or how we can help..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-forest-green/80 border border-beige/15 text-beige placeholder:text-beige/35 text-xs focus:outline-none focus:border-rosy-brown resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider hover:bg-rosy-brown/90 shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry to Lead Mentors</span>
                  </button>
                </form>
              )}
            </div>

            {/* Studio Info & Direct Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-midnight-green/30 border border-beige/15 space-y-6">
                <h3 className="text-xl font-serif font-bold text-beige">
                  Direct Communications
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-moss-green font-mono uppercase font-bold block mb-1">
                      Official Inquiries:
                    </span>
                    <a
                      href={`mailto:${BRAND_INFO.officialEmail}`}
                      className="text-beige font-mono hover:text-rosy-brown transition-colors text-sm"
                    >
                      {BRAND_INFO.officialEmail}
                    </a>
                  </div>

                  <div>
                    <span className="text-moss-green font-mono uppercase font-bold block mb-1">
                      Campus Chapters:
                    </span>
                    <p className="text-beige/80">
                      Engineering Colleges & Remote Cohorts Nationwide.
                    </p>
                  </div>

                  <div>
                    <span className="text-moss-green font-mono uppercase font-bold block mb-1">
                      Mentor Office Hours:
                    </span>
                    <p className="text-beige/80">
                      Tuesdays, Thursdays, and Saturdays (5:00 PM – 8:30 PM IST).
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-beige/10">
                  <a
                    href="/dashboard/ai-companion"
                    className="w-full py-3 rounded-xl bg-forest-green/80 border border-beige/20 text-beige hover:border-rosy-brown text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rosy-brown" />
                    <span>Ask the AI Companion Instantly</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions Accordion */}
          <div className="max-w-4xl mx-auto pt-12 border-t border-beige/10">
            <div className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold block mb-2">
                Clarity
              </span>
              <h2 className="text-3xl font-serif font-bold text-beige">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-midnight-green/30 border border-beige/15 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left text-sm md:text-base font-serif font-bold text-beige hover:text-rosy-brown transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? "rotate-180 text-rosy-brown" : "text-beige/50"
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-5 text-xs md:text-sm text-beige/80 leading-relaxed font-sans border-t border-beige/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
