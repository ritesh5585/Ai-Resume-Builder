"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { resumeService, ResumeDTO, ResumeUpdate } from "@/services/resume.api";

type Status = "idle" | "dirty" | "saving" | "saved" | "error";
type Ctx = {
    resume: ResumeDTO;
    update: (patch: ResumeUpdate) => void;
    flush: () => Promise<boolean>;
    retry: () => void;
    status: Status;
    saveError: string | null;
};

const ResumeContext = createContext<Ctx | null>(null);
const DELAY = 1200;

export function ResumeProvider({ initial, children }: { initial: ResumeDTO; children: React.ReactNode }) {
    const id = initial._id;
    const [resume, setResume] = useState(initial);
    const [status, setStatus] = useState<Status>("idle");
    const [saveError, setSaveError] = useState<string | null>(null);

    const pending = useRef<ResumeUpdate>({});
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const queue = useRef<Promise<void>>(Promise.resolve()); 

    const save = useCallback(() => {
        queue.current = queue.current.then(async () => {
            const patch = pending.current;
            if (Object.keys(patch).length === 0) return;
            pending.current = {};
            setStatus("saving");
            setSaveError(null);
            try {
                await resumeService.update(id, patch);
                setStatus(Object.keys(pending.current).length ? "dirty" : "saved");
            } catch (e) {
                pending.current = { ...patch, ...pending.current };
                setStatus("error");
                setSaveError((e as Error).message);
            }
        });
        return queue.current;
    }, [id]);

    const update = useCallback(
        (patch: ResumeUpdate) => {
            setResume((prev) => ({ ...prev, ...patch }));
            pending.current = { ...pending.current, ...patch };
            setStatus("dirty");
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(save, DELAY);
        },
        [save],
    );

    const flush = useCallback(async () => {
        if (timer.current) clearTimeout(timer.current);
        await save();
        return Object.keys(pending.current).length === 0;
    }, [save]);

    useEffect(() => {
        const warn = (e: BeforeUnloadEvent) => {
            if (status === "dirty" || status === "saving" || status === "error") {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [status]);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
        void save();
    }, [save]);

    return (
        <ResumeContext.Provider value={{ resume, update, flush, retry: () => void save(), status, saveError }}>
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const ctx = useContext(ResumeContext);
    if (!ctx) throw new Error("useResume must be used inside <ResumeProvider>");
    return ctx;
}