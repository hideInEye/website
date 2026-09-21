import type { MetadataRoute } from "next";
import { serverEnv } from "@/config/env.server";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const base = serverEnv.SITE_URL;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/api"] }],
    sitemap: `${base}/sitemap.xml`
  };
}
