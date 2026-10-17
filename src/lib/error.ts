import { ApiResponse } from "@/types/api.type";
import { NextResponse, NextRequest } from "next/server";

export class AppError extends Error {
  status: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

export function asyncHandler(
  handler: (req: NextRequest) => Promise<Response>,
): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {
      if (error instanceof AppError) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: error.message },
          { status: error.status },
        );
      }
      console.error(error);
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Something went wrong", error },
        { status: 500 },
      );
    }
  };
}
