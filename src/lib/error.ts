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
        return NextResponse.json(
          { error: error.message },
          { status: error.status },
        );
      }
      console.error(error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 },
      );
    }
  };
}
