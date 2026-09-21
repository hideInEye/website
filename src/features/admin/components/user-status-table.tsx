"use client";

import { ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ApiClientError } from "@/shared/api-client/response";
import { updateUserStatus } from "../api-browser";
import type { IAdminUser } from "../types";

const statusLabels = {
  PENDING_VERIFICATION: "待验证",
  ACTIVE: "正常",
  SUSPENDED: "已暂停"
} as const;

export function UserStatusTable({ initialUsers }: { initialUsers: IAdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [pendingId, setPendingId] = useState<string>();
  const [confirmSuspendId, setConfirmSuspendId] = useState<string>();

  async function changeStatus(id: string, status: "ACTIVE" | "SUSPENDED") {
    setPendingId(id);
    try {
      await updateUserStatus(id, status);
      setUsers((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
      setConfirmSuspendId(undefined);
      toast.success(status === "ACTIVE" ? "账号已恢复" : "账号已暂停");
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "账号状态更新失败");
    } finally {
      setPendingId(undefined);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>用户</TableHead>
          <TableHead>角色</TableHead>
          <TableHead>状态</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <p className="font-medium">
                {user.displayName} · @{user.username}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </TableCell>
            <TableCell>
              {user.role === "ADMIN" ? (
                <Badge variant="sunset">
                  <ShieldCheckIcon />
                  管理员
                </Badge>
              ) : (
                <Badge variant="secondary">用户</Badge>
              )}
            </TableCell>
            <TableCell>{statusLabels[user.status]}</TableCell>
            <TableCell className="text-right">
              {user.role !== "ADMIN" ? (
                user.status === "SUSPENDED" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pendingId === user.id}
                    onClick={() => changeStatus(user.id, "ACTIVE")}
                  >
                    {pendingId === user.id ? <Spinner data-icon="inline-start" /> : null}
                    恢复
                  </Button>
                ) : confirmSuspendId === user.id ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={pendingId === user.id}
                      onClick={() => changeStatus(user.id, "SUSPENDED")}
                    >
                      {pendingId === user.id ? <Spinner data-icon="inline-start" /> : null}
                      确认暂停
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmSuspendId(undefined)}
                    >
                      取消
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setConfirmSuspendId(user.id)}>
                    暂停
                  </Button>
                )
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
