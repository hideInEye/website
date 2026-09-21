import { browserApiRequest } from "@/shared/api-client/browser";

export function updateBookmark(postId: string, bookmarked: boolean): Promise<unknown> {
  return browserApiRequest(`/bookmarks/${encodeURIComponent(postId)}`, {
    method: bookmarked ? "PUT" : "DELETE"
  });
}
