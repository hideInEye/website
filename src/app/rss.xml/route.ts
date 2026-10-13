import { connection } from "next/server";

import { getServerEnv } from "@/config/env.server";
import { getPosts } from "@/features/articles";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  await connection();
  const base = getServerEnv().SITE_URL;
  const posts = await getPosts({ pageSize: 50 });
  const items = posts.items
    .map(
      (post) =>
        `<item><title>${escapeXml(post.title)}</title><link>${base}/articles/${post.slug}</link><guid isPermaLink="true">${base}/articles/${post.slug}</guid><description>${escapeXml(post.excerpt)}</description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate></item>`
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>日落的足迹</title><link>${base}</link><description>把代码、生活和途中看到的光，留在这里。</description><language>zh-CN</language>${items}</channel></rss>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600"
    }
  });
}
