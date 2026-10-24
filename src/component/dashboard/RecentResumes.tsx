"use client";
import { useAuth } from "@/context/AuthContext";
import { useResumes } from "@/hooks/useResume";
import ErrorMessage from "@/component/Error";
import ResumeCard from "./ResumeCard";

const btnPrimary =
    "inline-flex items-center justify-center rounded-md bg-[#24473B] px-6 py-3 text-[15px] font-medium text-white transition hover:bg-[#1B2F28] disabled:opacity-60";
const btnGhost =
    "inline-flex items-center justify-center rounded-md border border-[#D5D2C9] bg-white px-6 py-3 text-[15px] font-medium text-[#24473B] transition hover:border-[#24473B]";

function Skeleton() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-[#E6E3DC]">
                    <div className="h-[210px] bg-[#F6F5F1]" />
                    <div className="space-y-3 p-5">
                        <div className="h-5 w-2/3 rounded bg-[#EFEDE7]" />
                        <div className="h-3 w-1/3 rounded bg-[#EFEDE7]" />
                        <div className="h-1 w-full rounded bg-[#EFEDE7]" />
                    </div>
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
            <div className="mx-auto mt-7 flex max-w-md flex-wrap justify-center gap-3">{children}</div>
        </div>
    );
}

export default function RecentResumes({ onCreate, creating }: { onCreate: () => void; creating: boolean }) {
    const { user, loading: authLoading, requireAuth } = useAuth();
    const { items, loading, error, retry } = useResumes(!!user);

    let body: React.ReactNode;
    if (authLoading || loading) {
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
            <Panel title="Couldn’t load your resumes" text="Something went wrong while fetching them.">
                <ErrorMessage message={error} className="w-full text-left" />
                <button className={btnGhost} onClick={retry}>Try again</button>
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
                {items?.map((r) => <ResumeCard key={r._id} resume={r} />)}
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