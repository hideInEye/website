import { useState } from "react";
import { AlertCircleIcon, EyeIcon, ImageUpIcon, SaveIcon, SendIcon } from "lucide-react";
import { useNavigate, useRevalidator } from "react-router-dom";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError } from "@/shared/api-client/response";
import { savePost, uploadPostImage } from "../api-browser";
import type { IAdminPost, IAdminTaxonomy, PostStatus } from "../types";
import { MarkdownEditor } from "./markdown-editor";
import { postEditorStyles as styles } from "./post-editor-form.styles";

const starter = `## 从这里开始\n\n写下这次观测。你可以切换到源码或差异模式，正文始终保存为 GFM Markdown。`;

export function PostEditorForm({
  initialPost,
  categories,
  tags
}: {
  initialPost?: IAdminPost;
  categories: IAdminTaxonomy[];
  tags: IAdminTaxonomy[];
}) {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [coverUrl, setCoverUrl] = useState(initialPost?.coverUrl ?? "");
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription ?? "");
  const [categoryId, setCategoryId] = useState(initialPost?.category.id ?? categories[0]?.id ?? "");
  const [tagIds, setTagIds] = useState(() => initialPost?.tags.map((tag) => tag.id) ?? []);
  const [markdown, setMarkdown] = useState(initialPost?.content ?? starter);
  const [savingStatus, setSavingStatus] = useState<PostStatus>();
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  function toggleTag(id: string, selected: boolean) {
    setTagIds((current) =>
      selected ? [...new Set([...current, id])] : current.filter((tagId) => tagId !== id)
    );
  }

  async function save(status: PostStatus) {
    if (!title.trim() || !excerpt.trim() || !markdown.trim() || !categoryId) {
      toast.error("请填写标题、摘要、正文并选择分类");
      return;
    }
    setSavingStatus(status);
    try {
      const saved = await savePost(initialPost?.id, {
        title: title.trim(),
        excerpt: excerpt.trim(),
        slug: slug.trim() || undefined,
        content: markdown,
        coverUrl: coverUrl.trim() || null,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
        status,
        categoryId,
        tagIds
      });
      setSlug(saved.slug);
      toast.success(status === "PUBLISHED" ? "文章已发布" : "草稿已保存");
      if (!initialPost) await navigate(`/admin/posts/${saved.id}/edit`, { replace: true });
      else await revalidator.revalidate();
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "保存失败，请稍后重试");
    } finally {
      setSavingStatus(undefined);
    }
  }

  async function uploadCover(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      setCoverUrl(await uploadPostImage(file));
      toast.success("封面已上传");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "封面上传失败");
    } finally {
      setIsUploadingCover(false);
      input.value = "";
    }
  }

  const saveStatus = initialPost?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const isSaving = savingStatus !== undefined;

  return (
    <div className={styles.form}>
      <div className={styles.main}>
        {categories.length === 0 ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>还没有可用分类</AlertTitle>
            <AlertDescription>请先在“分类”页面创建一个分类，再保存文章。</AlertDescription>
          </Alert>
        ) : null}
        <Card>
          <CardHeader>
            <CardTitle>文章内容</CardTitle>
            <CardDescription>摘要用于列表与搜索；正文始终保存为 GFM Markdown。</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">标题</FieldLabel>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="这次观测叫什么？"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="excerpt">摘要</FieldLabel>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  placeholder="用一两句话说明读者会看到什么。"
                />
                <FieldDescription>建议 80–160 字，用于列表页和搜索摘要。</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
        <MarkdownEditor
          markdown={markdown}
          onChange={setMarkdown}
          onImageUpload={uploadPostImage}
        />
      </div>
      <aside className={styles.aside}>
        <Card>
          <CardHeader>
            <CardTitle>发布</CardTitle>
            <CardDescription>发布后文章立即进入公开时间线。</CardDescription>
          </CardHeader>
          <CardContent className={styles.actions}>
            <Button
              className={styles.fullButton}
              disabled={isSaving || categories.length === 0}
              onClick={() => save("PUBLISHED")}
            >
              {savingStatus === "PUBLISHED" ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SendIcon data-icon="inline-start" />
              )}
              {initialPost?.status === "PUBLISHED" ? "保存并保持发布" : "发布文章"}
            </Button>
            <Button
              variant="outline"
              className={styles.fullButton}
              disabled={isSaving || categories.length === 0}
              onClick={() => save(saveStatus)}
            >
              {savingStatus === saveStatus ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SaveIcon data-icon="inline-start" />
              )}
              {initialPost ? "保存更改" : "保存草稿"}
            </Button>
            <Button
              variant="ghost"
              className={styles.fullButton}
              disabled={!initialPost}
              onClick={() =>
                initialPost
                  ? window.open(
                      `/admin/posts/${initialPost.id}/preview`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  : undefined
              }
            >
              <EyeIcon data-icon="inline-start" />
              预览
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>文章设置</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="留空则根据标题生成"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="coverUrl">封面</FieldLabel>
                <Input
                  id="coverUrl"
                  type="url"
                  value={coverUrl}
                  onChange={(event) => setCoverUrl(event.target.value)}
                  placeholder="https://…"
                />
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  aria-label="上传文章封面"
                  disabled={isUploadingCover}
                  onChange={uploadCover}
                />
                <FieldDescription className="flex items-center gap-1.5">
                  {isUploadingCover ? <Spinner /> : <ImageUpIcon className="size-3.5" />}
                  {isUploadingCover ? "正在上传封面" : "也可以直接粘贴已有图片地址。"}
                </FieldDescription>
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="封面预览"
                    className="aspect-[16/7] w-full rounded-lg border object-cover"
                  />
                ) : null}
              </Field>
              <Field>
                <FieldLabel htmlFor="category">分类</FieldLabel>
                <NativeSelect
                  id="category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  {categories.length === 0 ? <option value="">暂无分类</option> : null}
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <FieldSet>
                <FieldLegend>标签</FieldLegend>
                <FieldDescription>可选择多个内容坐标。</FieldDescription>
                <FieldGroup className={styles.tagList}>
                  {tags.map((tag) => (
                    <Field key={tag.id} className={styles.tagField}>
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={tagIds.includes(tag.id)}
                        onCheckedChange={(checked) => toggleTag(tag.id, checked === true)}
                      />
                      <FieldLabel htmlFor={`tag-${tag.id}`}>{tag.name}</FieldLabel>
                    </Field>
                  ))}
                  {tags.length === 0 ? (
                    <FieldDescription>尚未创建标签，文章仍可保存。</FieldDescription>
                  ) : null}
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>搜索与分享</CardTitle>
            <CardDescription>留空时使用文章标题和摘要。</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="seoTitle">SEO 标题</FieldLabel>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  maxLength={255}
                  onChange={(event) => setSeoTitle(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="seoDescription">SEO 描述</FieldLabel>
                <Textarea
                  id="seoDescription"
                  value={seoDescription}
                  maxLength={500}
                  onChange={(event) => setSeoDescription(event.target.value)}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
