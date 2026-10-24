"use client";
import { useResume } from "@/context/ResumeContext";
import { aiService } from "@/services/ai.service";
import { splitSkills } from "@/lib/resume-utils";
import { StepHeader, StepFooter, TextArea } from "@/component/builder/ui";
import AIAssist from "@/component/builder/AIassist";

export default function SummaryPage() {
    const { resume, update } = useResume();
    const summary = resume.summary ?? "";
    const words = summary.trim() ? summary.trim().split(/\s+/).length : 0;
    const { experienceLevel: level, targetRole: role, skills } = resume;

    return (
        <>
            <StepHeader stepKey="summary" />
            <TextArea label="Professional summary" rows={6} placeholder="2–3 sentences about who you are and what you bring" value={summary} onChange={(v) => update({ summary: v })} hint={`${words} words · 40–50 is ideal`} />
            <div className="mt-5">
                <AIAssist
                    onUse={(t) => update({ summary: t })}
                    actions={[
                        {
                            label: "Generate summary",
                            disabledReason: !level || !role ? "Add target role and level in Personal info" : !skills?.trim() ? "Add your skills first, the summary is built from them" : null,
                            run: async () => (await aiService.generateSummary({ experienceLevel: level!, jobTitle: role!, skills: splitSkills(skills) })).summary,
                        },
                        {
                            label: "Improve my text",
                            disabledReason: summary.trim() ? null : "Write something first, then AI can improve it",
                            run: async () => (await aiService.improveContent({ content: summary, sectionType: "summary", jobTitle: role })).improved,
                        },
                    ]}
                />
            </div>
            <StepFooter stepKey="summary" />
        </>
    );
}