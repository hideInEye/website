import Link from "next/link";
import { FolderTreeIcon, TagsIcon } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { ArticleCard } from "./article-card";
import { Pagination } from "./pagination";
import { taxonomyArchiveStyles as styles } from "./taxonomy-archive.styles";
import type { PaginatedPosts, Taxonomy } from "../types";

export function TaxonomyArchive({
  type,
  taxonomy,
  posts
}: {
  type: "category" | "tag";
  taxonomy: Taxonomy;
  posts: PaginatedPosts;
}) {
  const isCategory = type === "category";
  const Icon = isCategory ? FolderTreeIcon : TagsIcon;
  const basePath = isCategory ? "categories" : "tags";
  const title = isCategory ? taxonomy.name : `# ${taxonomy.name}`;
  const description = isCategory
    ? `${taxonomy.description || "同一片观测区域里的文章。"} 共 ${posts.total} 篇。`
    : `标记在这个坐标下的 ${posts.total} 篇文章。`;

  return (
    <main className={styles.page}>
      <PageHeading
        eyebrow={isCategory ? "Category" : "Coordinate"}
        title={title}
        description={description}
      />
      {posts.items.length > 0 ? (
        <div className={styles.list}>
          {posts.items.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <Empty className={styles.empty}>
          <EmptyHeader>
            <EmptyMedia>
              <Icon className={styles.emptyIcon} />
            </EmptyMedia>
            <EmptyTitle>这里还没有已发布文章</EmptyTitle>
            <EmptyDescription>
              {isCategory
                ? "这个分类已经建立，文章发布后会出现在这里。"
                : "这个标签暂时没有关联已发布文章。"}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="outline">
              <Link href="/">返回首页</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
      <div className={styles.pagination}>
        <Pagination
          currentPage={posts.page}
          totalPages={posts.totalPages}
          buildHref={(nextPage) => `/${basePath}/${taxonomy.slug}?page=${nextPage}`}
        />
      </div>
    </main>
  );
}
