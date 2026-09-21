import { browserApiRequest } from "@/shared/api-client/browser";
import { uploadImage } from "@/features/media";

import type { IAdminPost, IAdminTaxonomy, IPostMutation } from "./types";

export function savePost(postId: string | undefined, post: IPostMutation): Promise<IAdminPost> {
  return browserApiRequest(postId ? `/admin/posts/${encodeURIComponent(postId)}` : "/admin/posts", {
    method: postId ? "PATCH" : "POST",
    body: post
  });
}

export const uploadPostImage = uploadImage;

export function createTaxonomy(
  type: "categories" | "tags",
  taxonomy: Pick<IAdminTaxonomy, "name" | "slug"> & { description?: string }
): Promise<IAdminTaxonomy> {
  return browserApiRequest(`/admin/${type}`, { method: "POST", body: taxonomy });
}

export function deleteTaxonomy(
  type: "categories" | "tags",
  id: string
): Promise<{ deleted: true }> {
  return browserApiRequest(`/admin/${type}/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function moderateComment(
  id: string,
  status: "APPROVED" | "REJECTED"
): Promise<{ id: string; status: "APPROVED" | "REJECTED" }> {
  return browserApiRequest(`/admin/comments/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { status }
  });
}

export function updateUserStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED"
): Promise<{ id: string; username: string; status: "ACTIVE" | "SUSPENDED" }> {
  return browserApiRequest(`/admin/users/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: { status }
  });
}
