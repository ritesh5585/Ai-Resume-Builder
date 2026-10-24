"use client";
import { useResume } from "@/context/ResumeContext";
import { StepHeader, StepFooter, TextField, SelectField } from "@/component/builder/ui";
import type { PersonalInfo } from "@/types/resume.type";

const LEVELS = ["Fresher", "Junior", "Mid-level", "Senior"];

export default function PersonalPage() {
    const { resume, update } = useResume();
    const p: Partial<PersonalInfo> = resume.personalInfo ?? {};
    const f = (k: keyof PersonalInfo) => ({
        value: p[k] ?? "",
        onChange: (v: string) => update({ personalInfo: { ...resume.personalInfo, [k]: v } }),
    });

    return (
        <>
            <StepHeader stepKey="personal" />
            <div className="space-y-5">
                <TextField label="Resume name" placeholder="e.g. Frontend Developer resume" value={resume.title ?? ""} onChange={(v) => update({ title: v })} hint="Only for you, it isn’t shown on the resume." />
                <div className="grid gap-5 sm:grid-cols-2">
                    <TextField label="Target role" placeholder="e.g. Frontend Developer" value={resume.targetRole ?? ""} onChange={(v) => update({ targetRole: v })} hint="AI uses this to tailor everything." />
                    <SelectField label="Experience level" placeholder="Select level" options={LEVELS} value={resume.experienceLevel ?? ""} onChange={(v) => update({ experienceLevel: v })} />
                </div>
                <div className="border-t border-[#E6E3DC] pt-5" />
                <TextField label="Full name" placeholder="Your full name" {...f("fullname")} />
                <div className="grid gap-5 sm:grid-cols-2">
                    <TextField label="Email" type="email" placeholder="you@example.com" {...f("email")} />
                    <TextField label="Mobile" placeholder="+91 98765 43210" {...f("mobile")} />
                </div>
                <TextField label="Location" placeholder="City, Country" {...f("location")} />
                <div className="grid gap-5 sm:grid-cols-2">
                    <TextField label="GitHub" placeholder="github.com/username" {...f("githubURL")} />
                    <TextField label="Portfolio" placeholder="yoursite.com" {...f("portfolio")} />
                </div>
            </div>
            <StepFooter stepKey="personal" />
        </>
    );
}