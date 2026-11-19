"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, Quote } from "lucide-react";
import type { StudentTestimonial } from "@/data/testimonialsData";

interface FeedbackFlashcardsProps {
  testimonials: StudentTestimonial[];
}

/**
 * Student feedback shown as a closed "deck" box.
 * Clicking the box fans every feedback out as a flashcard.
 */
export default function FeedbackFlashcards({ testimonials }: FeedbackFlashcardsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.div
            key="deck"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-md mx-auto py-6"
          >
            {/* Stacked cards behind the box */}
            <div className="absolute inset-x-6 top-2 bottom-8 rounded-3xl bg-midnight-green/40 border border-beige/10 rotate-[-4deg]" aria-hidden="true" />
            <div className="absolute inset-x-6 top-2 bottom-8 rounded-3xl bg-midnight-green/60 border border-beige/10 rotate-[3deg]" aria-hidden="true" />

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-label={`Open ${testimonials.length} student feedback flashcards`}
              className="relative w-full rounded-3xl p-10 bg-midnight-green border border-rosy-brown/50 hover:border-rosy-brown shadow-2xl text-center transition-all hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-rosy-brown"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-rosy-brown/20 border border-rosy-brown flex items-center justify-center text-rosy-brown mb-5">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-beige mb-2">Student Feedback</h3>
              <p className="text-xs font-mono uppercase tracking-wider text-moss-green mb-5">
                {testimonials.length} {testimonials.length === 1 ? "flashcard" : "flashcards"} inside
              </p>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rosy-brown text-forest-green font-bold text-xs uppercase tracking-wider">
                Click to open
              </span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-beige/60">
                {testimonials.length} feedback flashcards
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-beige/25 text-beige hover:border-rosy-brown hover:text-rosy-brown text-xs font-mono uppercase tracking-wider transition-all"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close deck</span>
              </button>
            </div>

            {testimonials.length === 0 ? (
              <p className="text-center text-sm text-beige/60 py-12">
                No feedback matches your search. Try a different keyword or year.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <motion.article
                    key={t.id}
                    initial={{ opacity: 0, y: -90, scale: 0.6, rotate: i % 2 === 0 ? -6 : 6 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 140, damping: 18, delay: Math.min(i * 0.05, 0.9) }}
                    className="rounded-3xl p-7 bg-midnight-green/35 border border-beige/15 hover:border-rosy-brown/40 transition-colors duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-rosy-brown/20 border border-rosy-brown/40 text-rosy-brown font-serif font-bold flex items-center justify-center text-sm">
                            {t.name[0]}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-beige">{t.name}</h4>
                            <p className="text-[11px] font-mono text-moss-green">
                              {t.course} ({t.year})
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-moss-green/80 bg-forest-green/80 px-2.5 py-1 rounded-full border border-moss-green/20">
                          #{t.id}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-beige/90 leading-relaxed italic mb-6">
                        &ldquo;{t.feedback}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-beige/10">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-moss-green font-semibold block mb-2">
                        Core Technical Interests:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {t.interests.map((int, iIdx) => (
                          <span
                            key={iIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/25 text-beige/80 border border-white/5"
                          >
                            {int}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
