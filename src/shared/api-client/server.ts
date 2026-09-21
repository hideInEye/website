import "server-only";

import { cookies } from "next/headers";

import { serverEnv } from "@/config/env.server";
import { ApiClientError, readApiResponse } from "./response";

export interface IServerApiOptions {
  authenticated?: boolean;
  revalidate?: number;
  tags?: string[];
}

export async function serverApiRequest<T>(
  path: string,
  { authenticated = false, revalidate, tags }: IServerApiOptions = {}
): Promise<T> {
  const apiUrl = serverEnv.API_INTERNAL_URL;
  if (!apiUrl) {
    throw new ApiClientError(503, {
      code: "API_UNAVAILABLE",
      message: "后端 API 尚未配置"
    });
  }

  const headers = new Headers({ Accept: "application/json" });
  if (authenticated) headers.set("Cookie", (await cookies()).toString());
  const response = await fetch(
    `${apiUrl.replace(/\/$/, "")}/api/v1${path.startsWith("/") ? path : `/${path}`}`,
    {
      headers,
      cache: revalidate === undefined ? "no-store" : undefined,
      next: revalidate === undefined ? undefined : { revalidate, tags }
    }
  );
  return readApiResponse<T>(response);
}
