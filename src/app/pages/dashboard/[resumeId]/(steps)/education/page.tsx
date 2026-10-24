"use client";
import { useResume } from "@/context/ResumeContext";
import { useListKeys } from "@/hooks/useListKeys";
import { StepHeader, StepFooter, TextField, Entry, AddButton } from "@/component/builder/ui";
import type { Education } from "@/types/resume.type";

const blank: Education = { institute: "", degree: "", startDate: "", endDate: "" };

export default function EducationPage() {
    const { resume, update } = useResume();
    const items = resume.educations ?? [];
    const { keys, add, remove } = useListKeys(items.length);
    const edit = (i: number, v: Partial<Education>) => update({ educations: items.map((x, k) => (k === i ? { ...x, ...v } : x)) });

    return (
        <>
            <StepHeader stepKey="education" />
            <div className="space-y-5">
                {items.map((e, i) => (
                    <Entry key={keys[i] ?? i} title={e.degree || e.institute || `Education ${i + 1}`} onRemove={() => { remove(i); update({ educations: items.filter((_, k) => k !== i) }); }}>
                        <TextField label="Degree" placeholder="B.Tech in Computer Science" value={e.degree} onChange={(v) => edit(i, { degree: v })} />
                        <TextField label="Institute" placeholder="University / College" value={e.institute} onChange={(v) => edit(i, { institute: v })} />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField label="Start" type="month" value={e.startDate} onChange={(v) => edit(i, { startDate: v })} />
                            <TextField label="End" type="month" value={e.endDate} onChange={(v) => edit(i, { endDate: v })} hint="Expected date is fine." />
                        </div>
                    </Entry>
                ))}
                <AddButton label="Add education" onClick={() => { add(); update({ educations: [...items, { ...blank }] }); }} />
            </div>
            <StepFooter stepKey="education" />
        </>
    );
}