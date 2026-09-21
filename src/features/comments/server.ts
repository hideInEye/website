import "server-only";

import { serverApiRequest } from "@/shared/api-client/server";

import type { IComment } from "./types";

export async function getPostComments(postId: string): Promise<IComment[]> {
  try {
    return await serverApiRequest<IComment[]>(`/posts/${encodeURIComponent(postId)}/comments`);
  } catch {
    return [];
  }
}
