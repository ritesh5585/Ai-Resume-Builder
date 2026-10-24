"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STEPS, StepKey } from "@/lib/step";
import { useResume } from "@/context/ResumeContext";
import ErrorMessage from "@/component/Error"; 

export const inputCls =
    "mt-1.5 block w-full rounded-md border border-[#D5D2C9] bg-white px-3.5 py-2.5 text-[15px] text-[#1B2F28] outline-none transition placeholder:text-[#9AA59F] focus:border-[#24473B]";
const labelCls = "text-[13px] font-medium text-[#1B2F28]";

export function TextField({ label, value, onChange, placeholder, type = "text", hint }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; hint?: string;
}) {
    return (
        <label className="block">
            <span className={labelCls}>{label}</span>
            <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
            {hint && <span className="mt-1 block text-[12px] text-[#5B6A63]">{hint}</span>}
        </label>
    );
}

export function TextArea({ label, value, onChange, placeholder, rows = 5, hint }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; hint?: string;
}) {
    return (
        <label className="block">
            <span className={labelCls}>{label}</span>
            <textarea rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-y leading-relaxed`} />
            {hint && <span className="mt-1 block text-[12px] text-[#5B6A63]">{hint}</span>}
        </label>
    );
}

export function SelectField({ label, value, onChange, options, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
    return (
        <label className="block">
            <span className={labelCls}>{label}</span>
            <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
                <option value="">{placeholder}</option>
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
        </label>
    );
}

export function StepHeader({ stepKey }: { stepKey: StepKey }) {
    const i = STEPS.findIndex((s) => s.key === stepKey);
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 text-[12px] font-semibold tracking-[0.14em] text-[#24473B]">
                <span className="h-px w-8 bg-[#A88A3D]" />STEP {i + 1} OF {STEPS.length}
            </div>
            <h1 className="mt-4 font-serif text-[38px] font-normal leading-tight">{STEPS[i].label}</h1>
            <p className="mt-2 text-[16px] text-[#5B6A63]">{STEPS[i].desc}</p>
        </div>
    );
}

// Back / Continue: navigate karne se pehle pending save flush hota hai
export function StepFooter({ stepKey, children }: { stepKey: StepKey; children?: React.ReactNode }) {
    const router = useRouter();
    const { resume, flush } = useResume();
    const [err, setErr] = useState<string | null>(null);
    const i = STEPS.findIndex((s) => s.key === stepKey);
    const base = `/dashboard/${resume._id}`;

    const go = async (href: string) => {
        setErr(null);
        if (!(await flush())) return setErr("Couldn’t save your latest changes. Check your connection and try again.");
        router.push(href);
    };

    return (
        <div className="mt-10">
            <ErrorMessage message={err} className="mb-4" />
            <div className="flex items-center justify-between border-t border-[#E6E3DC] pt-6">
                {i > 0 ? (
                    <button onClick={() => go(`${base}/${STEPS[i - 1].key}`)} className="text-[15px] text-[#5B6A63] transition hover:text-[#1B2F28]">← Back</button>
                ) : (
                    <Link href="/dashboard" className="text-[15px] text-[#5B6A63] transition hover:text-[#1B2F28]">← Dashboard</Link>
                )}
                {children ?? (i < STEPS.length - 1 && (
                    <button onClick={() => go(`${base}/${STEPS[i + 1].key}`)} className="rounded-md bg-[#24473B] px-7 py-3 text-[15px] font-medium text-white transition hover:bg-[#1B2F28]">
                        Continue
                    </button>
                ))}
            </div>
        </div>
    );
}

export function Entry({ title, onRemove, children }: { title: string; onRemove: () => void; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-[#E6E3DC] p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[15px] font-medium">{title}</h3>
                <button onClick={onRemove} className="text-[13px] text-[#5B6A63] transition hover:text-red-600">Remove</button>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button onClick={onClick} className="w-full rounded-xl border border-dashed border-[#C9C5B9] py-4 text-[15px] font-medium text-[#24473B] transition hover:border-[#24473B] hover:bg-[#F6F5F1]">
            + {label}
        </button>
    );
}