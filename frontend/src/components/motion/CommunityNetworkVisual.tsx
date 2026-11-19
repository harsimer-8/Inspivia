"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Sparkles, BookOpen, MessageSquare, ShieldCheck, Heart, Radio } from "lucide-react";

interface NodePoint {
  id: string;
  name: string;
  role: "Student Scholar" | "Expert Mentor" | "Campus Chapter Hub";
  x: number; // percentage
  y: number; // percentage
  discipline: string;
  color: string;
  activity: string;
}

const NETWORK_NODES: NodePoint[] = [
  {
    id: "hub-1",
    name: "Engineering Central Chapter",
    role: "Campus Chapter Hub",
    x: 50,
    y: 48,
    discipline: "Core Project Coordination Hub",
    color: "#F7F4D5",
    activity: "Super 50 Milestone Synchronizer",
  },
  {
    id: "mentor-1",
    name: "Lead Systems Mentor",
    role: "Expert Mentor",
    x: 32,
    y: 28,
    discipline: "Hardware & IoT Firmware",
    color: "#D3968C",
    activity: "Reviewing ESP32 MQTT PR #14",
  },
  {
    id: "mentor-2",
    name: "AI/ML Lead Mentor",
    role: "Expert Mentor",
    x: 68,
    y: 28,
    discipline: "Computer Vision & Medical AI",
    color: "#839958",
    activity: "Grad-CAM Validation Office Hour",
  },
  {
    id: "mentor-3",
    name: "Web Architecture Lead",
    role: "Expert Mentor",
    x: 50,
    y: 80,
    discipline: "Next.js & Distributed Systems",
    color: "#105666",
    activity: "NextYou Portfolio Deployments",
  },
  {
    id: "student-1",
    name: "1st-Year Junior Explorer",
    role: "Student Scholar",
    x: 20,
    y: 45,
    discipline: "Embedded Systems Track",
    color: "#839958",
    activity: "Debugging Breadboard I2C Sensor",
  },
  {
    id: "student-2",
    name: "2nd-Year Project Builder",
    role: "Student Scholar",
    x: 25,
    y: 72,
    discipline: "Full-Stack Web Track",
    color: "#D3968C",
    activity: "Drafting Schema with the AI Companion",
  },
  {
    id: "student-3",
    name: "3rd-Year Innovator",
    role: "Student Scholar",
    x: 78,
    y: 45,
    discipline: "Deep Learning Diagnostic",
    color: "#D3968C",
    activity: "Training PyTorch CNN Model",
  },
  {
    id: "student-4",
    name: "VLSI Synthesis Scholar",
    role: "Student Scholar",
    x: 75,
    y: 72,
    discipline: "Verilog HDL & DSP",
    color: "#839958",
    activity: "Writing ModelSim Testbench",
  },
];

// Constellation connecting lines
const EDGES = [
  ["hub-1", "mentor-1"],
  ["hub-1", "mentor-2"],
  ["hub-1", "mentor-3"],
  ["mentor-1", "student-1"],
  ["mentor-1", "student-2"],
  ["mentor-2", "student-3"],
  ["mentor-2", "student-4"],
  ["mentor-3", "student-2"],
  ["mentor-3", "student-4"],
  ["student-1", "student-2"],
  ["student-3", "student-4"],
];

export default function CommunityNetworkVisual() {
  const [activeNode, setActiveNode] = useState<NodePoint>(NETWORK_NODES[0]);

  return (
    <div className="rounded-3xl p-6 sm:p-10 bg-midnight-green/35 border border-beige/15 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Top Controls & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-beige/15 relative z-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-moss-green font-bold flex items-center gap-2">
            <Radio className="w-4 h-4 text-rosy-brown animate-pulse" />
            <span>Live Student-Mentor Constellation Topology</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-beige mt-1">
            Dynamic Inter-Campus Collaboration Mesh
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-green/80 border border-beige/15 text-beige">
            <span className="w-2 h-2 rounded-full bg-rosy-brown" />
            <span>Expert Mentors</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-green/80 border border-beige/15 text-beige">
            <span className="w-2 h-2 rounded-full bg-moss-green" />
            <span>Student Scholars</span>
          </span>
        </div>
      </div>

      {/* Main SVG Constellation Canvas */}
      <div className="relative w-full h-[380px] sm:h-[460px] rounded-2xl bg-[#072419] border border-beige/10 overflow-hidden flex items-center justify-center">
        {/* Architectural Radial Background Glow */}
        <div className="absolute inset-0 bg-radial from-midnight-green/40 via-transparent to-transparent pointer-events-none" />

        {/* Dynamic SVG Connection Network */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {EDGES.map(([srcId, dstId], i) => {
            const src = NETWORK_NODES.find((n) => n.id === srcId);
            const dst = NETWORK_NODES.find((n) => n.id === dstId);
            if (!src || !dst) return null;

            return (
              <g key={i}>
                <line
                  x1={`${src.x}%`}
                  y1={`${src.y}%`}
                  x2={`${dst.x}%`}
                  y2={`${dst.y}%`}
                  stroke="#F7F4D5"
                  strokeOpacity="0.18"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive Floating Nodes */}
        {NETWORK_NODES.map((node) => {
          const isSelected = activeNode.id === node.id;
          const isHub = node.role === "Campus Chapter Hub";

          return (
            <motion.div
              key={node.id}
              onClick={() => setActiveNode(node)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              whileHover={{ scale: 1.15 }}
            >
              {/* Outer Pulsing Glow on Selected Node */}
              {isSelected && (
                <div
                  className="absolute -inset-3 rounded-full animate-ping opacity-35"
                  style={{ backgroundColor: node.color }}
                />
              )}

              {/* Node Core Body */}
              <div
                className={`rounded-full flex items-center justify-center font-bold transition-all shadow-xl ${
                  isHub
                    ? "w-12 h-12 sm:w-14 sm:h-14 bg-beige text-forest-green border-2 border-rosy-brown"
                    : "w-8 h-8 sm:w-10 sm:h-10 text-forest-green border border-beige/40"
                } ${isSelected ? "ring-4 ring-rosy-brown" : "opacity-90 group-hover:opacity-100"}`}
                style={{
                  backgroundColor: isHub ? "#F7F4D5" : node.color,
                }}
              >
                {isHub ? (
                  <Sparkles className="w-6 h-6 text-forest-green" />
                ) : (
                  <Users className="w-4 h-4 text-forest-green" />
                )}
              </div>

              {/* Node Floating Label */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap pointer-events-none">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shadow-sm ${
                    isSelected
                      ? "bg-rosy-brown text-forest-green font-bold border-rosy-brown"
                      : "bg-forest-green/85 text-beige/80 border-beige/15"
                  }`}
                >
                  {node.name}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Node Telemetry Banner */}
      <div className="mt-8 p-5 rounded-2xl bg-forest-green/80 border border-beige/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeNode.color }}
            />
            <span className="text-xs font-mono uppercase tracking-wider text-moss-green font-bold">
              {activeNode.role} • Active Node
            </span>
          </div>
          <h4 className="text-lg font-serif font-bold text-beige">{activeNode.name}</h4>
          <p className="text-xs text-beige/80 font-mono">Focus: {activeNode.discipline}</p>
        </div>

        <div className="p-3 rounded-xl bg-midnight-green/60 border border-beige/10 font-mono text-xs text-beige/90 space-y-0.5">
          <span className="text-[10px] uppercase text-rosy-brown block">Live Collaboration:</span>
          <span>{activeNode.activity}</span>
        </div>
      </div>
    </div>
  );
}
