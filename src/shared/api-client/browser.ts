import { readApiResponse } from "./response";

export interface IBrowserApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export async function browserApiRequest<T>(
  path: string,
  { method = "GET", body, headers: sourceHeaders, signal }: IBrowserApiOptions = {}
): Promise<T> {
  const headers = new Headers(sourceHeaders);
  headers.set("Accept", "application/json");
  if (body !== undefined) headers.set("Content-Type", "application/json");
  const response = await fetch(`/api/v1${path.startsWith("/") ? path : `/${path}`}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
    signal
  });
  return readApiResponse<T>(response);
}
