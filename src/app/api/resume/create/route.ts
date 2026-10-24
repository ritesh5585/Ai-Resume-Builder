import connectDB from "@/lib/database";
import { asyncHandler } from "@/lib/error";
import getUser from "@/lib/getUser";
import resumenModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.type";
import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/error";

export const POST = asyncHandler(async (req: NextRequest) => {
    await connectDB()

    const userId = await getUser(req)

    if (!userId) {
        throw new AppError("User not found", 404)
    }

    const newResume = await resumenModel.create({
        user_id: userId,
        title: "",
        summary: "",
        personalInfo: {},
        workExp: [],
        projects: [],
        educations: [],
    })

    return NextResponse.json<ApiResponse>(
        {
            success: true,
            message: "Resume created successfully",
            data: newResume,
        },
        { status: 201 },
    )
})