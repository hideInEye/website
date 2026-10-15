import { useLoaderData } from "react-router-dom";
import { editPostLoader } from "../../loaders";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PostEditorForm } from "@/features/admin";

export default function EditPostPage() {
  const { post, categories, tags } = useLoaderData<typeof editPostLoader>();
  return (
    <>
      <AdminPageHeader title="编辑文章" description={`最后更新：${post.updatedAt}`} />
      <div className="p-5 sm:p-8">
        <PostEditorForm initialPost={post} categories={categories} tags={tags} />
      </div>
    </>
  );
}
