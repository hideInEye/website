import { useLoaderData } from "react-router-dom";
import { usersLoader } from "../../loaders";
import { AdminPageHeader } from "@/components/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { UserStatusTable } from "@/features/admin";

export default function AdminUsersPage() {
  const users = useLoaderData<typeof usersLoader>();
  return (
    <>
      <AdminPageHeader title="用户" description="管理账号状态，不公开私人收藏和邮箱。" />
      <div className="p-5 sm:p-8">
        <Card>
          <CardContent>
            <UserStatusTable initialUsers={users} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
