"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import InspiviaLogo from "@/components/ui/InspiviaLogo";
import { Menu, X, ArrowRight, UserCheck, LayoutDashboard } from "lucide-react";
import { fetchCurrentUser } from "@/lib/api";
import type { SessionUser } from "@/lib/types";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Our Work" },
  { href: "/team", label: "Our Team" },
  { href: "/community", label: "Community" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentUser, setStudentUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    // Check if user is logged in (never redirects on the public site)
    fetchCurrentUser().then(setStudentUser);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-forest-green/85 backdrop-blur-md border-b border-beige/10 shadow-lg"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <InspiviaLogo href="/" size="sm" />

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-midnight-green/35 border border-beige/15 backdrop-blur-md"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? "bg-beige/15 text-rosy-brown font-semibold"
                    : "text-beige/80 hover:text-beige hover:bg-beige/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Dynamic User Action (Sign In vs Student Portal) */}
        <div className="hidden lg:flex items-center gap-3">
          {studentUser ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 rounded-full bg-rosy-brown text-forest-green font-semibold text-xs hover:bg-rosy-brown/90 transition-all flex items-center gap-2 shadow-md"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="px-5 py-2 rounded-full bg-rosy-brown text-forest-green font-semibold text-xs hover:bg-rosy-brown/90 transition-all flex items-center gap-2 shadow-md"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-midnight-green/40 border border-beige/15 text-beige hover:text-rosy-brown transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[68px] bg-forest-green/95 backdrop-blur-xl border-t border-beige/10 z-40 p-6 flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-3 pt-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-5 py-3.5 rounded-2xl text-base font-serif font-bold transition-all ${
                    isActive
                      ? "bg-rosy-brown/20 text-rosy-brown border border-rosy-brown/30"
                      : "text-beige/85 hover:text-beige hover:bg-beige/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 border-t border-beige/10 space-y-3">
            {studentUser ? (
              <Link
                href="/dashboard"
                className="w-full text-center py-3.5 rounded-2xl bg-rosy-brown text-forest-green font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Student Portal ({studentUser.name.split(" ")[0]})</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/auth/login"
                  className="text-center py-3.5 rounded-2xl border border-beige/20 text-beige font-medium text-sm hover:border-beige"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-center py-3.5 rounded-2xl bg-rosy-brown text-forest-green font-semibold text-sm hover:bg-rosy-brown/90 shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
