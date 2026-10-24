"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { resumeService } from "@/services/resume.api";

export function useCreateResume() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  const create = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setCreating(true);
    setError(null);
    try {
      const resume = await resumeService.create();
      router.push(`/dashboard/${resume._id}/personal`);
    } catch (e) {
      setError((e as Error).message);
      busy.current = false;
      setCreating(false);
    }
  }, [router]);

  return { create, creating, error };
}
