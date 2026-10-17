import { asyncHandler, AppError } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/database";
import { RegisterUser } from "@/types/user.type";
import { ApiResponse } from "@/types/api.type";
import UserModel from "@/models/user.model";
import { generateToken } from "@/lib/jwt";

export const POST = asyncHandler(async (req: NextRequest) => {
  await connectToDB();
  let body: RegisterUser = await req.json();

  let { email, password, name, mobile } = body;

  if (!email || !password || !name) {
    throw new AppError("Missing required fields", 400);
  }

  let isExisted = await UserModel.findOne({ email });
  if (isExisted) throw new AppError("User already exist", 409);

  let newUser = await UserModel.create({
    name,
    email,
    password,
    mobile,
  });

  let token = generateToken({ userId: newUser._id });

  let response = NextResponse.json<ApiResponse>(
    {
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
        },
      },
    },
    { status: 201 },
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  return response;
});
