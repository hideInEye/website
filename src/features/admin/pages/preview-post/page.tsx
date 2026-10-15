import { Link } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import { previewPostLoader } from "../../loaders";
import { ArrowLeftIcon } from "lucide-react";

import { AdminPageHeader } from "@/components/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArticleTableOfContents,
  extractArticleHeadings,
  MarkdownContent
} from "@/features/articles";

export default function AdminPostPreviewPage() {
  const post = useLoaderData<typeof previewPostLoader>();
  const headings = extractArticleHeadings(post.content);

  return (
    <>
      <AdminPageHeader title="文章预览" description="此页面仅管理员可见，不改变发布状态。" />
      <div className="p-5 sm:p-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to={`/admin/posts/${post.id}/edit`}>
                <ArrowLeftIcon data-icon="inline-start" />
                返回编辑
              </Link>
            </Button>
            <Badge variant={post.status === "PUBLISHED" ? "sunset" : "secondary"}>
              {post.status === "PUBLISHED" ? "已发布" : post.status === "DRAFT" ? "草稿" : "已归档"}
            </Badge>
          </div>
          <header className="flex max-w-3xl flex-col gap-4">
            <p className="text-sm text-primary">{post.category.name}</p>
            <h1 className="font-literary text-4xl font-semibold tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
          </header>
          {post.coverUrl ? (
            <img
              src={post.coverUrl}
              alt=""
              className="aspect-[16/7] w-full rounded-2xl border object-cover"
            />
          ) : null}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <MarkdownContent content={post.content} />
            <aside className="hidden lg:block">
              <ArticleTableOfContents headings={headings} className="sticky top-24" />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
