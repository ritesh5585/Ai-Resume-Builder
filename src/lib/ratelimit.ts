import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { AppError } from "./error";
import getUser from "./getUser";

const MAX_REQUESTS = 10;
const TIME_WINDOW = "1 m";
const WINDOW_MS = 60 * 1000;
const ERROR_MESSAGE = `Too many requests. Rate limit is ${MAX_REQUESTS} requests per minute.`;

let ratelimit: Ratelimit | null = null;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(MAX_REQUESTS, TIME_WINDOW),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

const memoryStore = new Map<string, number[]>();

export async function rateLimit(identifier: string) {
  if (ratelimit) {
    const result = await ratelimit.limit(identifier);
    if (!result.success) {
      throw new AppError(ERROR_MESSAGE, 429);
    }
    return;
  }
  const now = Date.now();
  const oldTimestamps = memoryStore.get(identifier) || [];
  const recentTimestamps = oldTimestamps.filter(function (t) {
    return now - t < WINDOW_MS;
  });
  if (recentTimestamps.length >= MAX_REQUESTS) {
    throw new AppError(ERROR_MESSAGE, 429);
  }
  recentTimestamps.push(now);
  memoryStore.set(identifier, recentTimestamps);
}

export async function requireAuthAndRateLimit(req: NextRequest) {
  const userId = await getUser(req);
  await rateLimit(userId);
  return userId;
}
