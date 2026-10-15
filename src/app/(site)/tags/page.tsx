import type { Metadata } from "next";

import { getTags, TaxonomyDirectory } from "@/features/articles";

export const metadata: Metadata = {
  title: "文章标签",
  description: "按标签浏览日落的足迹中的文章。"
};

export default async function TagsPage() {
  const tags = await getTags();

  return <TaxonomyDirectory type="tag" items={tags} />;
}
