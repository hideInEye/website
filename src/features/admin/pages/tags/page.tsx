import { useLoaderData } from "react-router-dom";
import { editorLoader } from "../../loaders";
import { AdminPageHeader } from "@/components/admin-page-header";
import { TaxonomyManager } from "@/features/admin";
export default function AdminTagsPage() {
  const { tags: items } = useLoaderData<typeof editorLoader>();
  return (
    <>
      <AdminPageHeader title="标签" description="标签用于跨分类建立内容坐标。" />
      <div className="p-5 sm:p-8">
        <TaxonomyManager kind="标签" type="tags" initialItems={items} />
      </div>
    </>
  );
}
