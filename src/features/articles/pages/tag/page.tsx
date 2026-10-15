import { useLoaderData } from "react-router-dom";
import { tagLoader } from "../../loaders";
import { TaxonomyArchive } from "@/features/articles";

export default function TagPage() {
  const { taxonomy: tag, posts } = useLoaderData<typeof tagLoader>();
  return <TaxonomyArchive type="tag" taxonomy={tag} posts={posts} />;
}
