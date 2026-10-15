import { Link } from "react-router-dom";
import { CheckIcon, MessageSquareTextIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/format";
import { ApiClientError } from "@/shared/api-client/response";
import { moderateComment } from "../api-browser";
import type { IAdminComment } from "../types";

export function CommentModerationList({ initialComments }: { initialComments: IAdminComment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [pendingId, setPendingId] = useState<string>();
  const [confirmRejectId, setConfirmRejectId] = useState<string>();

  async function moderate(id: string, status: "APPROVED" | "REJECTED") {
    setPendingId(id);
    try {
      await moderateComment(id, status);
      setComments((items) => items.filter((item) => item.id !== id));
      setConfirmRejectId(undefined);
      toast.success(status === "APPROVED" ? "评论已公开" : "评论已拒绝");
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "审核操作失败");
    } finally {
      setPendingId(undefined);
    }
  }

  if (!comments.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <MessageSquareTextIcon />
          </EmptyMedia>
          <EmptyTitle>审核队列已清空</EmptyTitle>
          <EmptyDescription>新的首次评论会出现在这里。</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid gap-3">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/u/${comment.user.username}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {comment.user.displayName} · @{comment.user.username}
                </Link>
                <Badge variant="sunset">待审核</Badge>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{comment.content}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                <Link to={`/articles/${comment.post.slug}`} className="hover:underline">
                  {comment.post.title}
                </Link>
                <span aria-hidden="true"> · </span>
                <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                disabled={pendingId === comment.id}
                onClick={() => moderate(comment.id, "APPROVED")}
              >
                {pendingId === comment.id ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <CheckIcon data-icon="inline-start" />
                )}
                通过
              </Button>
              {confirmRejectId === comment.id ? (
                <>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={pendingId === comment.id}
                    onClick={() => moderate(comment.id, "REJECTED")}
                  >
                    {pendingId === comment.id ? <Spinner data-icon="inline-start" /> : null}
                    确认拒绝
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmRejectId(undefined)}>
                    取消
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pendingId === comment.id}
                  onClick={() => setConfirmRejectId(comment.id)}
                >
                  <XIcon data-icon="inline-start" />
                  拒绝
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
