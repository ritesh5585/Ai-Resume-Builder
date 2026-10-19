import { AppError, asyncHandler } from "@/lib/error";
import { generate } from "@/lib/gemini";
import { requireAuthAndRateLimit } from "@/lib/ratelimit";
import { AnalyzeResume } from "@/types/ai.type";
import { ApiResponse } from "@/types/api.type";
import { NextRequest, NextResponse } from "next/server";

const clamp = (n: unknown) =>
  Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
const strs = (a: unknown, max: number): string[] =>
  Array.isArray(a) ? a.filter((x) => typeof x === "string").slice(0, max) : [];

export const POST = asyncHandler(async (req: NextRequest) => {
  await requireAuthAndRateLimit(req);

  const { resumeText, jobTitle, jobDescription }: AnalyzeResume =
    await req.json();

  if (!resumeText || !jobTitle)
    throw new AppError("Resume text and job title are required", 400);
  if (resumeText.length > 6000 || (jobDescription?.length ?? 0) > 3000)
    throw new AppError(
      "Resume (max 6000 chars) or job description (max 3000 chars) too long",
      400,
    );

  const prompt = `Score this resume for ATS fit. Return JSON only:
{"keywords":0-100,"actionVerbs":0-100,"metrics":0-100,"missingKeywords":["max 6"],"suggestions":["max 4, each under 15 words"]}
keywords = match with role/JD. actionVerbs = bullets starting with strong verbs. metrics = quantified achievements.
${jobDescription ? "" : "No JD given: missingKeywords must be []."}
Role: ${jobTitle}
${jobDescription ? `JD: ${jobDescription}\n` : ""}Resume:
${resumeText}`;

  const raw = await generate(prompt, {
    json: true,
    temperature: 0,
    maxTokens: 400,
  });

  let r: any;
  try {
    r = JSON.parse(raw);
  } catch {
    throw new AppError("AI returned invalid JSON", 502);
  }

  const keywords = clamp(r.keywords);
  const actionVerbs = clamp(r.actionVerbs);
  const metrics = clamp(r.metrics);

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "ATS score generated successfully",
    data: {
      overallScore: Math.round(
        keywords * 0.5 + actionVerbs * 0.25 + metrics * 0.25,
      ),
      breakdown: { keywords, actionVerbs, metrics },
      missingKeywords: strs(r.missingKeywords, 6),
      suggestions: strs(r.suggestions, 4),
    },
  });
});
