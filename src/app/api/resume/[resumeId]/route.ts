import connectDB from "@/lib/database";
import { AppError, asyncHandler } from "@/lib/error";
import { ApiResponse } from "@/types/api.type";
import getUser from "@/lib/getUser";
import resumenModel from "@/models/resume.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (req: NextRequest) => {
  await connectDB();
  const userId = await getUser(req);

  const resumes = await resumenModel
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

export const PATCH = asyncHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ resumeId: string }> },
  ) => {
    await connectDB();

    const userId = await getUser(req);
    const body = await req.json();
    const { resumeId } = await params;

    const updatedResume = await resumenModel.findOneAndUpdate(
      {
        _id: resumeId,
        user_id: userId,
      },
      {
        $set: body,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedResume) throw new AppError("Failed to update resume", 400);

    return NextResponse.json<ApiResponse>({
      data: updatedResume,
      message: "Resume updated successfully",
      success: true,
    });
  },
);
