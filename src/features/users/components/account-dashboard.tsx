import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookmarkIcon,
  LogOutIcon,
  MessageCircleIcon,
  Trash2Icon,
  UserRoundIcon
} from "lucide-react";
import { useNavigate, useRevalidator } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import { logout } from "@/features/auth";
import { uploadImage } from "@/features/media";
import { ApiClientError } from "@/shared/api-client/response";
import { deleteOwnComment, removeBookmark, updateProfile } from "../api";
import type { IAccountOverview } from "../types";

const profileSchema = z.object({
  displayName: z.string().min(2, "显示名称至少 2 位").max(80),
  username: z
    .string()
    .min(2, "用户名至少 2 位")
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/, "只能使用字母、数字、横线与下划线"),
  bio: z.string().max(500, "简介不能超过 500 字"),
  avatarUrl: z.union([z.url("请输入有效的图片地址"), z.literal("")])
});

type ProfileValues = z.infer<typeof profileSchema>;

const statusLabels = {
  PENDING: "待审核",
  APPROVED: "已发布",
  REJECTED: "未通过",
  DELETED: "已删除"
} as const;

function EmptyState({
  icon: Icon,
  title,
  description
}: {
  icon: typeof BookmarkIcon;
  title: string;
  description: string;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function AccountDashboard({ overview }: { overview: IAccountOverview }) {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [bookmarks, setBookmarks] = useState(overview.bookmarks);
  const [comments, setComments] = useState(overview.comments);
  const [removingId, setRemovingId] = useState<string>();
  const [deletingCommentId, setDeletingCommentId] = useState<string>();
  const [confirmCommentId, setConfirmCommentId] = useState<string>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: overview.profile.displayName,
      username: overview.profile.username,
      bio: overview.profile.bio ?? "",
      avatarUrl: overview.profile.avatarUrl ?? ""
    }
  });

  async function saveProfile(values: ProfileValues) {
    try {
      await updateProfile({
        displayName: values.displayName,
        username: values.username,
        bio: values.bio,
        avatarUrl: values.avatarUrl || undefined
      });
      toast.success("公开资料已保存");
      void revalidator.revalidate();
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "资料保存失败");
    }
  }

  async function deleteBookmark(postId: string) {
    setRemovingId(postId);
    try {
      await removeBookmark(postId);
      setBookmarks((items) => items.filter((item) => item.id !== postId));
      toast.success("已取消收藏");
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "取消收藏失败");
    } finally {
      setRemovingId(undefined);
    }
  }

  async function signOut() {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("已退出登录");
      await navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "退出登录失败");
      setIsLoggingOut(false);
    }
  }

  async function deleteComment(id: string) {
    setDeletingCommentId(id);
    try {
      await deleteOwnComment(id);
      setComments((items) => items.filter((item) => item.id !== id));
      setConfirmCommentId(undefined);
      toast.success("评论已删除");
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "评论删除失败");
    } finally {
      setDeletingCommentId(undefined);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const url = await uploadImage(file);
      form.setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true });
      toast.success("头像已上传，保存资料后公开");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "头像上传失败");
    } finally {
      setIsUploadingAvatar(false);
      input.value = "";
    }
  }

  return (
    <div className="mt-10 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card/45 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          当前账号 <span className="font-medium text-foreground">{overview.profile.email}</span>
        </p>
        <Button type="button" size="sm" variant="ghost" disabled={isLoggingOut} onClick={signOut}>
          {isLoggingOut ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <LogOutIcon data-icon="inline-start" />
          )}
          {isLoggingOut ? "正在退出" : "退出登录"}
        </Button>
      </div>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <UserRoundIcon data-icon="inline-start" />
            资料
          </TabsTrigger>
          <TabsTrigger value="bookmarks">
            <BookmarkIcon data-icon="inline-start" />
            收藏
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageCircleIcon data-icon="inline-start" />
            评论
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>公开资料</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(saveProfile)} noValidate>
                <FieldGroup>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="displayName">显示名称</FieldLabel>
                      <Input
                        id="displayName"
                        autoComplete="name"
                        {...form.register("displayName")}
                      />
                      <FieldError>{form.formState.errors.displayName?.message}</FieldError>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="username">用户名</FieldLabel>
                      <Input id="username" autoComplete="username" {...form.register("username")} />
                      <FieldDescription>公开主页使用 /u/用户名。</FieldDescription>
                      <FieldError>{form.formState.errors.username?.message}</FieldError>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="bio">个人简介</FieldLabel>
                    <Textarea id="bio" {...form.register("bio")} />
                    <FieldError>{form.formState.errors.bio?.message}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="avatarUrl">头像地址</FieldLabel>
                    <Input
                      id="avatarUrl"
                      type="url"
                      inputMode="url"
                      {...form.register("avatarUrl")}
                    />
                    <FieldDescription>支持 HTTPS 图片地址；留空则显示名称首字母。</FieldDescription>
                    <FieldError>{form.formState.errors.avatarUrl?.message}</FieldError>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      aria-label="上传头像"
                      disabled={isUploadingAvatar}
                      onChange={uploadAvatar}
                    />
                    {isUploadingAvatar ? (
                      <FieldDescription className="flex items-center gap-1.5">
                        <Spinner />
                        正在上传头像
                      </FieldDescription>
                    ) : null}
                  </Field>
                  <Button
                    type="submit"
                    className="self-start"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                    {form.formState.isSubmitting ? "保存中" : "保存资料"}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarks">
          {bookmarks.length ? (
            <div className="grid gap-3">
              {bookmarks.map((post) => (
                <Card key={post.id}>
                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        to={`/articles/${post.slug}`}
                        className="font-literary font-semibold hover:underline"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {post.category.name} · 发布于 {formatDate(post.publishedAt)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      disabled={removingId === post.id}
                      onClick={() => deleteBookmark(post.id)}
                      aria-label={`取消收藏《${post.title}》`}
                    >
                      {removingId === post.id ? <Spinner /> : <Trash2Icon />}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookmarkIcon}
              title="还没有收藏"
              description="文章页上的书签会收进这里。"
            />
          )}
        </TabsContent>

        <TabsContent value="comments">
          {comments.length ? (
            <div className="grid gap-3">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        to={`/articles/${comment.post.slug}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {comment.post.title}
                      </Link>
                      <Badge variant={comment.status === "PENDING" ? "sunset" : "secondary"}>
                        {statusLabels[comment.status]}
                      </Badge>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{comment.content}</p>
                    <time dateTime={comment.createdAt} className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </time>
                    <div className="flex justify-end gap-2">
                      {confirmCommentId === comment.id ? (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={deletingCommentId === comment.id}
                            onClick={() => deleteComment(comment.id)}
                          >
                            {deletingCommentId === comment.id ? (
                              <Spinner data-icon="inline-start" />
                            ) : null}
                            确认删除
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmCommentId(undefined)}
                          >
                            取消
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmCommentId(comment.id)}
                        >
                          <Trash2Icon data-icon="inline-start" />
                          删除
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageCircleIcon}
              title="还没有评论"
              description="你的公开与待审核评论都会显示在这里。"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
