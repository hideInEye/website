import type { Metadata } from "next";

import { getCategories, TaxonomyDirectory } from "@/features/articles";

export const metadata: Metadata = {
  title: "文章分类",
  description: "按主题浏览日落的足迹中的文章。"
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <TaxonomyDirectory type="category" items={categories} />;
}
