import { AppError, asyncHandler } from "@/lib/error";
import { generate } from "@/lib/gemini";
import { requireAuthAndRateLimit } from "@/lib/ratelimit";
import { ImproveContent } from "@/types/ai.type";
import { ApiResponse } from "@/types/api.type";
import { NextRequest, NextResponse } from "next/server";

const MAX_INPUT_CHARS = 2000;

export const POST = asyncHandler(async (req: NextRequest) => {
  await requireAuthAndRateLimit(req);

  const body: ImproveContent = await req.json();
  const { content, sectionType, jobTitle } = body;

  if (!content || !sectionType) {
    throw new AppError("Content and sectionType are required", 400);
  }

  if (content.length > MAX_INPUT_CHARS) {
    throw new AppError(
      `Content too long. Max ${MAX_INPUT_CHARS} characters allowed.`,
      400,
    );
  }

  if (sectionType.length > 50 || (jobTitle && jobTitle.length > 100)) {
    throw new AppError("Input exceeds maximum allowed length", 400);
  }

  const prompt = `Act as an expert ATS resume editor. Rewrite the content below to make it ATS-friendly.
Inputs:
- Section: ${sectionType}
- Target Role: ${jobTitle || "not specified"}
- Original Content:
"""
${content}
"""

Rules:
1. Preserve all original facts, numbers, and context. Do NOT invent metrics, companies, dates, or skills.
2. Fix grammar, spelling, redundancy, and unclear phrasing.
3. Start each sentence or bullet with a strong action verb (Led, Built, Optimized, Engineered, etc.).
4. If Section is "experience" or "project", use past tense. If "summary", use present tense.
5. Integrate role-relevant ATS keywords naturally when Target Role is provided.
6. Preserve the original structure: single paragraph stays paragraph, bullets stay bullets, one per line.
7. Keep length within 1.2x of the original.
8. Do NOT use first-person pronouns (I, me, my) or clichés (hard-working, team player).
9. Do NOT include greetings, headings, explanations, or "Here is your...".
10. Output ONLY the improved content. No extra text.`;

  const improved = await generate(prompt, { maxTokens: 700 });

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Content improved successfully",
    data: { improved },
  });
});
