import { BookmarkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateBookmark } from "../bookmarks-api";

export function BookmarkButton({
  postId,
  initialCount,
  initialBookmarked
}: {
  postId: string;
  initialCount: number;
  initialBookmarked: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [count, setCount] = useState(initialCount);

  async function toggle() {
    const next = !bookmarked;
    setBookmarked(next);
    setCount((value) => value + (next ? 1 : -1));
    try {
      await updateBookmark(postId, next);
      toast.success(next ? "已收藏这篇文章" : "已取消收藏");
    } catch {
      setBookmarked(!next);
      setCount((value) => value + (next ? -1 : 1));
      toast.info("登录后即可收藏文章");
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={toggle} aria-pressed={bookmarked}>
      <BookmarkIcon data-icon="inline-start" className={bookmarked ? "fill-current" : undefined} />
      {count}
    </Button>
  );
}
