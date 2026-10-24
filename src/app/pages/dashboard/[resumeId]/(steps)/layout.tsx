"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDeferredValue } from "react";
import { useResume } from "@/context/ResumeContext";
import { STEPS, getProgress } from "@/lib/step";
import ResumePreview from "@/component/resume/ResumePreview";

const S = 0.56;

export default function StepsLayout({ children }: { children: React.ReactNode }) {
    const { resume, status, saveError, retry } = useResume();
    const pathname = usePathname();
    const preview = useDeferredValue(resume);
    const { done } = getProgress(resume);
    const base = `/dashboard/${resume._id}`;
    const label = { idle: "", dirty: "Unsaved changes", saving: "Saving…", saved: "All changes saved", error: "" }[status];

    return (
        <div className="min-h-screen bg-white font-sans text-[#1B2F28]">
            <header className="flex h-16 items-center justify-between border-b border-[#E6E3DC] px-6 sm:px-10">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="font-serif text-[24px]">Vitae</Link>
                    <span className="hidden truncate text-[14px] text-[#5B6A63] sm:block">{resume.title || resume.personalInfo?.fullname || "Untitled resume"}</span>
                </div>
                {status === "error" ? (
                    <button onClick={retry} title={saveError ?? ""} className="text-[13px] font-medium text-red-600">Couldn’t save · Retry</button>
                ) : (
                    <span className="text-[13px] text-[#5B6A63]">{label}</span>
                )}
            </header>

            <nav className="flex gap-6 overflow-x-auto border-b border-[#E6E3DC] px-6 sm:px-10" aria-label="Resume steps">
                {STEPS.map((s, i) => {
                    const active = pathname.endsWith(`/${s.key}`);
                    const isDone = s.key !== "review" && done[s.key as keyof typeof done];
                    return (
                        <Link key={s.key} href={`${base}/${s.key}`} className={`flex shrink-0 items-center gap-2 border-b-2 px-1 py-4 text-[14px] transition ${active ? "border-[#A88A3D] font-medium" : "border-transparent text-[#5B6A63] hover:text-[#1B2F28]"}`}>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] ${isDone ? "bg-[#24473B] text-white" : "border border-[#D5D2C9]"}`}>{isDone ? "✓" : i + 1}</span>
                            {s.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_520px]">
                <main className="min-w-0 px-6 py-10 sm:px-10 lg:px-12">
                    <div className="max-w-[600px]">{children}</div>
                </main>
                <aside className="hidden border-l border-[#E6E3DC] bg-[#F6F5F1] lg:block">
                    <div className="sticky top-6 p-8">
                        <div className="mx-auto overflow-hidden border border-[#E6E3DC] bg-white shadow-[0_12px_32px_rgba(27,47,40,0.08)]" style={{ width: 794 * S, height: 1123 * S }}>
                            <div style={{ width: 794, transform: `scale(${S})`, transformOrigin: "top left" }}>
                                <ResumePreview data={preview} template={resume.template ?? "classic"} />
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}