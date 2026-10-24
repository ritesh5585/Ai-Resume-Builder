// lib/steps.ts -> steps ki list EK jagah
import type { ResumeDTO } from "@/services/resume.api";

export const STEPS = [
  {
    key: "personal",
    label: "Personal info",
    desc: "Name, contact and your target role",
    ai: false,
  },
  {
    key: "experience",
    label: "Experience",
    desc: "Your roles, written as strong bullets",
    ai: true,
  },
  {
    key: "projects",
    label: "Projects",
    desc: "What you built and the tech behind it",
    ai: true,
  },
  {
    key: "education",
    label: "Education",
    desc: "Degrees, institutes and years",
    ai: false,
  },
  {
    key: "skills",
    label: "Skills",
    desc: "Suggested for your role and level",
    ai: true,
  },
  {
    key: "summary",
    label: "Summary",
    desc: "A short, sharp introduction",
    ai: true,
  },
  {
    key: "review",
    label: "Review & download",
    desc: "ATS score, template and PDF",
    ai: true,
  },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];

export function getProgress(r: Partial<ResumeDTO>) {
  const done: Record<Exclude<StepKey, "review">, boolean> = {
    personal: !!(r.personalInfo?.fullname && r.personalInfo?.email),
    experience: (r.workExp?.length ?? 0) > 0,
    projects: (r.projects?.length ?? 0) > 0,
    education: (r.educations?.length ?? 0) > 0,
    skills: !!r.skills?.trim(),
    summary: !!r.summary?.trim(),
  };
  const total = Object.keys(done).length;
  const completed = Object.values(done).filter(Boolean).length;
  const next =
    STEPS.find((s) => s.key !== "review" && !done[s.key as keyof typeof done])
      ?.key ?? "review";
  return {
    done,
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    next,
  };
}
