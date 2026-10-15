import { redirect } from "react-router-dom";
import { ApiClientError, browserApiRequest } from "@/shared/api-client";
import type { IAdminComment, IAdminDashboard, IAdminPost, IAdminPostList, IAdminTaxonomy, IAdminUser, ICurrentUser } from "./types";

async function adminApiRequest<T>(path: string): Promise<T> {
  try { return await browserApiRequest<T>(path); }
  catch (error) {
    if (error instanceof ApiClientError && error.status === 401) throw redirect(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
    if (error instanceof ApiClientError && error.status === 403) throw redirect("/");
    throw error;
  }
}

export const getCurrentUser = () => browserApiRequest<ICurrentUser>("/auth/me");
export const getAdminPosts = (page = 1, pageSize = 20) => adminApiRequest<IAdminPostList>(`/admin/posts?page=${page}&pageSize=${pageSize}`);
export const getAdminPost = (id: string) => adminApiRequest<IAdminPost>(`/admin/posts/${encodeURIComponent(id)}`);
export const getAdminDashboard = () => adminApiRequest<IAdminDashboard>("/admin/dashboard");
export const getAdminComments = () => adminApiRequest<IAdminComment[]>("/admin/comments");
export const getAdminUsers = () => adminApiRequest<IAdminUser[]>("/admin/users");
export async function getEditorTaxonomy() {
  const [categories, tags] = await Promise.all([
    adminApiRequest<IAdminTaxonomy[]>("/categories"), adminApiRequest<IAdminTaxonomy[]>("/tags")
  ]);
  return { categories, tags };
}
