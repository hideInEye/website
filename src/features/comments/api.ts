import { browserApiRequest } from "@/shared/api-client/browser";

import type { ICommentMutationResult } from "./types";

export function createComment(
  postId: string,
  content: string,
  parentId?: string
): Promise<ICommentMutationResult> {
  return browserApiRequest("/comments", { method: "POST", body: { postId, content, parentId } });
}
