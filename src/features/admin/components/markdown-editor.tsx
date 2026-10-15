import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MarkdownEditorInner = lazy(() =>
  import("./markdown-editor-inner").then((module) => ({ default: module.MarkdownEditorInner }))
);

export function MarkdownEditor(props: {
  markdown: string;
  onChange: (value: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}) {
  return (
    <Suspense fallback={<Skeleton className="h-[34rem] w-full" />}>
      <MarkdownEditorInner {...props} />
    </Suspense>
  );
}
