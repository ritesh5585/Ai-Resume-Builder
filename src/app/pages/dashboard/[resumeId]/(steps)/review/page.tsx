"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { useAI } from "@/hooks/useAI";
import { aiService, AtsScoreResult as ATSResult } from "@/services/ai.service";
import { resumeToText } from "@/lib/resume-utils";
import { TEMPLATES } from "@/component/resume/ResumePreview";
import { StepHeader, StepFooter, TextArea } from "@/component/builder/ui";
import ErrorMessage from "@/component/Error";

const verdict = (n: number) => (n >= 75 ? "Strong" : n >= 50 ? "Good start" : "Needs work");

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[13px]"><span>{label}</span><span className="text-[#5B6A63]">{value}</span></div>
      <div className="h-1 rounded-full bg-[#E6E3DC]"><div className="h-1 rounded-full bg-[#24473B]" style={{ width: `${value}%` }} /></div>
    </div>
  );
}

export default function ReviewPage() {
  const router = useRouter();
  const { resume, update, flush } = useResume();
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [finishErr, setFinishErr] = useState<string | null>(null);
  const ai = useAI(aiService.atsScore);

  const text = resumeToText(resume);
  const reason = !resume.targetRole ? "Add your target role in Personal info" : text.length < 60 ? "Fill in a few sections first" : null;

  const check = async () => {
    const res = await ai.run({ resumeText: text, jobTitle: resume.targetRole!, jobDescription: jd.trim() || undefined });
    if (res) setResult(res);
  };

  const finish = async () => {
    setFinishing(true);
    setFinishErr(null);
    if (!(await flush())) {
      setFinishing(false);
      return setFinishErr("Couldn’t save your latest changes. Try again.");
    }
    router.push(`/dashboard/${resume._id}/download`);
  };

  return (
    <>
      <StepHeader stepKey="review" />

      <section>
        <h2 className="text-[15px] font-medium">Template</h2>
        <div className="mt-3 flex gap-3">
          {TEMPLATES.map((t) => {
            const on = (resume.template ?? "classic") === t.key;
            return (
              <button key={t.key} onClick={() => update({ template: t.key })} className={`rounded-md border px-5 py-2.5 text-[14px] transition ${on ? "border-[#24473B] bg-[#24473B] text-white" : "border-[#D5D2C9] hover:border-[#24473B]"}`}>
                {t.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[15px] font-medium">ATS score</h2>
        <p className="mb-4 mt-1 text-[14px] text-[#5B6A63]">See how well your resume matches the role. Paste a job description for a sharper result (optional).</p>
        <TextArea label="Job description" rows={4} placeholder="Paste the job description here" value={jd} onChange={setJd} />
        <button onClick={check} disabled={ai.loading || !!reason} title={reason ?? undefined} className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#D5D2C9] bg-white px-4 py-2.5 text-[14px] font-medium text-[#24473B] transition hover:border-[#24473B] disabled:cursor-not-allowed disabled:opacity-50">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A88A3D]" />
          {ai.loading ? "Analysing…" : result ? "Check again" : "Check ATS score"}
        </button>
        {reason && <p className="mt-2 text-[12px] text-[#5B6A63]">{reason}</p>}
        <ErrorMessage message={ai.error} className="mt-3" />

        {result && (
          <div className="mt-6 rounded-xl border border-[#E6E3DC] p-6">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-[56px] leading-none">{result.overallScore}</span>
              <span className="text-[#5B6A63]">/ 100 · {verdict(result.overallScore)}</span>
            </div>
            <div className="mt-6 space-y-4">
              <Bar label="Keyword match" value={result.breakdown.keywords} />
              <Bar label="Action verbs" value={result.breakdown.actionVerbs} />
              <Bar label="Measurable results" value={result.breakdown.metrics} />
            </div>
            {result.missingKeywords.length > 0 && (
              <div className="mt-6">
                <div className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-[#24473B]">MISSING KEYWORDS</div>
                <div className="flex flex-wrap gap-2">{result.missingKeywords.map((k) => <span key={k} className="rounded-full bg-[#F6F5F1] px-3 py-1 text-[13px]">{k}</span>)}</div>
              </div>
            )}
            {result.suggestions.length > 0 && (
              <ul className="mt-6 list-disc space-y-1.5 pl-5 text-[14px] text-[#5B6A63]">{result.suggestions.map((s) => <li key={s}>{s}</li>)}</ul>
            )}
          </div>
        )}
      </section>

      <StepFooter stepKey="review">
        <div className="text-right">
          <button onClick={finish} disabled={finishing} className="rounded-md bg-[#24473B] px-7 py-3 text-[15px] font-medium text-white transition hover:bg-[#1B2F28] disabled:opacity-60">
            {finishing ? "Finishing…" : "Finish & download"}
          </button>
          <ErrorMessage message={finishErr} className="mt-3 text-left" />
        </div>
      </StepFooter>
    </>
  );
}