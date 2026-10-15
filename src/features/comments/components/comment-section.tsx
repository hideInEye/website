import { Link } from "react-router-dom";
import { MessageCircleIcon, ReplyIcon, SendIcon, XIcon } from "lucide-react";
import { useRevalidator } from "react-router-dom";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import { ApiClientError } from "@/shared/api-client/response";
import { createComment } from "../api";
import type { IComment } from "../types";

function CommentItem({
  comment,
  isReply = false,
  onReply
}: {
  comment: IComment;
  isReply?: boolean;
  onReply: (comment: IComment) => void;
}) {
  return (
    <article className={isReply ? "ml-6 border-l pl-4 sm:ml-11" : undefined}>
      <div className="flex gap-3 py-4">
        <Avatar>
          <AvatarImage src={comment.user.avatarUrl ?? undefined} alt="" />
          <AvatarFallback>{comment.user.displayName.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link to={`/u/${comment.user.username}`} className="font-semibold hover:underline">
              {comment.user.displayName}
            </Link>
            <time dateTime={comment.createdAt} className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </time>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {comment.content}
          </p>
          {!isReply ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="self-start"
              onClick={() => onReply(comment)}
            >
              <ReplyIcon data-icon="inline-start" />
              回复
            </Button>
          ) : null}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply onReply={onReply} />
      ))}
    </article>
  );
}

export function CommentSection({
  postId,
  commentCount,
  comments
}: {
  postId: string;
  commentCount: number;
  comments: IComment[];
}) {
  const revalidator = useRevalidator();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<IComment>();

  function startReply(comment: IComment) {
    setReplyTo(comment);
    textareaRef.current?.focus();
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const result = await createComment(postId, content.trim(), replyTo?.id);
      setContent("");
      setReplyTo(undefined);
      toast.success(result.moderationRequired ? "评论已提交，审核后将公开" : "评论已发布");
      void revalidator.revalidate();
    } catch (error) {
      toast.error(
        error instanceof ApiClientError && error.status === 401
          ? "请先登录后再参与讨论"
          : error instanceof Error
            ? error.message
            : "评论提交失败"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="comments-heading" className="mt-16 border-t pt-10">
      <div className="mb-7 flex items-center gap-2">
        <MessageCircleIcon className="size-5 text-primary" />
        <h2 id="comments-heading" className="font-literary text-2xl font-semibold">
          讨论 · {commentCount}
        </h2>
      </div>
      <form onSubmit={submit} className="rounded-xl border bg-card/65 p-5">
        <Field>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <FieldLabel htmlFor="comment">
              {replyTo ? `回复 ${replyTo.user.displayName}` : "留下你的观察"}
            </FieldLabel>
            {replyTo ? (
              <Button type="button" variant="ghost" size="xs" onClick={() => setReplyTo(undefined)}>
                <XIcon data-icon="inline-start" />
                取消回复
              </Button>
            ) : null}
          </div>
          <Textarea
            ref={textareaRef}
            id="comment"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="保持友善，也欢迎不同视角……"
            maxLength={1000}
          />
          <div className="flex items-center justify-between gap-4">
            <FieldDescription>首次评论会进入审核，之后可直接发布。</FieldDescription>
            <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SendIcon data-icon="inline-start" />
              )}
              {isSubmitting ? "提交中" : "提交"}
            </Button>
          </div>
        </Field>
      </form>
      {comments.length ? (
        <div className="mt-7 divide-y">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={startReply} />
          ))}
        </div>
      ) : (
        <Empty className="mt-7 min-h-48">
          <EmptyHeader>
            <EmptyMedia>
              <MessageCircleIcon />
            </EmptyMedia>
            <EmptyTitle>还没有公开评论</EmptyTitle>
            <EmptyDescription>成为第一个留下观察的人。</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  );
}
