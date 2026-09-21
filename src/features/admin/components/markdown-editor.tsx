"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MarkdownEditorInner = dynamic(
  () => import("./markdown-editor-inner").then((module) => module.MarkdownEditorInner),
  { ssr: false, loading: () => <Skeleton className="h-[34rem] w-full" /> }
);

export function MarkdownEditor(props: {
  markdown: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}) {
  return <MarkdownEditorInner {...props} />;
}
