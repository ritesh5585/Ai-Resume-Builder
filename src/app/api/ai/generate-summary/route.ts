import { AppError, asyncHandler } from "@/lib/error";
import { generate } from "@/lib/gemini";
import { requireAuthAndRateLimit } from "@/lib/ratelimit";
import { GenerateSummary } from "@/types/ai.type";
import { ApiResponse } from "@/types/api.type";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (req: NextRequest) => {
  await requireAuthAndRateLimit(req);

  const data: GenerateSummary = await req.json();
  const { experienceLevel, jobTitle, skills } = data;

  if (!experienceLevel || !jobTitle || !skills?.length) {
    throw new AppError("Please provide all the required fields", 400);
  }

  if (
    experienceLevel.length > 50 ||
    jobTitle.length > 100 ||
    skills.length > 30 ||
    skills.join(", ").length > 500
  ) {
    throw new AppError("Input exceeds maximum allowed length", 400);
  }

  const prompt = `Act as an expert ATS resume writer. Write a professional summary.
Inputs:
- Experience: ${experienceLevel}
- Role: ${jobTitle}
- Skills: ${Array.isArray(skills) ? skills.join(", ") : skills}

Rules:
1. Length: Strictly between 40 to 50 words.
2. Integrate the provided skills as keywords naturally.
3. Do NOT use first-person pronouns (I, me, my) or clichés (hard-working, team player).
4. Do NOT include greetings, titles, or bullet points.
5. Output ONLY the raw summary text. No extra explanation.`;

  const summary = await generate(prompt, { maxTokens: 120 });

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Summary generated successfully",
    data: { summary },
  });
});