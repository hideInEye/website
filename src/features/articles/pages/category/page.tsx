import { useLoaderData } from "react-router-dom";
import { categoryLoader } from "../../loaders";
import { TaxonomyArchive } from "@/features/articles";

export default function CategoryPage() {
  const { taxonomy: category, posts } = useLoaderData<typeof categoryLoader>();
  return <TaxonomyArchive type="category" taxonomy={category} posts={posts} />;
}
