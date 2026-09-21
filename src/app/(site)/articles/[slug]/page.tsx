import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Clock3Icon, MessageCircleIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArticleCard,
  ArticleTableOfContents,
  BookmarkButton,
  extractArticleHeadings,
  getBookmarkState,
  getPostBySlug,
  getPosts,
  MarkdownContent,
  ReadingProgress
} from "@/features/articles";
import { CommentSection, getPostComments } from "@/features/comments";
import { formatDate } from "@/lib/format";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "文章未找到" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/articles/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags.map((tag) => tag.name),
      images: post.coverUrl ? [{ url: post.coverUrl }] : undefined
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPostBySlug(slug), getPosts({ pageSize: 4 })]);
  if (!post) notFound();
  if (post.canonicalSlug && post.canonicalSlug !== slug) {
    permanentRedirect(`/articles/${post.canonicalSlug}`);
  }
  const [comments, bookmarked] = await Promise.all([
    getPostComments(post.id),
    getBookmarkState(post.id)
  ]);
  const related = posts.items.filter((item) => item.id !== post.id).slice(0, 2);
  const headings = extractArticleHeadings(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author.displayName, url: `/u/${post.author.username}` },
    image: post.coverUrl,
    inLanguage: "zh-CN"
  };

  return (
    <main>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <article>
        <header className="border-b">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="sunset">{post.category.name}</Badge>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock3Icon className="size-3.5" />
                {post.readingMinutes} 分钟阅读
              </span>
            </div>
            <h1 className="font-literary text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-balance text-lg leading-8 text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t pt-6">
              <Link
                href={`/u/${post.author.username}`}
                className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="size-10">
                  <AvatarImage src={post.author.avatarUrl} alt="" />
                  <AvatarFallback>{post.author.displayName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span>
                  <strong className="block text-sm">{post.author.displayName}</strong>
                  <span className="text-xs text-muted-foreground">{post.author.bio}</span>
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageCircleIcon className="size-4" />
                  {post.commentCount}
                </span>
                <BookmarkButton
                  postId={post.id}
                  initialCount={post.bookmarkCount}
                  initialBookmarked={bookmarked}
                />
              </div>
            </div>
          </div>
        </header>

        {post.coverUrl ? (
          <figure className="mx-auto mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverUrl}
              alt=""
              className="aspect-[16/7] w-full rounded-2xl border object-cover shadow-lg"
            />
          </figure>
        ) : null}

        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_15rem] lg:px-8">
          <div className="min-w-0">
            <ArticleTableOfContents headings={headings} className="mb-8 lg:hidden" />
            <MarkdownContent content={post.content} />
            <div className="mt-12 flex flex-wrap gap-2 border-t pt-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
            <CommentSection postId={post.id} commentCount={post.commentCount} comments={comments} />
          </div>
          <aside className="hidden lg:block">
            <ArticleTableOfContents headings={headings} className="sticky top-24" />
          </aside>
        </div>
      </article>

      {related.length ? (
        <section className="border-t bg-muted/25">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="mb-4 font-literary text-2xl font-semibold">沿着轨迹继续</h2>
            <div className="divide-y">
              {related.map((item) => (
                <ArticleCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
