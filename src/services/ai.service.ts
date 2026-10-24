import { request } from "./http";
import type {
  AnalyzeResume,
  GenerateExperience,
  GenerateProjectDetails,
  GenerateSkills,
  GenerateSummary,
  ImproveContent,
} from "@/types/ai.type";

export const PATHS = {
  summary: "/api/ai/generate-summary",
  skills: "/api/ai/generate-skills",
  experience: "/api/ai/generate-experience",
  description: "/api/ai/generate-description",
  improve: "/api/ai/improve-content",
  ats: "/api/ai/ats-score",
};

export interface AtsScoreResult {
  overallScore: number;
  breakdown: {
    keywords: number;
    actionVerbs: number;
    metrics: number;
  };
  missingKeywords: string[];
  suggestions: string[];
}

export const aiService = {
  generateSummary: (data: GenerateSummary) =>
    request<{ summary: string }>(PATHS.summary, "POST", data),

  generateSkills: (data: GenerateSkills) =>
    request<{ skills: string }>(PATHS.skills, "POST", data),

  generateExperience: (data: GenerateExperience) =>
    request<{ bullets: string[] }>(PATHS.experience, "POST", data),

  generateDescription: (data: GenerateProjectDetails) =>
    request<{ description: string }>(PATHS.description, "POST", data),

  improveContent: (data: ImproveContent) =>
    request<{ improved: string }>(PATHS.improve, "POST", data),

  atsScore: (data: AnalyzeResume) =>
    request<AtsScoreResult>(PATHS.ats, "POST", data),
};
