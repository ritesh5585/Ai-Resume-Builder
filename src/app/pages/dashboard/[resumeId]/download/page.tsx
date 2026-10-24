"use client";
import Link from "next/link";
import { useResume } from "@/context/ResumeContext";
import ResumePreview from "@/component/resume/ResumePreview";

const S = 0.62;

export default function DownloadPage() {
    const { resume } = useResume();
    const template = resume.template ?? "classic";

    const download = () => {
        const prev = document.title;
        document.title = `${(resume.personalInfo?.fullname || "resume").trim().replace(/\s+/g, "-")}-resume`; // PDF ka file name
        window.print();
        document.title = prev;
    };

    return (
        <>
            <div className="min-h-screen bg-white font-sans text-[#1B2F28] print:hidden">
                <header className="mx-auto flex h-20 max-w-[1160px] items-center px-6 sm:px-10">
                    <Link href="/dashboard" className="font-serif text-[26px]">Vitae</Link>
                </header>
                <main className="mx-auto flex max-w-[1160px] flex-col items-center justify-center gap-14 px-6 py-10 sm:px-10 lg:flex-row lg:gap-24">
                    <div className="max-w-[440px]">
                        <svg width="44" height="44" viewBox="0 0 44 44" role="img" aria-label="Done">
                            <circle cx="22" cy="22" r="21" fill="none" stroke="#A88A3D" />
                            <path d="M13 23l6 6 12-13" fill="none" stroke="#24473B" strokeWidth="2.4" />
                        </svg>
                        <h1 className="mt-6 font-serif text-[48px] font-normal leading-[1.08] sm:text-[56px]">Your resume is ready.</h1>
                        <p className="mt-4 text-[17px] leading-relaxed text-[#5B6A63]">
                            Download it as a PDF. In the print window choose “Save as PDF” and turn off headers and footers.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <button onClick={download} className="rounded-md bg-[#24473B] px-7 py-3.5 text-[15px] font-medium text-white transition hover:bg-[#1B2F28]">Download PDF</button>
                            <Link href={`/dashboard/${resume._id}/review`} className="rounded-md border border-[#D5D2C9] px-6 py-3.5 text-[15px] font-medium text-[#24473B] transition hover:border-[#24473B]">Change template</Link>
                        </div>
                        <div className="mt-7 flex gap-5 text-[15px] font-medium text-[#24473B]">
                            <Link href={`/dashboard/${resume._id}/personal`}>Edit resume</Link>
                            <Link href="/dashboard">Back to dashboard</Link>
                        </div>
                    </div>

                    <div className="bg-[#F6F5F1] p-10">
                        <div className="overflow-hidden border border-[#E6E3DC] bg-white shadow-[0_12px_32px_rgba(27,47,40,0.08)]" style={{ width: 794 * S, height: 1123 * S }}>
                            <div style={{ width: 794, transform: `scale(${S})`, transformOrigin: "top left" }}>
                                <ResumePreview data={resume} template={template} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* Sirf print me dikhta hai: asli size, real text (ATS padh sakta hai) */}
            <div className="hidden print:block"><ResumePreview data={resume} template={template} /></div>
        </>
    );
}