import "server-only";

import { redirect } from "next/navigation";

import { serverApiRequest } from "@/shared/api-client/server";
import { ApiClientError } from "@/shared/api-client/response";

import type {
  IAdminComment,
  IAdminDashboard,
  IAdminPost,
  IAdminPostList,
  IAdminTaxonomy,
  IAdminUser,
  ICurrentUser
} from "./types";

async function adminApiRequest<T>(path: string): Promise<T> {
  try {
    return await serverApiRequest<T>(path, { authenticated: true });
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 401) redirect("/login?next=/admin");
    if (error instanceof ApiClientError && error.status === 403) redirect("/");
    throw error;
  }
}

export function getCurrentUser(): Promise<ICurrentUser> {
  return serverApiRequest("/auth/me", { authenticated: true });
}

export function getAdminPosts(page = 1, pageSize = 20): Promise<IAdminPostList> {
  return adminApiRequest(`/admin/posts?page=${page}&pageSize=${pageSize}`);
}

export function getAdminPost(id: string): Promise<IAdminPost> {
  return adminApiRequest(`/admin/posts/${encodeURIComponent(id)}`);
}

export function getAdminDashboard(): Promise<IAdminDashboard> {
  return adminApiRequest("/admin/dashboard");
}

export function getAdminComments(): Promise<IAdminComment[]> {
  return adminApiRequest("/admin/comments");
}

export function getAdminUsers(): Promise<IAdminUser[]> {
  return adminApiRequest("/admin/users");
}

export async function getEditorTaxonomy(): Promise<{
  categories: IAdminTaxonomy[];
  tags: IAdminTaxonomy[];
}> {
  const [categories, tags] = await Promise.all([
    adminApiRequest<IAdminTaxonomy[]>("/categories"),
    adminApiRequest<IAdminTaxonomy[]>("/tags")
  ]);
  return { categories, tags };
}
