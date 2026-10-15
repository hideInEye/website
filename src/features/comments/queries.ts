import { browserApiRequest } from "@/shared/api-client";
import type { IComment } from "./types";

export function getPostComments(postId: string): Promise<IComment[]> {
  return browserApiRequest(`/posts/${encodeURIComponent(postId)}/comments`);
}
