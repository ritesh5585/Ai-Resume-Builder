type Method = "GET" | "POST" | "PATCH" | "DELETE";

export async function request<T>(
  url: string,
  method: Method = "GET",
  body?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers:
      body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal, 
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(json.message || json.error || "Something went wrong");
  return json.data as T;
}
