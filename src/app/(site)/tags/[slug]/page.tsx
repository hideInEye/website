import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/page-heading";
import { ArticleCard, getPosts, getTags, Pagination } from "@/features/articles";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = (await getTags()).find((item) => item.slug === slug);
  return { title: tag ? `#${tag.name}` : "标签" };
}

export default async function TagPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Number(query.page) || 1);
  const [allTags, posts] = await Promise.all([
    getTags(),
    getPosts({ tag: slug, page, pageSize: 8 })
  ]);
  const tag = allTags.find((item) => item.slug === slug);
  if (!tag) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <PageHeading
        eyebrow="Coordinate"
        title={`# ${tag.name}`}
        description={`标记在这个坐标下的 ${posts.total} 篇文章。`}
      />
      <div className="mt-12 divide-y">
        {posts.items.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination
        currentPage={posts.page}
        totalPages={posts.totalPages}
        buildHref={(nextPage) => `/tags/${slug}?page=${nextPage}`}
      />
    </main>
  );
}
