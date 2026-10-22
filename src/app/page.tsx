import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-50/50 via-white to-zinc-50/30">
      <div className="max-w-3xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-700 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          AI-Powered ATS Resume Builder
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-zinc-950">
          Build resumes that get you{" "}
          <span className="underline decoration-zinc-300 underline-offset-8">hired faster</span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Craft ATS-optimized, modern resumes with instant previews, clean formatting,
          and seamless cloud sync.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/pages/resume"
            className="px-6 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 active:scale-[0.98] text-white text-sm font-medium transition shadow-sm"
          >
            Create your resume
          </Link>
          <Link
            href="/pages/auth/login"
            className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-50 active:scale-[0.98] text-zinc-900 border border-zinc-200 text-sm font-medium transition shadow-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
