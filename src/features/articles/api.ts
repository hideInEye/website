import { ApiClientError, browserApiRequest } from "@/shared/api-client";
import type { PaginatedPosts, PostDetail, Taxonomy } from "./types";

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  try {
    return await browserApiRequest<PostDetail>(`/posts/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) return null;
    throw error;
  }
}

export function getPosts({
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
  return browserApiRequest(`/posts?${params}`);
}

export const getCategories = () => browserApiRequest<Taxonomy[]>("/categories");
export const getTags = () => browserApiRequest<Taxonomy[]>("/tags");

export async function getBookmarkState(postId: string): Promise<boolean> {
  try {
    return (
      await browserApiRequest<{ bookmarked: boolean }>(`/bookmarks/${encodeURIComponent(postId)}`)
    ).bookmarked;
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) return false;
    throw error;
  }
}
