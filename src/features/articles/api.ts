import { cache } from "react";
import { connection } from "next/server";

import { getServerEnv } from "@/config/env.server";
import { ApiClientError } from "@/shared/api-client/response";
import { serverApiRequest } from "@/shared/api-client/server";
import { categories, demoPosts, tags } from "./demo-data";
import type { PaginatedPosts, PostDetail, Taxonomy } from "./types";

async function isDemoMode() {
  await connection();
  return !getServerEnv().API_INTERNAL_URL;
}

function getPublicApi<T>(path: string) {
  return serverApiRequest<T>(path, { revalidate: 60, tags: ["public-content"] });
}

export const getPostBySlug = cache(async (slug: string): Promise<PostDetail | null> => {
  if (await isDemoMode()) return demoPosts.find((post) => post.slug === slug) ?? null;

  try {
    return await getPublicApi<PostDetail>(`/posts/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) return null;
    throw error;
  }
});

export async function getPosts({
  page = 1,
  pageSize = 6,
  category,
  tag,
  query
}: {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  query?: string;
} = {}): Promise<PaginatedPosts> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (category) params.set("category", category);
  if (tag) params.set("tag", tag);
  if (query) params.set("q", query);

  if (!(await isDemoMode())) return getPublicApi<PaginatedPosts>(`/posts?${params.toString()}`);

  const normalizedQuery = query?.trim().toLocaleLowerCase("zh-CN");
  const filtered = demoPosts.filter((post) => {
    if (category && post.category.slug !== category) return false;
    if (tag && !post.tags.some((item) => item.slug === tag)) return false;
    if (
      normalizedQuery &&
      !`${post.title} ${post.excerpt} ${post.content}`
        .toLocaleLowerCase("zh-CN")
        .includes(normalizedQuery)
    )
      return false;
    return true;
  });
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    page,
    pageSize,
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / pageSize))
  };
}

export async function getCategories(): Promise<Taxonomy[]> {
  return (await isDemoMode()) ? categories : serverApiRequest<Taxonomy[]>("/categories");
}

export async function getTags(): Promise<Taxonomy[]> {
  return (await isDemoMode()) ? tags : serverApiRequest<Taxonomy[]>("/tags");
}

export async function getBookmarkState(postId: string): Promise<boolean> {
  try {
    const result = await serverApiRequest<{ bookmarked: boolean }>(
      `/bookmarks/${encodeURIComponent(postId)}`,
      { authenticated: true }
    );
    return result.bookmarked;
  } catch {
    return false;
  }
}
