import { Link } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import { postsLoader } from "../../loaders";
import { Edit3Icon, PlusIcon } from "lucide-react";

import { AdminPageHeader } from "@/components/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

export default function AdminPostsPage() {
  const posts = useLoaderData<typeof postsLoader>();
  return (
    <>
      <AdminPageHeader
        title="文章"
        description={`共 ${posts.total} 篇观测日志。`}
        action={
          <Button asChild>
            <Link to="/admin/posts/new">
              <PlusIcon data-icon="inline-start" />
              新建文章
            </Link>
          </Button>
        }
      />
      <div className="p-5 sm:p-8">
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>发布日期</TableHead>
                  <TableHead className="w-20 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.items.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="font-medium">{post.title}</div>
                      <div className="mt-1 max-w-lg truncate text-xs text-muted-foreground">
                        /{post.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{post.category.name}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {post.publishedAt ? formatDate(post.publishedAt) : "未发布"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link to={`/admin/posts/${post.id}/edit`} aria-label={`编辑 ${post.title}`}>
                          <Edit3Icon />
                        </Link>
                      </Button>
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
