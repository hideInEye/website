import { AdminPageHeader } from "@/components/admin-page-header";
import { CommentModerationList } from "@/features/admin";
import { getAdminComments } from "@/features/admin/server";

export default async function AdminCommentsPage() {
  const comments = await getAdminComments();

  return (
    <>
      <AdminPageHeader title="评论审核" description="每位用户的第一条评论需要确认。" />
      <div className="p-5 sm:p-8">
        <CommentModerationList initialComments={comments} />
      </div>
    </>
  );
}
