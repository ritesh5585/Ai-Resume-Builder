"use client";

import { useState } from "react";

export default function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
    const [draft, setDraft] = useState("");

    const add = (raw: string) => {
        const items = raw.split(",").map((s) => s.trim()).filter(Boolean);
        if (!items.length) return;
        const next = [...value];
        for (const it of items) if (!next.some((v) => v.toLowerCase() === it.toLowerCase())) next.push(it);
        onChange(next);
        setDraft("");
    };

    return (
        <div className="mt-1.5 flex flex-wrap gap-2 rounded-md border border-[#D5D2C9] bg-white p-2 focus-within:border-[#24473B]">
            {value.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-[#F6F5F1] px-3 py-1 text-[13px]">
                    {tag}
                    <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(value.filter((v) => v !== tag))} className="text-[#5B6A63] hover:text-red-600">×</button>
                </span>
            ))}
            <input
                value={draft}
                placeholder={value.length ? "" : placeholder}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => add(draft)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(draft); }
                    else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
                }}
                className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-[14px] outline-none placeholder:text-[#9AA59F]"
            />
        </div>
    );
}