import { NextResponse } from "next/server";

import { getServerEnv } from "@/config/env.server";

async function proxy(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const apiUrl = getServerEnv().API_INTERNAL_URL;
  if (!apiUrl)
    return NextResponse.json(
      { statusCode: 503, code: "API_UNAVAILABLE", message: "后端 API 尚未配置" },
      { status: 503 }
    );
  const { path } = await context.params;
  const backendPath = path[0] === "v1" ? path.slice(1) : path;
  const source = new URL(request.url);
  const target = `${apiUrl.replace(/\/$/, "")}/api/v1/${backendPath.map(encodeURIComponent).join("/")}${source.search}`;
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  const response = await fetch(target, {
    method: request.method,
    headers,
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
    redirect: "manual"
  });
  return new NextResponse(response.body, { status: response.status, headers: response.headers });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
