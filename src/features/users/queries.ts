import { browserApiRequest } from "@/shared/api-client";
import type { PostSummary } from "@/features/articles";
import type { IAccountOverview, IMyComment, IPrivateProfile, IPublicProfile } from "./types";

export function getPublicProfile(username: string): Promise<IPublicProfile> {
  return browserApiRequest(`/users/${encodeURIComponent(username)}`);
}

export async function getAccountOverview(): Promise<IAccountOverview> {
  const [profile, bookmarks, comments] = await Promise.all([
    browserApiRequest<IPrivateProfile>("/users/me/profile"),
    browserApiRequest<PostSummary[]>("/bookmarks"),
    browserApiRequest<IMyComment[]>("/comments/mine")
  ]);
  return { profile, bookmarks, comments };
}
