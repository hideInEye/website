import { AdminPageHeader } from "@/components/admin-page-header";
import { TaxonomyManager } from "@/features/admin";
import { getEditorTaxonomy } from "@/features/admin/server";
export default async function AdminTagsPage() {
  const { tags: items } = await getEditorTaxonomy();
  return (
    <>
      <AdminPageHeader title="标签" description="标签用于跨分类建立内容坐标。" />
      <div className="p-5 sm:p-8">
        <TaxonomyManager kind="标签" type="tags" initialItems={items} />
      </div>
    </>
  );
}
