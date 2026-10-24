"use client";

import { useState } from "react";
import { useAI } from "@/hooks/useAI";
import ErrorMessage from "@/component/Error";

export type AIAction = { label: string; run: () => Promise<string>; disabledReason?: string | null };

export default function AIAssist({ actions, onUse }: { actions: AIAction[]; onUse: (text: string) => void }) {
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [active, setActive] = useState<number | null>(null);
    const ai = useAI(async (i: number) => actions[i].run());

    const go = async (i: number) => {
        setActive(i);
        const text = await ai.run(i);
        if (text) setSuggestion(text.trim());
    };
    const blockedReason = actions.find((a) => a.disabledReason)?.disabledReason;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {actions.map((a, i) => (
                    <button
                        key={a.label}
                        type="button"
                        disabled={ai.loading || !!a.disabledReason}
                        title={a.disabledReason ?? undefined}
                        onClick={() => go(i)}
                        className="inline-flex items-center gap-2 rounded-md border border-[#D5D2C9] bg-white px-3.5 py-2 text-[13px] font-medium text-[#24473B] transition hover:border-[#24473B] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#A88A3D]" />
                        {ai.loading && active === i ? "Writing…" : a.label}
                    </button>
                ))}
            </div>
            {blockedReason && <p className="text-[12px] text-[#5B6A63]">{blockedReason}</p>}
            <ErrorMessage message={ai.error} />

            {suggestion && (
                <div className="border-l-2 border-[#A88A3D] bg-[#F6F5F1] p-4">
                    <div className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-[#24473B]">AI SUGGESTION</div>
                    <p className="whitespace-pre-line text-[14px] leading-relaxed">{suggestion}</p>
                    <div className="mt-4 flex gap-3">
                        <button type="button" onClick={() => { onUse(suggestion); setSuggestion(null); }} className="rounded-md bg-[#24473B] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#1B2F28]">Use this</button>
                        <button type="button" onClick={() => setSuggestion(null)} className="text-[13px] text-[#5B6A63] hover:text-[#1B2F28]">Dismiss</button>
                    </div>
                </div>
            )}
        </div>
    );
}