import { AdminPageHeader } from "@/components/admin-page-header";
import { PostEditorForm } from "@/features/admin";
import { getEditorTaxonomy } from "@/features/admin/server";

export default async function NewPostPage() {
  const { categories, tags } = await getEditorTaxonomy();
  return (
    <>
      <AdminPageHeader title="新建文章" description="正文将以 GFM Markdown 保存。" />
      <div className="p-5 sm:p-8">
        <PostEditorForm categories={categories} tags={tags} />
      </div>
    </>
  );
}
