import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/database";
import { AppError, asyncHandler } from "@/lib/error";
import { generateToken } from "@/lib/jwt";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.type";

const clientId =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "";

const client = new OAuth2Client(clientId);

export const POST = asyncHandler(async (req: NextRequest) => {
  const { credential } = await req.json();
  if (!credential) throw new AppError("Google credential missing", 400);

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    payload = ticket.getPayload();
  } catch (error) {
    console.error("Google Auth Error:", error);
    throw new AppError("Invalid Google token", 401);
  }
  if (!payload?.email || !payload.email_verified) {
    throw new AppError("Google email not verified", 401);
  }

  await connectToDB();
  let user = await UserModel.findOne({ email: payload.email });
  if (!user) {
    user = await UserModel.create({
      name: payload.name ?? payload.email.split("@")[0],
      email: payload.email,
      googleId: payload.sub,
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    await user.save();
  }

  const token = generateToken({ userId: user._id.toString() });
  const response = NextResponse.json<ApiResponse>({
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
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 2,
    path: "/",
  });
  return response;
});
