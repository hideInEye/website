import { AdminPageHeader } from "@/components/admin-page-header";
import { PostEditorForm } from "@/features/admin";
import { getAdminPost, getEditorTaxonomy } from "@/features/admin/server";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, { categories, tags }] = await Promise.all([getAdminPost(id), getEditorTaxonomy()]);
  return (
    <>
      <AdminPageHeader title="编辑文章" description={`最后更新：${post.updatedAt}`} />
      <div className="p-5 sm:p-8">
        <PostEditorForm initialPost={post} categories={categories} tags={tags} />
      </div>
    </>
  );
}
