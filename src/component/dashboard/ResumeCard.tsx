import Link from "next/link";
import { ResumeDTO } from "@/services/resume.api";
import { getProgress } from "@/lib/step";
import ResumePreview from "@/component/resume/ResumePreview";

function timeAgo(date: string) {
  const diff = (new Date(date).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return "just now";
}

export default function ResumeCard({ resume }: { resume: ResumeDTO }) {
  const p = getProgress(resume);
  return (
    <Link
      href={`/dashboard/${resume._id}/${p.next}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#E6E3DC] bg-white transition hover:border-[#24473B]/50 hover:shadow-[0_12px_32px_rgba(27,47,40,0.07)]"
    >

      <div aria-hidden className="pointer-events-none flex h-[210px] justify-center overflow-hidden border-b border-[#E6E3DC] bg-[#F6F5F1] pt-5">
        <div className="shrink-0 origin-top" style={{ width: 794, transform: "scale(0.2)" }}>
          <ResumePreview data={resume} />
        </div>
      </div>

      <div className="p-5">
        <h3 className="truncate font-serif text-[21px] leading-tight text-[#1B2F28]">
          {resume.title || resume.personalInfo?.fullname || "Untitled resume"}
        </h3>
        <p className="mt-1 text-[13px] text-[#5B6A63]">Edited {timeAgo(resume.updatedAt)}</p>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-[12px] text-[#5B6A63]">
            <span>{p.completed} of {p.total} steps</span>
            <span>{p.percent}%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-[#E6E3DC]">
            <div className="h-1 rounded-full bg-[#24473B] transition-all" style={{ width: `${p.percent}%` }} />
          </div>
        </div>

        <div className="mt-5 text-[13px] font-medium text-[#24473B] transition group-hover:translate-x-0.5">
          {p.completed === p.total ? "Review" : "Continue"} →
        </div>
      </div>
    </Link>
  );
}