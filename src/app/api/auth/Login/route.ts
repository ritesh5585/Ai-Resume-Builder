import connectToDB from "@/lib/database";
import { AppError, asyncHandler } from "@/lib/error";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import { ApiResponse } from "@/types/api.type";
import { LoginUser } from "@/types/user.type";

export const POST = asyncHandler(async (req: NextRequest) => {
  await connectToDB();

  const body: LoginUser = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    throw new AppError("Email or Password is required", 400);
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.password && user.googleId) {
    throw new AppError(
      "This account was created with Google. Please use 'Continue with Google' to sign in.",
      400,
    );
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({
    userId: user._id.toString(),
  });

  const response = NextResponse.json<ApiResponse>(
    {
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        },
      },
    },
    { status: 200 },
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 2,
    path: "/",
  });

  return response;
});
