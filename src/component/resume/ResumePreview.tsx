// components/resume/ResumePreview.tsx -> PURE component: data + template -> A4 resume
// Builder preview, dashboard thumbnail aur download page teeno yahi use karenge.
import { memo } from "react";
import type { ResumeDTO } from "@/services/resume.api";

export type TemplateKey = "classic" | "modern";
export const TEMPLATES: { key: TemplateKey; label: string }[] = [
  { key: "classic", label: "Classic" },
  { key: "modern", label: "Modern" },
];

// Template = style tokens. Layout single-column hi rakha hai (ATS ke liye best)
const THEMES = {
  classic: {
    name: "font-serif text-[34px] leading-tight text-[#1B2F28]",
    heading: "mb-2 mt-6 border-b border-[#E6E3DC] pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#24473B]",
    rule: "bg-[#A88A3D]",
  },
  modern: {
    name: "text-[30px] font-semibold uppercase leading-tight tracking-[0.04em] text-[#24473B]",
    heading: "mb-2 mt-6 border-l-[3px] border-[#A88A3D] pl-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#1B2F28]",
    rule: "bg-[#24473B]",
  },
} as const;

const bullets = (t?: string) =>
  (t ?? "").split("\n").map((l) => l.replace(/^\s*[-•*]\s*/, "").trim()).filter(Boolean);
const fmt = (d?: string) => {
  const m = /^(\d{4})-(\d{2})$/.exec(d ?? "");
  return m ? new Date(+m[1], +m[2] - 1).toLocaleDateString("en", { month: "short", year: "numeric" }) : d ?? "";
};
const dates = (s?: string, e?: string) => (s ? `${fmt(s)} – ${e ? fmt(e) : "Present"}` : fmt(e));
const clean = (u?: string) => (u ?? "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Section({ title, cls, children }: { title: string; cls: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className={cls}>{title}</h2>
      {children}
    </section>
  );
}

function ResumePreview({ data, template = "classic" }: { data: Partial<ResumeDTO>; template?: TemplateKey }) {
  const t = THEMES[template];
  const p = data.personalInfo;
  const contact = [p?.email, p?.mobile, p?.location, clean(p?.githubURL), clean(p?.portfolio)].filter(Boolean);
  const skills = (data.skills ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const work = data.workExp ?? [];
  const projects = data.projects ?? [];
  const education = data.educations ?? [];

  return (
    <div className="min-h-[1123px] w-[794px] bg-white px-12 py-12 print:min-h-0 print:w-full print:px-0 print:py-0 font-sans text-[13px] leading-[1.55] text-[#1B2F28]">
      <header>
        <h1 className={`${t.name} ${p?.fullname ? "" : "opacity-30"}`}>{p?.fullname || "Your Name"}</h1>
        {contact.length > 0 && <p className="mt-2 text-[12px] text-[#5B6A63]">{contact.join("  |  ")}</p>}
        <div className={`mt-4 h-[2px] w-10 ${t.rule}`} />
      </header>

      {data.summary?.trim() && (
        <Section title="Summary" cls={t.heading}>
          <p>{data.summary}</p>
        </Section>
      )}

      {work.length > 0 && (
        <Section title="Experience" cls={t.heading}>
          {work.map((w, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between gap-4">
                <div>
                  <span className="font-semibold">{w.position}</span>
                  {w.company && <span className="text-[#5B6A63]"> · {w.company}</span>}
                </div>
                <span className="shrink-0 text-[12px] text-[#5B6A63]">{dates(w.startDate, w.endDate)}</span>
              </div>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {bullets(w.description).map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects" cls={t.heading}>
          {projects.map((pr, i) => (
            <div key={i} className="mb-3">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-semibold">{pr.title}</span>
                {pr.techStack?.length > 0 && <span className="text-[12px] text-[#5B6A63]">{pr.techStack.join(", ")}</span>}
              </div>
              {pr.description && <p className="mt-0.5">{pr.description}</p>}
              {(pr.githubURL || pr.liveURL) && (
                <p className="mt-0.5 text-[12px] text-[#5B6A63]">
                  {[clean(pr.githubURL), clean(pr.liveURL)].filter(Boolean).join("  |  ")}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" cls={t.heading}>
          {education.map((e, i) => (
            <div key={i} className="mb-2 flex justify-between gap-4">
              <div>
                <span className="font-semibold">{e.degree}</span>
                {e.institute && <span className="text-[#5B6A63]"> · {e.institute}</span>}
              </div>
              <span className="shrink-0 text-[12px] text-[#5B6A63]">{dates(e.startDate, e.endDate)}</span>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" cls={t.heading}>
          <p>{skills.join(", ")}</p>
        </Section>
      )}
    </div>
  );
}

export default memo(ResumePreview);