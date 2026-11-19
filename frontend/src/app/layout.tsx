import type { Metadata, Viewport } from "next";
import { Manrope, Syne, Playfair_Display } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A3323",
};

export const metadata: Metadata = {
  title: "INSPIVIA — Don't Just Learn. Build With Direction.",
  description:
    "Student mentorship and project-building platform overcoming student confusion through personalized roadmaps, 1-on-1 mentor guidance, and AI Companion assistance.",
  keywords: [
    "student mentorship",
    "project building",
    "engineering roadmap",
    "AI Companion",
    "Super 50",
    "Wallabhi Saxena",
    "IoT",
    "AI/ML",
    "Full-stack Web",
  ],
  authors: [{ name: "Wallabhi Saxena" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${syne.variable} ${playfair.variable}`}>
      <body className="bg-forest-green text-beige min-h-screen relative antialiased selection:bg-rosy-brown selection:text-forest-green">
        {/* Subtle Architectural Film Grain Overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Precision Custom Cursor */}
        <CustomCursor />

        {/* Lenis Smooth Scroll Manager */}
        <SmoothScroll>
          <div className="flex flex-col min-h-screen relative z-10">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
