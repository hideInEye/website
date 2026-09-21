import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/page-heading";
import { ArticleCard, getCategories, getPosts, Pagination } from "@/features/articles";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  return { title: category?.name ?? "分类", description: category?.description };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Number(query.page) || 1);
  const [allCategories, posts] = await Promise.all([
    getCategories(),
    getPosts({ category: slug, page, pageSize: 8 })
  ]);
  const category = allCategories.find((item) => item.slug === slug);
  if (!category) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <PageHeading
        eyebrow="Category"
        title={category.name}
        description={`${category.description ?? "同一片观测区域里的文章。"} 共 ${posts.total} 篇。`}
      />
      <div className="mt-12 divide-y">
        {posts.items.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination
        currentPage={posts.page}
        totalPages={posts.totalPages}
        buildHref={(nextPage) => `/categories/${slug}?page=${nextPage}`}
      />
    </main>
  );
}
