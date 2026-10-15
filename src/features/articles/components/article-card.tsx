import { Link } from "react-router-dom";
import { ArrowUpRightIcon, Clock3Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PostSummary } from "@/features/articles";
import { formatDate } from "@/lib/format";

export function ArticleCard({ post, featured = false }: { post: PostSummary; featured?: boolean }) {
  return (
    <article
      className={
        featured
          ? "group relative grid gap-6 rounded-2xl border bg-card/70 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-8"
          : "group relative py-6"
      }
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="sunset">{post.category.name}</Badge>
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1">
          <Clock3Icon className="size-3.5" />
          {post.readingMinutes} 分钟
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <h2
          className={
            featured
              ? "font-literary text-balance text-2xl font-semibold leading-snug sm:text-3xl"
              : "font-literary text-balance text-xl font-semibold leading-snug sm:text-2xl"
          }
        >
          <Link
            to={`/articles/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {post.title}
          </Link>
        </h2>
        <p className="max-w-2xl leading-7 text-muted-foreground">{post.excerpt}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag.id} className="text-xs text-muted-foreground">
              #{tag.name}
            </span>
          ))}
        </div>
        <ArrowUpRightIcon
          className="size-4 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}
