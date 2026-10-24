// lib/resume-utils.ts -> resume se text/years nikalne wale chhote helpers (AI inputs ke liye)
import type { ResumeDTO } from "@/services/resume.api";

const parse = (d?: string) => {
  const m = /^(\d{4})-(\d{2})$/.exec(d ?? "");
  return m ? new Date(+m[1], +m[2] - 1) : null;
};

// "2022-05" -> "2022-12"  =>  "7 months" / "2.5 years"  (experience AI route ko `years` chahiye)
export function yearsBetween(start?: string, end?: string) {
  const s = parse(start);
  if (!s) return "";
  const e = parse(end) ?? new Date();
  const months = Math.max(
    1,
    (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth(),
  );
  if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;
  const y = +(months / 12).toFixed(1);
  return `${y} ${y === 1 ? "year" : "years"}`;
}

export const splitSkills = (s?: string) =>
  (s ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

// ATS route ko plain text chahiye (max 6000 chars)
export function resumeToText(r: Partial<ResumeDTO>) {
  const p = r.personalInfo;
  const out: string[] = [p?.fullname ?? "", r.targetRole ?? ""];
  if (r.summary) out.push("SUMMARY", r.summary);
  if (r.workExp?.length) {
    out.push("EXPERIENCE");
    r.workExp.forEach((w) =>
      out.push(
        `${w.position} - ${w.company} (${w.startDate} - ${w.endDate || "Present"})`,
        w.description,
      ),
    );
  }
  if (r.projects?.length) {
    out.push("PROJECTS");
    r.projects.forEach((x) =>
      out.push(`${x.title} (${(x.techStack ?? []).join(", ")})`, x.description),
    );
  }
  if (r.educations?.length) {
    out.push("EDUCATION");
    r.educations.forEach((e) => out.push(`${e.degree} - ${e.institute}`));
  }
  if (r.skills) out.push("SKILLS", r.skills);
  return out.filter(Boolean).join("\n").slice(0, 6000);
}
