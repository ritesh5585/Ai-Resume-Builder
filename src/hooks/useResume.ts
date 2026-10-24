"use client"

import { useCallback, useEffect, useState } from "react";
import { resumeService, ResumeDTO } from "@/services/resume.api";

export function useResumes(enabled: boolean) {
    const [items, setItems] = useState<ResumeDTO[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!enabled) { // guest hai -> kuch fetch nahi karna
            setItems(null);
            setError(null);
            return;
        }
        const ctrl = new AbortController();
        setError(null);
        resumeService
            .list(ctrl.signal)
            .then(setItems)
            .catch((e: Error) => {
                if (e.name !== "AbortError") setError(e.message);
            });
        return () => ctrl.abort(); // page chhodne par purani request cancel
    }, [enabled, attempt]);

    const retry = useCallback(() => {
        setItems(null);
        setAttempt((a) => a + 1);
    }, []);

    return { items, error, retry, loading: enabled && items === null && !error };
}