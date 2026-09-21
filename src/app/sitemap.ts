import type { MetadataRoute } from "next";
import { serverEnv } from "@/config/env.server";
import { getCategories, getPosts, getTags } from "@/features/articles";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = serverEnv.SITE_URL;
  const [posts, categories, tags] = await Promise.all([
    getPosts({ pageSize: 1000 }),
    getCategories(),
    getTags()
  ]);
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/search`, changeFrequency: "weekly", priority: 0.4 },
    ...posts.items.map((post) => ({
      url: `${base}/articles/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...categories.map((category) => ({
      url: `${base}/categories/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6
    })),
    ...tags.map((tag) => ({
      url: `${base}/tags/${tag.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5
    }))
  ];
}
