import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  FileTextIcon,
  FolderTreeIcon,
  GaugeIcon,
  MessageSquareTextIcon,
  TagsIcon,
  UsersIcon
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "概览", icon: GaugeIcon },
  { href: "/admin/posts", label: "文章", icon: FileTextIcon },
  { href: "/admin/categories", label: "分类", icon: FolderTreeIcon },
  { href: "/admin/tags", label: "标签", icon: TagsIcon },
  { href: "/admin/comments", label: "评论", icon: MessageSquareTextIcon },
  { href: "/admin/users", label: "用户", icon: UsersIcon }
] as const;

export function AdminNav() {
  const { pathname } = useLocation();
  return (
    <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col" aria-label="后台导航">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            to={href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              active && "bg-accent text-accent-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
