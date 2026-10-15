import { Form, useLoaderData } from "react-router-dom";
import { searchLoader } from "../../loaders";
import { SearchIcon } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { ArticleCard, Pagination } from "@/features/articles";

export default function SearchPage() {
  const { query, posts } = useLoaderData<typeof searchLoader>();
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <PageHeading
        eyebrow="Search the log"
        title="搜索观测日志"
        description="从标题、摘要和正文里寻找一个词、一段代码或某次旅途。"
      />
      <Form method="get" action="/search" className="mt-9 flex gap-2">
        <Input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="例如：React、Markdown、青岛"
          aria-label="搜索词"
          className="h-11"
        />
        <Button type="submit" size="lg">
          <SearchIcon data-icon="inline-start" />
          搜索
        </Button>
      </Form>

      {posts ? (
        posts.items.length ? (
          <>
            <p className="mt-10 text-sm text-muted-foreground">
              “{query}” 找到 {posts.total} 条记录
            </p>
            <div className="mt-3 divide-y">
              {posts.items.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={posts.page}
              totalPages={posts.totalPages}
              buildHref={(nextPage) => `/search?q=${encodeURIComponent(query)}&page=${nextPage}`}
            />
          </>
        ) : (
          <Empty className="mt-10">
            <EmptyHeader>
              <EmptyMedia>
                <SearchIcon />
              </EmptyMedia>
              <EmptyTitle>没有找到相符的轨迹</EmptyTitle>
              <EmptyDescription>换一个更短的关键词，或从分类和标签开始浏览。</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )
      ) : (
        <div className="mt-12 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <p className="rounded-xl border bg-card/45 p-4">
            按技术名称搜索
            <br />
            <strong className="mt-1 block text-foreground">React / Docker</strong>
          </p>
          <p className="rounded-xl border bg-card/45 p-4">
            按地点搜索
            <br />
            <strong className="mt-1 block text-foreground">青岛 / 海边</strong>
          </p>
          <p className="rounded-xl border bg-card/45 p-4">
            按主题搜索
            <br />
            <strong className="mt-1 block text-foreground">写作 / 架构</strong>
          </p>
        </div>
      )}
    </main>
  );
}
