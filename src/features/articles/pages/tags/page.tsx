import { useLoaderData } from "react-router-dom";
import { tagsLoader } from "../../loaders";
import { TaxonomyDirectory } from "@/features/articles";

export default function TagsPage() {
  const tags = useLoaderData<typeof tagsLoader>();
  return <TaxonomyDirectory type="tag" items={tags} />;
}
