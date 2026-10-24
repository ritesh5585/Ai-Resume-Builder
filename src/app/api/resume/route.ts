import connectDB from "@/lib/database";
import { asyncHandler } from "@/lib/error";
import { ApiResponse } from "@/types/api.type";
import getUser from "@/lib/getUser";
import resumeModel from "@/models/resume.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (req: NextRequest) => {
  await connectDB();
  const userId = await getUser(req);

  const resumes = await resumeModel
    .find({ user_id: userId })
    .select(
      "title summary skills personalInfo workExp projects educations createdAt updatedAt",
    )
    .sort({ updatedAt: -1 })
    .limit(12)
    .lean();

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "Resumes fetched",
    data: resumes,
  });
});
