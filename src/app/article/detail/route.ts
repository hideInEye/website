import { NextResponse } from "next/server";

import { serverEnv } from "@/config/env.server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const legacyId = url.searchParams.get("id");
  const apiUrl = serverEnv.API_INTERNAL_URL;
  if (legacyId && apiUrl) {
    try {
      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/api/v1/posts/legacy/${encodeURIComponent(legacyId)}`,
        { redirect: "manual" }
      );
      if (response.ok) {
        const payload = (await response.json()) as { data?: { slug?: string } };
        if (payload.data?.slug)
          return NextResponse.redirect(new URL(`/articles/${payload.data.slug}`, url.origin), 308);
      }
    } catch {
      /* Fall through to the safe destination. */
    }
  }
  return NextResponse.redirect(new URL("/", url.origin), 308);
}
