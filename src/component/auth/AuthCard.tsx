"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "@/component/auth/GoogleBtn";
import Error from "../Error";

interface AuthCardProps {
  initialMode?: "login" | "register";
  showCloseButton?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function AuthCard({
  initialMode = "login",
  showCloseButton = false,
  onClose,
  onSuccess,
}: AuthCardProps) {
  const { login, register: signup } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setMode(initialMode);
    setError("");
  }, [initialMode]);

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (mode === "register" && !name.trim()) return setError("Name is required");

    try {
      setLoading(true);
      if (mode === "login") {
        await login({ email: email.trim(), password });
      } else {
        await signup({ name: name.trim(), email: email.trim(), password });
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl p-7 sm:p-9 relative border border-zinc-100">
      {/* Close button */}
      {showCloseButton && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Header */}
      <h2 className="font-serif-editorial text-[22px] sm:text-[26px] font-normal text-[#171717] tracking-tight">
        {isLogin ? "Save your resume" : "Create your account"}
      </h2>
      <p className="text-[13px] text-[#6b7280] mt-1 mb-6">
        {isLogin ? "Log in to keep working and download." : "Sign up to build and save your resumes."}
      </p>

      {/* Google Button */}
      <GoogleButton onError={setError} />

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs text-zinc-400">
          <span className="bg-white px-3">or</span>
        </div>
      </div>

      {/* Error */}
      <Error message={error} />

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {!isLogin && (
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              disabled={loading}
              className="w-full h-11 px-3.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1c3933] focus:ring-1 focus:ring-[#1c3933] disabled:bg-zinc-50 transition"
            />
          </div>
        )}
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
            className="w-full h-11 px-3.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1c3933] focus:ring-1 focus:ring-[#1c3933] disabled:bg-zinc-50 transition"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            disabled={loading}
            className="w-full h-11 px-3.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#1c3933] focus:ring-1 focus:ring-[#1c3933] disabled:bg-zinc-50 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#1c3933] hover:bg-[#152c27] text-white rounded-lg text-sm font-medium transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Please wait…
            </>
          ) : isLogin ? "Log in" : "Create account"}
        </button>
      </form>

      {/* Toggle */}
      <p className="mt-5 text-center text-[13px] text-zinc-500">
        {isLogin ? "New here? " : "Already have an account? "}
        <button
          type="button"
          onClick={switchMode}
          className="text-[#1c3933] font-medium hover:underline underline-offset-4 cursor-pointer"
        >
          {isLogin ? "Create an account" : "Log in"}
        </button>
      </p>
    </div>
  );
}
