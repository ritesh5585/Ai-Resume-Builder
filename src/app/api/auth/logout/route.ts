import { NextResponse } from "next/server";
import { asyncHandler } from "@/lib/error";
import { ApiResponse } from "@/types/api.type";

export const POST = asyncHandler(async () => {
  const response = NextResponse.json<ApiResponse>({
    success: true,
    message: "Logged out successfully",
  });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
});
