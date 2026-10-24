"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { resumeService, ResumeDTO } from "@/services/resume.api";
import { getProgress } from "@/lib/step";

const btnPrimary =
    "inline-flex items-center justify-center rounded-md bg-[#24473B] px-6 py-3 text-[15px] font-medium text-white transition hover:bg-[#1B2F28] disabled:opacity-60";
const btnGhost =
    "inline-flex items-center justify-center rounded-md border border-[#D5D2C9] bg-white px-6 py-3 text-[15px] font-medium text-[#24473B] transition hover:border-[#24473B]";

function timeAgo(date: string) {
    const diff = (new Date(date).getTime() - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const units: [Intl.RelativeTimeFormatUnit, number][] = [["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [unit, secs] of units) {
        if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
    }
    return "just now";
}

function ResumeCard({ resume }: { resume: ResumeDTO }) {
    const p = getProgress(resume);
    return (
        <Link
            href={`/dashboard/${resume._id}/${p.next}`}
            className="group flex flex-col rounded-xl border border-[#E6E3DC] bg-white p-6 transition hover:border-[#24473B]/50 hover:shadow-[0_12px_32px_rgba(27,47,40,0.07)]"
        >
            <h3 className="font-serif text-[22px] leading-tight text-[#1B2F28]">
                {resume.title || "Untitled resume"}
            </h3>
            <p className="mt-1 text-[14px] text-[#5B6A63]">
                {resume.personalInfo?.fullname || "No name added yet"}
            </p>

            <div className="mt-8">
                <div className="mb-2 flex justify-between text-[12px] text-[#5B6A63]">
                    <span>
                        {p.completed} of {p.total} steps
                    </span>
                    <span>{p.percent}%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-[#E6E3DC]">
                    <div className="h-1 rounded-full bg-[#24473B]" style={{ width: `${p.percent}%` }} />
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-[13px]">
                <span className="text-[#5B6A63]">Edited {timeAgo(resume.updatedAt)}</span>
                <span className="font-medium text-[#24473B] transition group-hover:translate-x-0.5">
                    {p.completed === p.total ? "Review" : "Continue"} →
                </span>
            </div>
        </Link>
    );
}

function Skeleton() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-[#E6E3DC] p-6">
                    <div className="h-5 w-2/3 rounded bg-[#EFEDE7]" />
                    <div className="mt-3 h-3 w-1/3 rounded bg-[#EFEDE7]" />
                    <div className="mt-10 h-1 w-full rounded bg-[#EFEDE7]" />
                    <div className="mt-6 h-3 w-1/2 rounded bg-[#EFEDE7]" />
                </div>
            ))}
        </div>
    );
}

function Panel({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-[#E6E3DC] bg-[#F6F5F1] px-6 py-14 text-center">
            <svg className="mx-auto mb-5" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A88A3D" strokeWidth="1.4" aria-hidden="true">
                <path d="M7 3h7l5 5v13H7z M14 3v5h5" />
            </svg>
            <h3 className="font-serif text-[24px] text-[#1B2F28]">{title}</h3>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[#5B6A63]">{text}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>
        </div>
    );
}

export default function RecentResumes({ onCreate, creating }: { onCreate: () => void; creating: boolean }) {
    const { user, loading, requireAuth } = useAuth();
    const userId = user?._id;
    const [items, setItems] = useState<ResumeDTO[] | null>(null);
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!userId) {
            setItems(null);
            return;
        }
        const ctrl = new AbortController();
        setError("");
        resumeService
            .list(ctrl.signal)
            .then(setItems)
            .catch((e: Error) => e.name !== "AbortError" && setError(e.message));
        return () => ctrl.abort();
    }, [userId, attempt]);

    let body: React.ReactNode;
    if (loading || (userId && !items && !error)) {
        body = <Skeleton />;
    } else if (!user) {
        body = (
            <Panel title="Your resumes will live here" text="Sign in to pick up where you left off, or create an account to start your first resume.">
                <button className={btnPrimary} onClick={() => requireAuth(undefined, "login")}>Sign in</button>
                <button className={btnGhost} onClick={() => requireAuth(undefined, "register")}>Create account</button>
            </Panel>
        );
    } else if (error) {
        body = (
            <Panel title="Couldn’t load your resumes" text={error}>
                <button className={btnGhost} onClick={() => { setItems(null); setAttempt((a) => a + 1); }}>Try again</button>
            </Panel>
        );
    } else if (items && items.length === 0) {
        body = (
            <Panel title="No resumes yet" text="Start your first one. It takes a few short steps and AI helps where you get stuck.">
                <button className={btnPrimary} onClick={onCreate} disabled={creating}>Create new resume</button>
            </Panel>
        );
    } else {
        body = (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items!.map((r) => <ResumeCard key={r._id} resume={r} />)}
            </div>
        );
    }

    return (
        <section>
            <h2 className="mb-8 font-serif text-[32px] text-[#1B2F28]">Recently created</h2>
            {body}
        </section>
    );
}