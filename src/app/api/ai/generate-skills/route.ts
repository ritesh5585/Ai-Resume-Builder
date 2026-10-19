import { AppError, asyncHandler } from "@/lib/error";
import { generate } from "@/lib/gemini";
import { GenerateSkills } from "@/types/ai.type";
import { ApiResponse } from "@/types/api.type";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (req: NextRequest) => {
  const data: GenerateSkills = await req.json();
  const { experienceLevel, jobTitle } = data;

  if (!experienceLevel || !jobTitle) {
    throw new AppError("Please provide experience level and job title", 400);
  }

  const prompt = `List the top 12 most relevant technical and soft skills for a ${experienceLevel} ${jobTitle}.
Rules:
1. Output ONLY a single line of comma-separated values (e.g., JavaScript, React, Team Leadership).
2. Do NOT use bullet points, numbers, or introductions.
3. Keep it strictly to the skills list.`;

  const skillsString = await generate(prompt)

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Skills generated successfully",
    data: { skills: skillsString },
  });
});
