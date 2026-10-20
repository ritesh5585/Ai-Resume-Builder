import { AppError, asyncHandler } from "@/lib/error";
import { generate } from "@/lib/gemini";
import { requireAuthAndRateLimit } from "@/lib/ratelimit";
import { GenerateExperience } from "@/types/ai.type";
import { ApiResponse } from "@/types/api.type";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (req: NextRequest) => {
  await requireAuthAndRateLimit(req);

  const body: GenerateExperience = await req.json();
  const { experienceLevel, jobRole, years, company, techStack } = body;

  if (!experienceLevel || !jobRole || !years) {
    throw new AppError("All fields are required", 400);
  }

  const techStackStr = Array.isArray(techStack)
    ? techStack.join(", ")
    : typeof techStack === "string" && techStack.trim()
      ? techStack
      : "n/a";

  if (
    experienceLevel.length > 50 ||
    jobRole.length > 100 ||
    years.length > 50 ||
    (company && company.length > 100) ||
    (techStackStr !== "n/a" && techStackStr.length > 500)
  ) {
    throw new AppError("Input exceeds maximum allowed length", 400);
  }

  const prompt = `Act as an expert ATS resume writer. Generate work experience bullet points.
Inputs:
- Experience Level: ${experienceLevel}
- Job Title: ${jobRole}
- Years of Experience: ${years}
- Company: ${company || "n/a"}
- Tech Stack: ${techStackStr}

Rules:
1. Generate exactly 4 bullet points.
2. Each bullet must start with a strong past-tense action verb (Led, Built, Designed, Optimized, Engineered, etc.).
3. Do NOT invent fake metrics or numbers. Use placeholders like [X%] where the user must fill real numbers (e.g., "by [X%]", "saved [X] hours", "serving [X] users").
4. Integrate role-relevant ATS keywords naturally.
5. Keep each bullet strictly between 12 and 20 words.
6. Do NOT use first-person pronouns (I, me, my) or clichés (hard-working, team player).
7. Do NOT include headings, intros, company names, dates, or explanations.
8. Output ONLY 4 lines. Each line starts with "- ". No extra text before or after.`;

  const raw = await generate(prompt, { maxTokens: 250 });

  const bullets = raw
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 4);

  if (bullets.length === 0) {
    throw new AppError("Failed to generate experience bullets", 500);
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Experience generated successfully",
    data: { bullets },
  });
});
