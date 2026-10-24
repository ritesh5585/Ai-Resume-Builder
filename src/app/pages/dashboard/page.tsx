"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { resumeService } from "@/services/resume.api";
import StepsFlow from "@/component/dashboard/StepsFlow";
import RecentResumes from "@/component/dashboard/RecentResumes";

export default function DashboardPage() {
  const router = useRouter();
  const { loading, requireAuth } = useAuth();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const createResume = async () => {
    if (creating) return;
    setError("");
    setCreating(true);
    try {
      const resume = await resumeService.create();
      router.push(`/dashboard/${resume._id}/personal`);
    } catch (e) {
      setError((e as Error).message);
      setCreating(false);
    }
  };

  const handleCreate = () => requireAuth(createResume);

  return (
    <div className="min-h-screen bg-white font-sans text-[#1B2F28]">

      <main className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <section className="py-16 sm:py-20">
          <h1 className="mt-5 max-w-3xl font-serif text-[44px] font-normal leading-[1.05] tracking-[-0.01em] sm:text-[60px]">
            Build your next resume.
          </h1>
          <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-[#5B6A63]">
            A few short steps, one at a time. AI helps where you get stuck, and everything you type is saved as you go.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              onClick={handleCreate}
              disabled={creating || loading}
              className="inline-flex items-center gap-2.5 rounded-md bg-[#24473B] px-7 py-4 text-[15px] font-medium text-white transition hover:bg-[#1B2F28] disabled:opacity-60"
            >
              {!creating && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M8 2v12M2 8h12" />
                </svg>
              )}
              {creating ? "Creating your resume…" : "Create new resume"}
            </button>
            <span className="text-[14px] text-[#5B6A63]">Download as PDF when you’re done</span>
          </div>
          {error && <p className="mt-4 text-[14px] text-red-600">{error}</p>}
        </section>

        <section className="border-t border-[#E6E3DC] py-16">
          <h2 className="font-serif text-[32px]">How it works</h2>
          <p className="mb-12 mt-2 max-w-xl text-[16px] text-[#5B6A63]">
            Seven short steps. You can leave any time and continue exactly where you stopped.
          </p>
          <StepsFlow />
        </section>

        <section className="border-t border-[#E6E3DC] py-16">
          <RecentResumes onCreate={handleCreate} creating={creating} />
        </section>
      </main>

      <footer className="mx-auto max-w-[1160px] px-6 pb-12 pt-4 text-[13px] text-[#5B6A63] sm:px-10">
        © Vitae
      </footer>
    </div>
  );
}