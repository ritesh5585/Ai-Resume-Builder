// lib/api.ts
import { NextResponse } from "next/server";

export class AppError extends Error {
  status: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

export function asyncHandler(handler: (...args: any[]) => Promise<Response>) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error: any) {
        console.error(error);
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status },
        );
      }
    }
  };
}
