import { AppError } from "@/lib/error";
import { LoginUser, RegisterUser, AuthUser } from "@/types/user.type";

async function request<T>(
  url: string,
  method: "GET" | "POST",
  body?: unknown,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new AppError(
      json.message || json.error || "Something went wrong",
      res.status || 500,
    );
  return json.data as T;
}

export const authService = {
  login: (body: LoginUser) =>
    request<{ user: AuthUser }>("/api/auth/login", "POST", body),
  register: (body: RegisterUser) =>
    request<{ user: AuthUser }>("/api/auth/register", "POST", body),
  google: (credential: string) =>
    request<{ user: AuthUser }>("/api/auth/google", "POST", { credential }),
  me: () => request<{ user: AuthUser | null }>("/api/auth/me", "GET"),
  logout: () => request<void>("/api/auth/logout", "POST"),
};
