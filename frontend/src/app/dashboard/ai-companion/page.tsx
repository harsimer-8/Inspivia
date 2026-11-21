"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  RefreshCw,
  Terminal,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Trash2,
  Copy,
  Check,
  Cpu,
  BrainCircuit,
  Globe,
  Radio,
  FileCode2,
} from "lucide-react";
import { ApiError, apiFetch } from "@/lib/api";
import { firstName, useSessionUser } from "@/lib/session-context";

const PROVIDER_LABEL = "INSPIVIA AI Engine";
const MAX_MESSAGE_LENGTH = 4000;

interface CompanionReply {
  message: string;
  conversationId: string;
}

interface ChatMessage {
  id: string;
  sender: "ai-companion" | "user";
  text: string;
  timestamp: string;
  provider?: string;
}

function companionErrorText(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return "Your session has expired. Redirecting you to sign in...";
    if (err.status === 403) return "The AI Companion is available to student accounts only.";
    if (err.status === 429) return "You're sending messages too quickly. Please wait a moment and try again.";
    if (err.status === 504) return "The AI Companion took too long to respond. Please try again.";
    if (err.status === 0) return "Could not connect to the AI Companion service. Please verify your network and retry.";
    return err.message;
  }
  return "The AI Companion is unavailable right now. Please try again shortly.";
}

