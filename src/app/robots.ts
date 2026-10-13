import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getServerEnv } from "@/config/env.server";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  const base = getServerEnv().SITE_URL;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/api"] }],
    sitemap: `${base}/sitemap.xml`
  };
}
