"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";

type FormValues = {
  name?: string;
  email: string;
  mobile?: string;
  password: string;
};

export default function AuthModal() {
  const { modalOpen, closeAuth, login, register: signup } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAuth();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen, closeAuth]);

  if (!modalOpen) return null;

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setServerError("");
    reset();
  };

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    try {
      if (mode === "login") {
        await login({ email: values.email.trim(), password: values.password });
      } else {
        await signup({
          name: values.name?.trim() || "",
          email: values.email.trim(),
          password: values.password,
          mobile: values.mobile?.trim() || undefined,
        });
      }
      reset();
      closeAuth();
    } catch (err: any) {
      setServerError(err?.message || "Authentication failed. Please try again.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/35 backdrop-blur-md transition-all duration-200"
      onClick={closeAuth}
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-white border border-zinc-200/90 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuth}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-zinc-200 text-zinc-950 font-bold text-base shadow-sm mb-3">
            R
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {mode === "login"
              ? "Sign in to save and sync your resume changes"
              : "Register to unlock all resume builder tools"}
          </p>
        </div>

        {/* Minimalist Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-xl mb-5 text-xs font-medium">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`py-2 rounded-lg transition-all ${mode === "login"
                ? "bg-white text-zinc-950 font-semibold shadow-sm border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-900"
              }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`py-2 rounded-lg transition-all ${mode === "register"
                ? "bg-white text-zinc-950 font-semibold shadow-sm border border-zinc-200/60"
                : "text-zinc-500 hover:text-zinc-900"
              }`}
          >
            Create account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          {serverError && (
            <div
              role="alert"
              className="text-xs text-red-600 bg-red-50/70 border border-red-200/70 px-3.5 py-2.5 rounded-xl flex items-start gap-2"
            >
              <svg
                className="w-4 h-4 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Alex Morgan"
                  disabled={isSubmitting}
                  className="w-full h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-50 transition"
                  {...register("name", {
                    required: mode === "register" ? "Full name is required" : false,
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Mobile
                  </label>
                  <span className="text-[11px] text-zinc-400">Optional</span>
                </div>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  disabled={isSubmitting}
                  className="w-full h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-50 transition"
                  {...register("mobile")}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              disabled={isSubmitting}
              className="w-full h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-50 transition"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={mode === "register" ? "Min. 6 characters" : "Your password"}
                disabled={isSubmitting}
                className="w-full h-10 pl-3.5 pr-10 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-50 transition"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 mt-1 bg-zinc-950 hover:bg-zinc-800 active:scale-[0.99] text-white rounded-xl text-sm font-medium transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span>Please wait...</span>
              </>
            ) : mode === "login" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </button>
        </form>

        {/* Switch Link */}
        <p className="mt-5 text-center text-xs text-zinc-500">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="text-zinc-950 font-semibold hover:underline underline-offset-4"
          >
            {mode === "login" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}