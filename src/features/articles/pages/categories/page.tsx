import { useLoaderData } from "react-router-dom";
import { categoriesLoader } from "../../loaders";
import { TaxonomyDirectory } from "@/features/articles";

export default function CategoriesPage() {
  const categories = useLoaderData<typeof categoriesLoader>();
  return <TaxonomyDirectory type="category" items={categories} />;
}
