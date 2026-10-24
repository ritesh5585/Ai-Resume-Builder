"use client";
import { useResume } from "@/context/ResumeContext";
import { useListKeys } from "@/hooks/useListKeys";
import { aiService } from "@/services/ai.service";
import { yearsBetween } from "@/lib/resume-utils";
import { StepHeader, StepFooter, TextField, TextArea, Entry, AddButton } from "@/component/builder/ui";
import AIAssist from "@/component/builder/AIassist";
import type { WorkExp } from "@/types/resume.type";

const blank: WorkExp = { company: "", position: "", startDate: "", endDate: "", description: "" };

function Item({ w, onChange }: { w: WorkExp; onChange: (p: Partial<WorkExp>) => void }) {
    const { resume } = useResume();
    const level = resume.experienceLevel;
    const role = w.position || resume.targetRole;
    const genReason = !level ? "Pick your experience level in Personal info" : !role ? "Add a job title first" : !w.startDate ? "Add a start date first" : null;

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Job title" placeholder="Frontend Developer" value={w.position} onChange={(v) => onChange({ position: v })} />
                <TextField label="Company" placeholder="Company name" value={w.company} onChange={(v) => onChange({ company: v })} />
                <TextField label="Start date" type="month" value={w.startDate} onChange={(v) => onChange({ startDate: v })} />
                <TextField label="End date" type="month" value={w.endDate} onChange={(v) => onChange({ endDate: v })} hint="Leave empty if you work here now." />
            </div>
            <TextArea label="What did you do?" rows={6} placeholder="One achievement per line" value={w.description} onChange={(v) => onChange({ description: v })} hint="Each line becomes a bullet. Replace [X%] placeholders with your real numbers." />
            <AIAssist
                onUse={(t) => onChange({ description: t })}
                actions={[
                    {
                        label: "Generate bullets",
                        disabledReason: genReason,
                        run: async () =>
                            (await aiService.generateExperience({ experienceLevel: level!, jobRole: role!, years: yearsBetween(w.startDate, w.endDate), company: w.company, techStack: (resume.skills ?? "").slice(0, 400) })).bullets.join("\n"),
                    },
                    {
                        label: "Improve my text",
                        disabledReason: w.description?.trim() ? null : "Write something first, then AI can improve it",
                        run: async () => (await aiService.improveContent({ content: w.description, sectionType: "experience", jobTitle: resume.targetRole })).improved,
                    },
                ]}
            />
        </>
    );
}

export default function ExperiencePage() {
    const { resume, update } = useResume();
    const items = resume.workExp ?? [];
    const { keys, add, remove } = useListKeys(items.length);

    const edit = (i: number, p: Partial<WorkExp>) => update({ workExp: items.map((w, k) => (k === i ? { ...w, ...p } : w)) });

    return (
        <>
            <StepHeader stepKey="experience" />
            {items.length === 0 && <p className="mb-5 text-[15px] text-[#5B6A63]">No experience yet? Fresher? You can skip this step and showcase projects instead.</p>}
            <div className="space-y-5">
                {items.map((w, i) => (
                    <Entry key={keys[i] ?? i} title={w.position || w.company || `Experience ${i + 1}`} onRemove={() => { remove(i); update({ workExp: items.filter((_, k) => k !== i) }); }}>
                        <Item w={w} onChange={(p) => edit(i, p)} />
                    </Entry>
                ))}
                <AddButton label="Add experience" onClick={() => { add(); update({ workExp: [...items, { ...blank }] }); }} />
            </div>
            <StepFooter stepKey="experience" />
        </>
    );
}