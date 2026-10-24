"use client";
import { useResume } from "@/context/ResumeContext";
import { useListKeys } from "@/hooks/useListKeys";
import { aiService } from "@/services/ai.service";
import { StepHeader, StepFooter, TextField, TextArea, Entry, AddButton } from "@/component/builder/ui";
import AIAssist from "@/component/builder/AIassist";
import TagInput from "@/component/builder/TagInput";
import type { Project } from "@/types/resume.type";

const blank: Project = { title: "", description: "", githubURL: "", liveURL: "", techStack: [] };

function Item({ p, onChange }: { p: Project; onChange: (v: Partial<Project>) => void }) {
    const { resume } = useResume();
    const level = resume.experienceLevel;
    const role = resume.targetRole;
    const stack = p.techStack ?? [];
    const genReason = !level || !role ? "Add target role and level in Personal info" : stack.length === 0 ? "Add the tech stack first" : null;

    return (
        <>
            <TextField label="Project name" placeholder="e.g. Resume Builder" value={p.title} onChange={(v) => onChange({ title: v })} />
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="GitHub link" placeholder="github.com/you/project" value={p.githubURL} onChange={(v) => onChange({ githubURL: v })} />
                <TextField label="Live link" placeholder="project.com" value={p.liveURL} onChange={(v) => onChange({ liveURL: v })} />
            </div>
            <div>
                <span className="text-[13px] font-medium">Tech stack</span>
                <TagInput value={stack} onChange={(v) => onChange({ techStack: v })} placeholder="Type a technology, press Enter" />
            </div>
            <TextArea label="Description" rows={4} placeholder="What it does and the impact (40–60 words works well)" value={p.description} onChange={(v) => onChange({ description: v })} />
            <AIAssist
                onUse={(t) => onChange({ description: t })}
                actions={[
                    { label: "Generate description", disabledReason: genReason, run: async () => (await aiService.generateDescription({ experienceLevel: level!, jobTitle: role!, techstack: stack })).description },
                    { label: "Improve my text", disabledReason: p.description?.trim() ? null : "Write something first, then AI can improve it", run: async () => (await aiService.improveContent({ content: p.description, sectionType: "project", jobTitle: role })).improved },
                ]}
            />
        </>
    );
}

export default function ProjectsPage() {
    const { resume, update } = useResume();
    const items = resume.projects ?? [];
    const { keys, add, remove } = useListKeys(items.length);
    const edit = (i: number, v: Partial<Project>) => update({ projects: items.map((x, k) => (k === i ? { ...x, ...v } : x)) });

    return (
        <>
            <StepHeader stepKey="projects" />
            <div className="space-y-5">
                {items.map((p, i) => (
                    <Entry key={keys[i] ?? i} title={p.title || `Project ${i + 1}`} onRemove={() => { remove(i); update({ projects: items.filter((_, k) => k !== i) }); }}>
                        <Item p={p} onChange={(v) => edit(i, v)} />
                    </Entry>
                ))}
                <AddButton label="Add project" onClick={() => { add(); update({ projects: [...items, { ...blank, techStack: [] }] }); }} />
            </div>
            <StepFooter stepKey="projects" />
        </>
    );
}