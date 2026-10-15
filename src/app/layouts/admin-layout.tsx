import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ArrowUpRightIcon } from "lucide-react";

import { SunsetMark } from "@/components/sunset-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/features/admin";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/20 lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b bg-background/85 backdrop-blur lg:fixed lg:inset-y-0 lg:w-60 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/admin" className="flex items-center gap-2 font-literary font-semibold">
            <SunsetMark />
            观测台
          </Link>
          <ThemeToggle />
        </div>
        <AdminNav />
        <div className="hidden px-3 pt-4 lg:block">
          <Button asChild variant="outline" className="w-full">
            <Link to="/">
              查看站点
              <ArrowUpRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </aside>
      <main className="min-w-0 lg:col-start-2">
        <Outlet />
      </main>
    </div>
  );
}
