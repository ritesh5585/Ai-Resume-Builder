"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "U";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm transition-all border-b border-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Name - Vitae */}
          <Link href="/" className="inline-block group">
            <span className="font-serif-editorial text-2xl sm:text-3xl font-medium tracking-tight text-[#171717] group-hover:opacity-80 transition-opacity">
              Vitae
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-9 text-[15px] text-[#4b5563]">
            <Link
              href="/pages/resume"
              className="hover:text-[#111827] transition-colors font-normal"
            >
              Templates
            </Link>
            <a
              href="#how-it-works"
              className="hover:text-[#111827] transition-colors font-normal cursor-pointer"
            >
              How it works
            </a>

            {/* Auth State */}
            {loading ? (
              <div className="w-16 h-5 bg-zinc-100 rounded animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1b3731] text-white flex items-center justify-center text-xs font-semibold">
                    {getInitials(user.name, user.email)}
                  </div>
                  <span className="text-sm font-medium text-[#111827] max-w-[120px] truncate">
                    {user.name || user.email?.split("@")[0]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? "..." : "Logout"}
                </button>
              </div>
            ) : (
              <Link
                href="/pages/auth/login"
                className="hover:text-[#111827] transition-colors font-normal ml-1"
              >
                Log in
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {!loading && !user && (
              <Link
                href="/pages/auth/login"
                className="text-sm font-medium text-[#111827] px-2 py-1"
              >
                Log in
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-700 hover:text-zinc-950 rounded-lg transition"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-100 space-y-3 bg-white">
            <Link
              href="/pages/resume"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1.5 text-base text-[#4b5563] hover:text-[#111827]"
            >
              Templates
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1.5 text-base text-[#4b5563] hover:text-[#111827]"
            >
              How it works
            </a>
            {user ? (
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between px-2">
                <span className="text-sm text-zinc-700 truncate max-w-[200px]">
                  {user.name || user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/pages/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-base text-[#1b3731] font-medium"
              >
                Log in
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
