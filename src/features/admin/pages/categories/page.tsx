import { useLoaderData } from "react-router-dom";
import { editorLoader } from "../../loaders";
import { AdminPageHeader } from "@/components/admin-page-header";
import { TaxonomyManager } from "@/features/admin";
export default function AdminCategoriesPage() {
  const { categories: items } = useLoaderData<typeof editorLoader>();
  return (
    <>
      <AdminPageHeader title="分类" description="分类代表稳定的内容区域。" />
      <div className="p-5 sm:p-8">
        <TaxonomyManager kind="分类" type="categories" initialItems={items} />
      </div>
    </>
  );
}
