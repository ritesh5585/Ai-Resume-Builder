"use client";
import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { useAI } from "@/hooks/useAI";
import { aiService } from "@/services/ai.service";
import { splitSkills } from "@/lib/resume-utils";
import { StepHeader, StepFooter } from "@/component/builder/ui";
import TagInput from "@/component/builder/TagInput";
import ErrorMessage from "@/component/Error"; // apna path

export default function SkillsPage() {
  const { resume, update } = useResume();
  const skills = splitSkills(resume.skills);
  const [suggested, setSuggested] = useState<string[]>([]);
  const ai = useAI(aiService.generateSkills);

  const setSkills = (list: string[]) => update({ skills: list.join(", ") });
  const reason = !resume.experienceLevel || !resume.targetRole ? "Add target role and level in Personal info" : null;
  const fresh = suggested.filter((s) => !skills.some((k) => k.toLowerCase() === s.toLowerCase()));

  const suggest = async () => {
    const res = await ai.run({ experienceLevel: resume.experienceLevel!, jobTitle: resume.targetRole! });
    if (res) setSuggested(splitSkills(res.skills));
  };

  return (
    <>
      <StepHeader stepKey="skills" />
      <span className="text-[13px] font-medium">Your skills</span>
      <TagInput value={skills} onChange={setSkills} placeholder="Type a skill, press Enter" />

      <div className="mt-6 space-y-3">
        <button type="button" onClick={suggest} disabled={ai.loading || !!reason} title={reason ?? undefined} className="inline-flex items-center gap-2 rounded-md border border-[#D5D2C9] bg-white px-3.5 py-2 text-[13px] font-medium text-[#24473B] transition hover:border-[#24473B] disabled:cursor-not-allowed disabled:opacity-50">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A88A3D]" />
          {ai.loading ? "Thinking…" : "Suggest skills for my role"}
        </button>
        {reason && <p className="text-[12px] text-[#5B6A63]">{reason}</p>}
        <ErrorMessage message={ai.error} />

        {fresh.length > 0 && (
          <div className="border-l-2 border-[#A88A3D] bg-[#F6F5F1] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-[0.14em] text-[#24473B]">AI SUGGESTIONS · CLICK TO ADD</span>
              <button type="button" onClick={() => { setSkills([...skills, ...fresh]); setSuggested([]); }} className="text-[13px] font-medium text-[#24473B]">Add all</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {fresh.map((s) => (
                <button key={s} type="button" onClick={() => setSkills([...skills, s])} className="rounded-full border border-[#D5D2C9] bg-white px-3 py-1 text-[13px] transition hover:border-[#24473B]">+ {s}</button>
              ))}
            </div>
          </div>
        )}
      </div>
      <StepFooter stepKey="skills" />
    </>
  );
}