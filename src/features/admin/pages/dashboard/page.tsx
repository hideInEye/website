import { Link } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import { dashboardLoader } from "../../loaders";
import { BookmarkIcon, FileTextIcon, MessageSquareTextIcon, UsersIcon } from "lucide-react";

import { AdminPageHeader } from "@/components/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

const statusLabels = { DRAFT: "草稿", PUBLISHED: "已发布", ARCHIVED: "已归档" } as const;

export default function AdminDashboardPage() {
  const { dashboard, posts } = useLoaderData<typeof dashboardLoader>();
  const stats = [
    {
      label: "已发布文章",
      value: dashboard.posts.published,
      detail: `全部 ${dashboard.posts.total} 篇`,
      icon: FileTextIcon
    },
    {
      label: "注册用户",
      value: dashboard.users,
      detail: "含待验证账号",
      icon: UsersIcon
    },
    {
      label: "待审核评论",
      value: dashboard.pendingComments,
      detail: dashboard.pendingComments ? "需要处理" : "队列已清空",
      icon: MessageSquareTextIcon
    },
    {
      label: "累计收藏",
      value: dashboard.bookmarks,
      detail: `${dashboard.posts.drafts} 篇草稿`,
      icon: BookmarkIcon
    }
  ];

  return (
    <>
      <AdminPageHeader title="站点概览" description="来自数据库的最新内容与社区状态。" />
      <div className="flex flex-col gap-6 p-5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, detail, icon: Icon }) => (
            <Card key={label} className="gap-4">
              <CardHeader className="flex-row items-center justify-between">
                <CardDescription>{label}</CardDescription>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="font-literary text-3xl font-semibold">{value.toLocaleString()}</p>
                <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>最近文章</CardTitle>
            <CardDescription>按最后更新时间排列。</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead className="text-right">更新于</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.items.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <Link to={`/admin/posts/${post.id}/edit`} className="hover:underline">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === "PUBLISHED" ? "sunset" : "secondary"}>
                        {statusLabels[post.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{post.category.name}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(post.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
