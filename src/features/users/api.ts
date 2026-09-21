import { browserApiRequest } from "@/shared/api-client/browser";

import type { IPrivateProfile, IProfileMutation } from "./types";

export function updateProfile(profile: IProfileMutation): Promise<IPrivateProfile> {
  return browserApiRequest("/users/me/profile", { method: "PATCH", body: profile });
}

export function removeBookmark(postId: string): Promise<{ bookmarked: false }> {
  return browserApiRequest(`/bookmarks/${encodeURIComponent(postId)}`, { method: "DELETE" });
}

export function deleteOwnComment(id: string): Promise<{ deleted: true }> {
  return browserApiRequest(`/comments/${encodeURIComponent(id)}`, { method: "DELETE" });
}
