import type { Resume } from "@/types/resume.type";

export type ResumeDTO = Omit<
  Resume,
  "_id" | "user_id" | "createdAt" | "updatedAt"
> & {
  _id: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
};

export type ResumeUpdate = Partial<
  Omit<ResumeDTO, "_id" | "user_id" | "createdAt" | "updatedAt">
>;

import { request } from "./http";

export const resumeService = {
  list: (signal?: AbortSignal) =>
    request<ResumeDTO[]>("/api/resume", "GET", undefined, signal),
  create: () => request<ResumeDTO>("/api/resume/create", "POST"),
  get: (id: string) => request<ResumeDTO>(`/api/resume/${id}`),
  update: (id: string, patch: ResumeUpdate) =>
    request<ResumeDTO>(`/api/resume/${id}`, "PATCH", patch),
};
