import { AppError, asyncHandler } from "@/lib/error";
import { generate } from "@/lib/gemini";
import { requireAuthAndRateLimit } from "@/lib/ratelimit";
import { GenerateProjectDetails } from "@/types/ai.type";
import { ApiResponse } from "@/types/api.type";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (req: NextRequest) => {
  await requireAuthAndRateLimit(req);

  const body: GenerateProjectDetails = await req.json();
  const { experienceLevel, jobTitle, techstack } = body;

  if (!experienceLevel || !jobTitle || !techstack?.length) {
    throw new AppError("All fields are required", 400);
  }

  if (
    experienceLevel.length > 50 ||
    jobTitle.length > 100 ||
    techstack.length > 30 ||
    techstack.join(", ").length > 500
  ) {
    throw new AppError("Input exceeds maximum allowed length", 400);
  }

  const prompt = `Act as an expert ATS resume writer. Write a concise project description for a resume.
Inputs:
- Experience Level: ${experienceLevel}
- Target Role: ${jobTitle}
- Tech Stack: ${Array.isArray(techstack) ? techstack.join(", ") : techstack}

Rules:
1. Length: Strictly between 40 to 60 words.
2. Start with a strong action verb describing what was built.
3. Integrate the given tech stack keywords naturally into the description.
4. Highlight impact, purpose, and 1-2 key features or outcomes.
5. Do NOT use first-person pronouns (I, me, my) or clichés (hard-working, team player).
6. Do NOT include greetings, titles, bullet points, or "Here is your...".
7. Output ONLY the raw project description text. No extra explanation.`;

  const description = await generate(prompt, { maxTokens: 150 });

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Project description generated successfully",
    data: { description },
  });
});