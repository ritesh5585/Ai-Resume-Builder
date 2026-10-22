import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/database";
import { asyncHandler } from "@/lib/error";
import { verifyToken } from "@/lib/jwt";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.type";

export const GET = asyncHandler(async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "No active session",
      data: { user: null },
    });
  }

  const payload = verifyToken(token);
  if (!payload?.userId) {
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Invalid session token",
      data: { user: null },
    });
  }

  await connectToDB();
  const user = await UserModel.findById(payload.userId).select("-password");
  if (!user) {
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User not found",
      data: { user: null },
    });
  }

  return NextResponse.json<ApiResponse>({
    success: true,
    message: "User authenticated",
    data: {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    },
  });
});
