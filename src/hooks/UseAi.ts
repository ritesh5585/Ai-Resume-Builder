"use client";

import { useCallback, useRef, useState } from "react";

export function useAI<A extends unknown[], R>(fn: (...args: A) => Promise<R>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  const run = useCallback(
    async (...args: A): Promise<R | null> => {
      if (busy.current) return null;
      busy.current = true;
      setLoading(true);
      setError(null);
      try {
        return await fn(...args);
      } catch (e) {
        setError((e as Error).message);
        return null;
      } finally {
        busy.current = false;
        setLoading(false);
      }
    },
    [fn],
  );

  return { run, loading, error, clearError: () => setError(null) };
}