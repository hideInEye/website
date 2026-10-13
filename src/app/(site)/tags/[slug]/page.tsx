import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPosts, getTags, TaxonomyArchive } from "@/features/articles";

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

  return <TaxonomyArchive type="tag" taxonomy={tag} posts={posts} />;
}
