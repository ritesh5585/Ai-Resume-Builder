import connectDB from "@/lib/database";
import { AppError, asyncHandler } from "@/lib/error";
import { ApiResponse } from "@/types/api.type";
import getUser from "@/lib/getUser";
import resumenModel from "@/models/resume.model";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_FIELDS = [
  "title",
  "targetRole",
  "experienceLevel",
  "template",
  "summary",
  "skills",
  "personalInfo",
  "workExp",
  "projects",
  "educations",
  "certificate",
] as const;

export const GET = asyncHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ resumeId: string }> },
  ) => {
    await connectDB();

    const userId = await getUser(req);
    if (!userId) throw new AppError("Unauthorized", 401);

    const { resumeId } = await params;

    const resume = await resumenModel.findOne({
      _id: resumeId,
      user_id: userId,
    });

    if (!resume) throw new AppError("Resume not found", 404);

    return NextResponse.json<ApiResponse>({
      data: resume,
      message: "Resume found",
      success: true,
    });
  },
);

export const PATCH = asyncHandler(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ resumeId: string }> },
  ) => {
    await connectDB();

    const userId = await getUser(req);
    if (!userId) throw new AppError("Unauthorized", 401);

    const { resumeId } = await params;
    const body = await req.json();

    const updates: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    const updatedResume = await resumenModel.findOneAndUpdate(
      {
        _id: resumeId,
        user_id: userId,
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedResume) throw new AppError("Resume not found", 404);

    return NextResponse.json<ApiResponse>({
      data: updatedResume,
      message: "Resume updated successfully",
      success: true,
    });
  },
);
