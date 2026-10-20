import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { AppError } from "./error";
import getUser from "./getUser";

let ratelimit: Ratelimit | null = null;

if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
}

// In-memory sliding window fallback for local development or when Redis env vars are missing
const memoryStore = new Map<string, number[]>();

export async function rateLimit(identifier: string) {
  if (ratelimit) {
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      throw new AppError(
        "Too many requests. Rate limit is 10 requests per minute.",
        429,
      );
    }
    return;
  }

  // Fallback to in-memory rate limiting (10 req/min)
  const windowMs = 60 * 1000;
  const timestamps = (memoryStore.get(identifier) || []).filter(
    (t) => Date.now() - t < windowMs,
  );

  if (timestamps.length >= 10) {
    throw new AppError(
      "Too many requests. Rate limit is 10 requests per minute.",
      429,
    );
  }

  timestamps.push(Date.now());
  memoryStore.set(identifier, timestamps);
}

export async function requireAuthAndRateLimit(req: NextRequest) {
  const userId = await getUser(req);
  await rateLimit(userId);
  return userId;
}
