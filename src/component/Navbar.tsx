"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, loading, requireAuth, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
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
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:bg-zinc-800 transition-colors">
                R
              </div>
              <span className="font-semibold text-lg tracking-tight text-zinc-950">
                Resume<span className="text-zinc-500 font-normal">Forge</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-600">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg hover:text-zinc-950 hover:bg-zinc-100/70 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/pages/resume"
                className="px-3 py-1.5 rounded-lg hover:text-zinc-950 hover:bg-zinc-100/70 transition-colors"
              >
                Builder
              </Link>
            </nav>
          </div>

          {/* Right Section: Auth State */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-100 animate-pulse" />
                <div className="w-20 h-4 bg-zinc-100 rounded animate-pulse hidden sm:block" />
              </div>
            ) : user ? (
              /* User is Logged In */
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold shadow-inner">
                      {getInitials(user.name, user.email)}
                    </div>
                    {/* Online / Active status badge */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-zinc-900 truncate max-w-[120px]">
                      {user.name || "User"}
                    </span>
                    <span className="text-[11px] text-zinc-500 truncate max-w-[140px]">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl transition shadow-sm active:scale-[0.98] disabled:opacity-50"
                  aria-label="Logout"
                >
                  {isLoggingOut ? (
                    <>
                      <svg
                        className="animate-spin h-3.5 w-3.5 text-zinc-600"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-zinc-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* User is NOT Logged In */
              <div className="flex items-center gap-2">

                <Link
                  href="/pages/auth/login"
                  className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition shadow-sm active:scale-[0.98]"
                >
                  Sign in
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-zinc-200/70 space-y-1">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Home
            </Link>
            <Link
              href="/pages/resume"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Resume Builder
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
