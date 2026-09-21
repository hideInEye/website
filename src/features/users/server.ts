import "server-only";

import { cache } from "react";

import { serverApiRequest } from "@/shared/api-client/server";

import type { IAccountOverview, IMyComment, IPrivateProfile, IPublicProfile } from "./types";
import type { PostSummary } from "@/features/articles";

export const getPublicProfile = cache((username: string): Promise<IPublicProfile> => {
  return serverApiRequest(`/users/${encodeURIComponent(username)}`);
});

export async function getAccountOverview(): Promise<IAccountOverview> {
  const [profile, bookmarks, comments] = await Promise.all([
    serverApiRequest<IPrivateProfile>("/users/me/profile", { authenticated: true }),
    serverApiRequest<PostSummary[]>("/bookmarks", { authenticated: true }),
    serverApiRequest<IMyComment[]>("/comments/mine", { authenticated: true })
  ]);
  return { profile, bookmarks, comments };
}
