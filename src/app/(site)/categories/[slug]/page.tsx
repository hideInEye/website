import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategories, getPosts, TaxonomyArchive } from "@/features/articles";

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

  return <TaxonomyArchive type="category" taxonomy={category} posts={posts} />;
}
