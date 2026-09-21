"use client";

import { AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <AlertTriangleIcon className="mx-auto size-10 text-primary" />
        <h1 className="mt-5 font-literary text-3xl font-semibold">观测暂时中断</h1>
        <p className="mt-3 text-muted-foreground">数据没有成功抵达，再试一次通常就会恢复。</p>
        <Button className="mt-6" onClick={reset}>
          重新加载
        </Button>
      </div>
    </main>
  );
}