export default function AICompanionChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "ai-companion",
      text: `Hello! I am the **INSPIVIA AI Companion**, your Project & Architecture Mentor.\n\nI work alongside Wallabhi Saxena and our expert mentor leads to help you:\n• **Decompose vague project ideas** into concrete weekly engineering milestones.\n• **Design full-stack and embedded architectures** with high performance.\n• **Review code logic, database schemas, and API contracts**.\n• **Guide your technical publications, portfolio showcases, and patent drafts**.\n\nWhat project idea, technical hurdle, or roadmap question are you exploring today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      provider: "INSPIVIA AI Engineering Engine",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const studentUser = useSessionUser();
  const [selectedTrack, setSelectedTrack] = useState(
    studentUser.enrolledTrack || "Full-Stack Web & Cloud Architecture"
  );
  // Conversation id issued by the backend; it keys the server-side history for follow-up turns.
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    "Decompose my project idea into sprint tickets",
    "Generate PostgreSQL schema & API contract",
    "Suggest a patentable novelty for an IoT / AI system",
    "How do I prepare for my expert mentor PR code review?",
    "Explain FreeRTOS task partition vs superloop on ESP32",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, streamingText]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setConversationId(null);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: "ai-companion",
        text: `Chat session reset. What technical challenge would you like to explore in **${selectedTrack}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading || query.trim().length > MAX_MESSAGE_LENGTH) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);
    setStreamingText("");

    try {
      // The backend builds the student context itself and keeps history per conversationId.
      const data = await apiFetch<CompanionReply>("/api/ai-companion", {
        method: "POST",
        json: { message: query.trim(), ...(conversationId ? { conversationId } : {}) },
      });
      if (data.conversationId) setConversationId(data.conversationId);
      const fullResponse = data.message;

      // Simulated streaming animation for smooth human-like delivery
      let currentIndex = 0;
      const chunkSize = Math.max(1, Math.floor(fullResponse.length / 30));

      const streamInterval = setInterval(() => {
        currentIndex += chunkSize;
        if (currentIndex >= fullResponse.length) {
          clearInterval(streamInterval);
          setStreamingText("");
          const aiMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: "ai-companion",
            text: fullResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            provider: PROVIDER_LABEL,
          };
          setMessages((prev) => [...prev, aiMsg]);
          setLoading(false);
        } else {
          setStreamingText(fullResponse.slice(0, currentIndex));
        }
      }, 25);
    } catch (err) {
      setLoading(false);
      setStreamingText("");
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai-companion",
        text: companionErrorText(err),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-0px)] overflow-hidden bg-[#08291c] text-beige">
      {/* ========================================================
          1. ELEGANT HEADER WITH ANIMATED GLOWING ORB
          ======================================================== */}
      <div className="px-6 py-4 bg-forest-green/85 border-b border-beige/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 shadow-md">
        <div className="flex items-center gap-4">
          {/* Animated Glowing Orb Visual */}
          <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
            {/* Concentric Pulsing Aura */}
            <div className="absolute inset-0 rounded-full border border-rosy-brown/40 animate-ping opacity-30" />
            <div className="absolute inset-1 rounded-full border border-dashed border-beige/30 animate-spin-slow" />
            <div
              className="w-8 h-8 rounded-full shadow-[0_0_20px_rgba(211,150,140,0.6)] flex items-center justify-center animate-pulse-subtle"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, #F7F4D5 0%, #D3968C 50%, #105666 90%)",
              }}
            >
              <Sparkles className="w-4 h-4 text-forest-green animate-bounce" />
            </div>
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-serif font-bold text-beige flex items-center gap-2">
              <span>AI Project Mentor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h1>
            <p className="text-[11px] font-mono text-moss-green flex items-center gap-2">
              <span>Scholar: {firstName(studentUser)}{studentUser.year ? ` (${studentUser.year})` : ""}</span>
              <span>•</span>
              <span className="text-rosy-brown">24/7 Verified Companion</span>
            </p>
          </div>
        </div>

        {/* Track Selector & Session Actions */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-forest-green border border-beige/20 text-xs font-mono text-beige focus:outline-none focus:border-rosy-brown"
          >
            <option value="Full-Stack Web & Cloud Architecture">Full-Stack Web</option>
            <option value="Applied AI & Deep Learning Systems">Applied AI / ML</option>
            <option value="IoT, Embedded Firmware & Telemetry">IoT & Hardware</option>
            <option value="VLSI, Verilog HDL & Silicon Architecture">VLSI & Chips</option>
          </select>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-forest-green border border-beige/15 text-beige/60 hover:text-rose-300 hover:border-rose-400/40 transition-colors"
            title="Reset Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================
          2. MESSAGES CANVAS (CHAT HISTORY & STREAMING)
          ======================================================== */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-3xl ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar Monogram */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-serif font-bold shadow-md ${
                  isUser
                    ? "bg-rosy-brown text-forest-green font-bold"
                    : "bg-midnight-green border border-beige/20 text-rosy-brown"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-3xl p-5 md:p-6 text-xs md:text-sm leading-relaxed transition-all relative group ${
                  isUser
                    ? "bg-rosy-brown text-forest-green font-medium shadow-md"
                    : "bg-midnight-green/45 border border-beige/15 text-beige shadow-xl"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans leading-relaxed">{msg.text}</div>

                {/* Footer strip */}
                <div
                  className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                    isUser
                      ? "border-forest-green/20 text-forest-green/70"
                      : "border-beige/10 text-beige/50"
                  }`}
                >
                  <span>{msg.provider || (isUser ? "You" : "AI Mentor")}</span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-beige/60 hover:text-beige"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-moss-green" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Simulated Streaming Bubble */}
        {streamingText && (
          <div className="flex items-start gap-3.5 mr-auto max-w-3xl">
            <div className="w-9 h-9 rounded-2xl bg-midnight-green border border-beige/20 text-rosy-brown flex items-center justify-center shrink-0 shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-3xl p-5 md:p-6 bg-midnight-green/45 border border-beige/15 text-beige shadow-xl text-xs md:text-sm leading-relaxed font-sans whitespace-pre-wrap">
              {streamingText}
              <span className="inline-block w-2 h-4 bg-rosy-brown ml-1 animate-pulse" />
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {loading && !streamingText && (
          <div className="flex items-center gap-3.5 mr-auto max-w-xl">
            <div className="w-9 h-9 rounded-2xl bg-midnight-green border border-beige/20 text-rosy-brown flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl px-5 py-3.5 bg-midnight-green/45 border border-beige/15 text-xs text-beige/80 font-mono flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-rosy-brown" />
              <span>The AI Companion is synthesizing architectural guidance for {selectedTrack}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ========================================================
          3. SUGGESTED STARTER CHIPS
          ======================================================== */}
      <div className="px-4 md:px-8 py-2.5 bg-forest-green/50 border-t border-beige/10 overflow-x-auto flex gap-2">
        {starterPrompts.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-3.5 py-1.5 rounded-full bg-midnight-green/40 hover:bg-rosy-brown hover:text-forest-green border border-beige/15 text-[11px] font-mono text-beige/80 transition-all hover:scale-105"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* ========================================================
          4. RESPONSIVE CHAT COMPOSER
          ======================================================== */}
      <div className="p-4 md:p-6 bg-forest-green/95 border-t border-beige/10 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-4xl mx-auto flex items-center gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={`Ask the AI Companion about project decomposition, schemas, or debugging in ${selectedTrack}...`}
              value={input}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-forest-green border border-beige/20 text-beige placeholder:text-beige/40 text-xs md:text-sm focus:outline-none focus:border-rosy-brown shadow-inner disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-rosy-brown text-forest-green hover:bg-rosy-brown/90 disabled:opacity-30 transition-all shadow"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
