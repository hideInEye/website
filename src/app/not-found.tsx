import { Link } from "react-router-dom";
import { TelescopeIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <TelescopeIcon className="size-8" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          404 · Lost coordinate
        </p>
        <h1 className="mt-3 font-literary text-4xl font-semibold">这条轨迹没有留下记录</h1>
        <p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground">
          链接可能已经改变，或这篇文章还停留在草稿里。
        </p>
        <Link to="/" className={`${buttonVariants()} mt-7`}>
          回到首页
        </Link>
      </div>
    </main>
  );
}
